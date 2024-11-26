﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities;


namespace Olx.DAL.Data.EntityConfigs
{
    public class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasMany(x => x.Filters)
                .WithMany(x => x.Categories);
            builder.HasOne(x => x.Parent)
                .WithMany(x => x.Childs)
                .HasForeignKey(x=>x.ParentId);
            builder.HasMany(x => x.Adverts)
                .WithOne(x => x.Category)
                .HasForeignKey(x=>x.CategoryId);
        }
    }
}