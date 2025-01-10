﻿using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Entities;
using Olx.BLL.Entities.AdminMessages;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using OLX.API.Hubs;
using System.Net;


namespace Olx.BLL.Services
{
    public class AdminMessageService(
        IRepository<AdminMessage> adminMessageRepo,
        IRepository<Message> messageRepo,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext,
        IValidator<AdminMessageCreationModel> validator,
        IMapper mapper,
        IHubContext<MessageHub> hubContext,
        RoleManager<IdentityRole<int>> roleManager,
        IRepository<IdentityUserRole<int>> userRolesRepo
        ) : IAdminMessageService
    {
        public async Task<AdminMessageDto> UserCreate(AdminMessageCreationModel messageCreationModel)
        {
            validator.ValidateAndThrow(messageCreationModel);
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext,false);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            adminMessage.User = currentUser;
            currentUser.AdminMessages.Add(adminMessage);
            await userManager.UpdateAsync(currentUser);
            var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin)
               ?? throw new HttpException(Errors.InvalidRole, HttpStatusCode.InternalServerError);
            var adminIds = userRolesRepo.GetQuery()
                .Where(x => x.RoleId == adminRole.Id)
                .Select(z => z.UserId.ToString());
            await hubContext.Clients.Users(adminIds)
               .SendAsync(HubMethods.ReceiveUserMessage, adminMessage);
            return messageDto;
        }

        public async Task Delete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidAdminMessageId,HttpStatusCode.BadRequest);
            adminMessageRepo.Delete(message);
            await adminMessageRepo.SaveAsync();
        }

        public async Task<IEnumerable<AdminMessageDto>> GetAdminMessages()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetMessagesForAdmin());
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
        }

        public async Task<AdminMessageDto> GetById(int id)
        {
            var message = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetById(id))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            return  mapper.Map<AdminMessageDto>(message);
        }

        public async Task<IEnumerable<AdminMessageDto>> GetDeleted()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetDeleted());
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
        }

        public async Task<IEnumerable<AdminMessageDto>> GetUserMessages()
        {
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetMessagesForUser(currentUser.Id));
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
        }

        public async Task SoftDelete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetById(id,true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            message.Deleted = true;
            await adminMessageRepo.SaveAsync();
        }

        public async Task<AdminMessageDto> AdminCreate(AdminMessageCreationModel messageCreationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext, false);
            validator.ValidateAndThrow(messageCreationModel);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            if (messageCreationModel.UserId is not null)
            {
                var user = userManager.Users.FirstOrDefault(x => x.Id == messageCreationModel.UserId)
                    ?? throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
                await adminMessageRepo.AddAsync(adminMessage);
                await adminMessageRepo.SaveAsync();
                var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
                await hubContext.Clients.Users(messageDto.UserId.ToString())
                 .SendAsync(HubMethods.ReceiveAdminMessage, messageDto);
                return messageDto;
            }
            else 
            {
                IEnumerable<int> usersIds;
                if (messageCreationModel.UserIds is null || !messageCreationModel.UserIds.Any())
                {
                    usersIds = await userManager.Users.Select(x => x.Id).ToArrayAsync();
                }
                else 
                {
                    usersIds = messageCreationModel.UserIds;
                }
                
                if (usersIds is not null && usersIds.Any())
                {
                    List<AdminMessage> messages = [];
                    var message = adminMessage.Message;
                    await messageRepo.AddAsync(message);
                    await messageRepo.SaveAsync();
                    foreach (var id in usersIds)
                    {
                        adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
                        adminMessage.UserId = id;
                        adminMessage.Message = message;
                        messages.Add(adminMessage);
                    }
                    await adminMessageRepo.AddRangeAsync(messages);
                    await adminMessageRepo.SaveAsync();
                   
                    var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
                    await hubContext.Clients.Users(usersIds.Select(x => x.ToString()).ToArray())
                         .SendAsync(HubMethods.ReceiveAdminMessage, messageDto);
                    return messageDto;
                }
            }
            throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
        }

       
        public async Task SetReaded(int id)
        {
            var user =  await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;
            var  adminMessage = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetUnreadedById(userId, id,  true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            adminMessage.Readed = true;
            await adminMessageRepo.SaveAsync();
            await hubContext.Clients.Users(user.Id.ToString())
                .SendAsync(HubMethods.SetReaded, adminMessage.Id);
        }

        public async Task SetReaded(IEnumerable<int> ids)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetUnreadedByIds(userId, ids,  true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            foreach (var message in messages)
            {
                message.Readed = true;
            }
            await adminMessageRepo.SaveAsync();
        }
    }
}
