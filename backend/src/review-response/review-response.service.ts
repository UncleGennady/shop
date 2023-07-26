import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class ReviewResponseService {
    constructor(private readonly prisma: PrismaService, private readonly review: ReviewService){}

    async getAllReviewResponses(){
        const responses = await this.prisma.reviewResponse.findMany()

        if(!responses) throw new NotFoundException("Review responses not found")

        return responses
    }

    async getReviewResponses(userId){

        const responses = await this.prisma.reviewResponse.findMany(
            {
                where: userId
            }
        )

        if(!responses) throw new NotFoundException("Review responses not found")

        return responses
    }

    async getReviewResponseByReviewId(reviewId){

          const existReview = await this.review.getReview('id', reviewId, {
            id:true
        } ) 

        if(!existReview) throw new NotFoundException("Review not found!")
    
        const responses = await this.prisma.reviewResponse.findMany(
            {
                where: reviewId
            }
        )

        if(!responses) throw new NotFoundException("Review responses not found")

        return responses    
    }

    async create(userId, reviewId, dto){

        const existReview = await this.review.getReview('id', reviewId, {
            id:true
        } ) 

        if(!existReview) throw new NotFoundException("Review not found!")
    
        const response = await this.prisma.reviewResponse.create({
            data:{
                ...dto,
                review:{
                    connect:{
                        id:reviewId
                    }
                },
                author:{
                    connect:{
                        id:userId
                    }
                },
            }
        })

        return response

    }

  async update(id, dto){

        const response =  await this.prisma.reviewResponse.findUnique({
            where:{
                id:id
            }
        })

        if(!response) throw new BadRequestException("Review response not found!")

        const updatedResponse = await this.prisma.reviewResponse.update({
            where:{
                id
            },
            data:{
                ...dto,
            }
        })

        return updatedResponse

    }

   async delete(id){

        const response = await this.prisma.reviewResponse.findUnique({
            where:{
                id:id
            }
        })

        if(!response) throw new BadRequestException("Review response not found!")

        await this.prisma.reviewResponse.delete({
            where:{
                id
            }
         })
            

        return "Success"

    }
}
