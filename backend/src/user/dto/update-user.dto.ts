import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string
    
    @IsOptional()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long'
    })
    @IsString()
    password?: string

    @IsOptional()
    @MinLength(3, {
        message: 'Name must be at least 3 characters long'
    })
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    phone: string

    @IsOptional()
    @IsString()
    avatarPath: string
}
