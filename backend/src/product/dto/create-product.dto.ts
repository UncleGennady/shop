import { DeleteUserDto } from './../../user/dto/delete-user.dto';
import {ArrayMinSize, IsNumber, IsString, isString } from "class-validator"

export class ProductDto {

    @IsString()
    name: string

    @IsNumber()
    price: number

    @IsString()
    description: string

    @IsString({each: true})
    @ArrayMinSize(1)
    images: string[]

    @IsNumber()
    categoryId: number
}