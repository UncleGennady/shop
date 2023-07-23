import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/decorator/auth.decorator';
import { ReviewDto } from './dto/review.dto'
import { AuthRole } from 'src/decorator/auth-with-roles.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRoleEnum } from '@prisma/client';
import { User } from 'src/decorator/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getAllReviews() {
    return this.reviewService.getAllReviews()
  }
  
  @Get(':id')
  getReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviewsByProductId(+productId)
  }

  @Get(':id')
  getAverageValue(@Param('productId') productId: string) {
    return this.reviewService.getAverageValueByProductId(+productId)
  }

  @Auth()
  @Post()
  createReview(@User('id') id:number, @Param('productId') productId: string, @Body() reviewDto: ReviewDto){
    return this.reviewService.create(id, +productId, reviewDto)
  }

  @Auth()
  @Patch()
  updateReview(@Param('id') id:string, @Body() reviewDto: ReviewDto){
    return this.reviewService.update(+id, reviewDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Delete()
  deletereview(@Param('id') id:string){
    return this.reviewService.delete(+id)
  }
  
}
