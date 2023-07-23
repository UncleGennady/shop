import {IsString } from "class-validator"

export class CategoryDto {

    @IsString()
    name: string

    @IsString()
    description: String 

    price:Number     


}