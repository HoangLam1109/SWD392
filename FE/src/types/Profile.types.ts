export interface SocialLinks {
    facebook?: string;
    discord?: string;
    youtube?: string;
    _id?: string;
}

export interface Profile {
    _id: string;
    userId: string;
    bio: string;
    phoneNumber: string;
    address: string;
    country: string;
    dateOfBirth: string;
    sex: string;
    socialLinks?: SocialLinks;
    created_at?: string;
    updated_at?: string;
    __v?: number;
}

export interface CreateProfileDTO extends Omit<Profile, 'userId' | '_id' | 'created_at' | 'updated_at' | '__v'> {
    userId: string;
}

export interface UpdateProfileDTO extends Partial<Omit<Profile, 'userId' | '_id' | 'created_at' | 'updated_at' | '__v'>> { }
