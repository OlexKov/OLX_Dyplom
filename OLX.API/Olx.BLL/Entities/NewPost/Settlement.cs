﻿
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.NewPost
{
    public class Settlement : NewPostBaseEntity
    {
        [StringLength(100)]
        public string SettlementTypeDescription { get; set; } = string.Empty;

        [StringLength(36)]
        [Unicode(false)]
        public string? Region { get; set; }
        public Region? SettlementRegion { get; set; }
        public ICollection<Warehous> Warehous { get; set; } = new HashSet<Warehous>();
        public ICollection<OlxUser> Users { get; set; } = new HashSet<OlxUser>();
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
    }
}
