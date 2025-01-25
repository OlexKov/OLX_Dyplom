
export interface IOlxUser {
    id: number
    email: string
    emailConfirmed: boolean
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    phoneNumber?: string | undefined
    firstName?: string | undefined
    lastName?: string | undefined
    photo?: string | undefined
    createdDate: Date
    lastActivity: Date
    webSite?: string | undefined
    about?: string | undefined
    settlementRef?: string | undefined
    settlementDescrption?: string | undefined
    adverts: number[];
    favoriteAdverts: number[];
}

export interface PageRequest {
    size: number | undefined
    page: number | undefined
    sortKey: string 
    isDescending: boolean 
}

export interface IOlxUserPageRequest extends PageRequest {
    emailSearch?: string
    phoneNumberSearch?: string
    firstNameSearch?: string
    lastNameSearch?: string
    webSiteSearch?: string
    settlementRefSearch?: string
}

export interface PageResponse<T> {
   total:number
   items:T[]
}

