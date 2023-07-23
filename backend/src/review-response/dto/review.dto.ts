import { IsString } from "class-validator"

export class ReviewResponseDto {

    @IsString()
    text: string
}