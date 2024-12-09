﻿namespace Olx.BLL.Specifications
{
    [Flags]
    public enum AdvertOpt
    {
        Images = 1 << 0,
        NoTracking = 1 << 1,
        FilterValues = 1 << 2,
        User = 1 << 3,
        Category = 1 << 4,
        FavoritedByUsers = 1 << 5
    }

    [Flags]
    public enum CategoryOpt
    {
        Parent = 1 << 0,
        Childs = 1 << 1,
        Filters = 1 << 2,
        Adverts = 1 << 3,
        NoTracking = 1 << 4,
        Image = 1 << 5
    }

    [Flags]
    public enum FilterOpt
    {
        Categories = 1 << 0,
        Values = 1 << 1,
        NoTracking = 1 << 2
    }

    [Flags]
    public enum UserOpt
    {
        RefreshTokens = 1 << 0,
        Adverts = 1 << 1,
        NoTracking = 1 << 2,
        FavoriteAdverts = 1 << 3
    }
}
