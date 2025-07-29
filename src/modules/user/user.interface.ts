import { RoleEnum, UserGender } from "./user.enum";

export interface IUser
{
    name: string;
    email: string;
    contact: string;
    location: string;
    password: string;
    age: number;
    gender: UserGender;
    // Auth info
    role: RoleEnum;
    isVerified: boolean;
    otp?: number;
    otpExpiry?: Date;
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
}