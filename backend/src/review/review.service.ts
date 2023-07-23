import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { ProductService } from 'src/product/product.service';
import { Prisma } from '@prisma/client';
import { prismaGetBy } from 'src/utils/prisma-get-by';


@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaService, private readonly product: ProductService){}

//    async getReview<T>(field:string, value: T, select: Prisma.ReviewSelect) {
//         return await this.prisma.review.findUnique({
//           where: {
//             [field]: value 
            
//           },
//            select
//         }); 
//       }

     getReview = prismaGetBy<Prisma.ReviewSelect>(this.prisma.review)
    

    async getAllReviews(){
        const reviews =  await this.prisma.review.findMany({
            select:{
                id:true,
                createdAt:true,
                rating:true,
                text:true,
                author:{
                    select:{
                        id: true,
                        name:true,
                        avatarPath:true
                    }
                }
            }
        })
        return reviews
    }

    async getReviewsByProductId(productId: number){

        const existProduct = await this.product.getProduct('id', productId, {
            id:true
        } ) 

        if(!existProduct) throw new NotFoundException("Product not found!")

        const reviews =  await this.prisma.review.findMany({
            where:{
                productId
            },
            select:{
                id:true,
                createdAt:true,
                rating:true,
                text:true,
                author:{
                    select:{
                        id: true,
                        name:true,
                        avatarPath:true
                    }
                },
                responses:{
                    select:{
                        id:true,
                        text:true,
                        author: {
                            select:{
                                id: true,
                                name:true,
                                avatarPath:true
                            }
                        }
                    }
                }
            }
        })
        return reviews
    }

    async create(userId: number, productId: number, dto: ReviewDto){

        const review = await this.prisma.review.create({
            data:{
                ...dto,
                product:{
                    connect:{
                        id:productId
                    }
                },
                author:{
                    connect:{
                        id:userId
                    }
                },
            }
        })

        return review
    }

    async update(id:number, dto: ReviewDto){

        const review = await this.getReview('id', id, {id:true})
        
        if(!review) throw new BadRequestException("Review not found!")

        const updatedreview = await this.prisma.review.update({
            where:{
                id:review.id
            },
            data:{
                ...dto
            }
        })

        return review
    }

    async delete(id){

        const review = await this.getReview('id', id, {id:true})

        if(!review) throw new BadRequestException("Review not found!")

         await this.prisma.review.delete({
            where:{
                id
            }
         })
            

        return "Success"

    }

    async getAverageValueByProductId(productId: number){
        return this.prisma.review
            .aggregate({
                where: {
                    productId,
                    NOT:{
                        rating:null
                    }
                },
                _avg: {rating:true}
            })
            .then(data=>data._avg)
    }
}
