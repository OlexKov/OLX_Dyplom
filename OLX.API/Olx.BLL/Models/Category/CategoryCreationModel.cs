﻿
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.Category
{
    public class CategoryCreationModel
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public IFormFile? ImageFile { get; init; }
        public int? ParentId { get; init; }
        public IEnumerable<int>? FiltersIds { get; init; }
    }
}