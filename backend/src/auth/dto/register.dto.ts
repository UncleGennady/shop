import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterDto {
    
    @IsEmail()
    email: string
    
    @MinLength(6, {
        message: 'Password must be at least 6 characters long'
    })
    @IsString()
    password: string

    @MinLength(3, {
        message: 'Name must be at least 3 characters long'
    })
    @IsString()
    name: string

    @IsString()
    phone: string

    @IsOptional()
    @IsString()
    avatarPath: string
}