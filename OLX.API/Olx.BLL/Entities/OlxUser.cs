﻿using Microsoft.AspNetCore.Identity;
using Olx.BLL.Entities.ChatEntities;
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities
{
    public class OlxUser : IdentityUser<int>
    {
        [StringLength(100)]
        public string? FirstName { get; set; }
        [StringLength(100)]
        public string? LastName { get; set; }
        [StringLength(100)]
        public string? Photo { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastActivity { get; set; } = DateTime.UtcNow;
        [StringLength(100)]
        public string? WebSite { get; set; }
        [StringLength(4000)]
        public string? About { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
        public ICollection<Advert> FavoriteAdverts { get; set; } = new HashSet<Advert>();
        public ICollection<ChatMessage> ChatMessages { get; set; } = new HashSet<ChatMessage>();
        public ICollection<Chat> BuyChats { get; set; } = new HashSet<Chat>();
        public ICollection<Chat> SellChats { get; set; } = new HashSet<Chat>();
        public ICollection<AdminMessage> AdminMessages { get; set; } = new HashSet<AdminMessage>();

    }
}
