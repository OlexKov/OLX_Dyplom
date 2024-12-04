﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.FilterModels;

namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilterController(IFilterService filterService) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> GetAll() => Ok(await filterService.GetAll());

        [HttpPost("get/range")]
        public async Task<IActionResult> GetAll([FromBody]IEnumerable<int> ids) => Ok(await filterService.GetDtoByIds(ids));

        [HttpPost("get/page")]
        public async Task<IActionResult> GetPage([FromBody] FilterPageRequest  pageRequest) => Ok(await filterService.GetPageAsync(pageRequest));

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromForm] FilterCreationModel filterEditModel)
        {
            await filterService.EditAsync(filterEditModel);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromForm] FilterCreationModel filterCreationModel)
        {
            await filterService.CreateAsync(filterCreationModel);
            return Ok();
        }

        [Authorize(Roles =Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await filterService.RemoveAsync(id);
            return Ok();
        }
    }
}