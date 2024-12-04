﻿using AutoMapper;
using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Entities;


namespace Olx.BLL.Mapper
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryDto>()
                .ForMember(x => x.Filters, opt => opt.MapFrom(z => z.Filters.Select(y => y.Id)))
                .IncludeAllDerived();
        }
    }
}