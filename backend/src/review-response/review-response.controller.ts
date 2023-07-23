import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReviewResponseService } from './review-response.service';
import { AuthRole } from 'src/decorator/auth-with-roles.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRoleEnum } from '@prisma/client';
import { ReviewResponseDto } from './dto/review.dto';
import { User } from 'src/decorator/user.decorator';

@Controller('review-response')
export class ReviewResponseController {
  constructor(private readonly reviewResponseService: ReviewResponseService) {}

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  getAllReviewResponses() {
    return this.reviewResponseService.getAllReviewResponses()
  }
  
  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Post()
  @Get(':id')
  getReviewResponses(@User('id') id:number, productId: string) {
    return this.reviewResponseService.getReviewResponses(id)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Post()
  @Get(':id')
  getReviewResponseByReviewId(@Param('reviewId') reviewId: string) {
    return this.reviewResponseService.getReviewResponseByReviewId(+reviewId)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Post()
  createReviewResponse(@User('id') id:number, @Param('reviewId') reviewId: string, @Body() reviewResponseDto: ReviewResponseDto){
    return this.reviewResponseService.create(id, +reviewId, reviewResponseDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Patch()
  updateReviewResponse(@Param('id') id:string, @Body() reviewResponseDto: ReviewResponseDto){
    return this.reviewResponseService.update(+id, reviewResponseDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Delete()
  deleteReviewResponse(@Param('id') id:string){
    return this.reviewResponseService.delete(+id)
  }
}
