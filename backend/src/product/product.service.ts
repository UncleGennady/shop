import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/create-product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { Prisma } from '@prisma/client';
import { prismaGetBy } from 'src/utils/prisma-get-by';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService){}

    // async getProduct<T>(field:string, value: T, select: Prisma.ProductSelect) {
    //     return await this.prisma.product.findUnique({
    //       where: {
    //         [field]: value 
            
    //       },
    //        select
    //     }); 
    //   }

    getProduct = prismaGetBy<Prisma.ProductSelect>(this.prisma.product)


    async byId(id: number) {

        const product = await this.getProduct('id', id, {
            id:true,
            name:true,
            slug:true,
            description:true,
            price:true,
            images:true,
            createdAt:true,
            author:{
                select:{
                    id:true,
                    name:true,
                    avatarPath:true,
                }
            },
            reviews:{
                select:{
                    id:true,
                    text:true,
                    createdAt:true,
                    author:{
                        select:{
                            id:true,
                            name:true,
                            avatarPath:true,
                        }
                    },
                    responses:{
                        select:{
                            id:true,
                            text:true,
                            author:{
                                select:{
                                    id:true,
                                    name:true,
                                    avatarPath:true,
                                }
                            }
                        }
                    }
                }
            },
        })
            
        if(!product) throw new NotFoundException("Product not found!")

        return product
    }

    async bySlug(slug: string) {

        const product = await this.getProduct('slug', slug, {
            id:true,
            name:true,
            slug:true,
            description:true,
            price:true,
            images:true,
            createdAt:true,
            author:{
                select:{
                    id:true,
                    name:true,
                    avatarPath:true,
                }
            },
            reviews:{
                select:{
                    id:true,
                    text:true,
                    createdAt:true,
                    author:{
                        select:{
                            id:true,
                            name:true,
                            avatarPath:true,
                        }
                    },
                    responses:{
                        select:{
                            id:true,
                            text:true,
                            author:{
                                select:{
                                    id:true,
                                    name:true,
                                    avatarPath:true,
                                }
                            }
                        }
                    }
                }
            },
        })
            
        if(!product) throw new NotFoundException("Product not found!")

        return product
    }

    async byCategory(categorySlug: string) {

        const product = await this.prisma.product.findMany({
            where:{
                category:{
                    slug: categorySlug
                }
            },
            select: {
                id:true,
                name:true,
                slug:true,
                description:true,
                price:true,
                images:true,
                createdAt:true,
                author:{
                    select:{
                        id:true,
                        name:true,
                        avatarPath:true,
                    }
                },
                reviews:{
                    select:{
                        id:true,
                        text:true,
                        createdAt:true,
                        author:{
                            select:{
                                id:true,
                                name:true,
                                avatarPath:true,
                            }
                        },
                        responses:{
                            select:{
                                id:true,
                                text:true,
                                author:{
                                    select:{
                                        id:true,
                                        name:true,
                                        avatarPath:true,
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })
            
        if(!product) throw new NotFoundException("Product not found!")

        return product
    }

    async getSimilar(id: number) {

        const currentProduct = await this.getProduct('id', id, {
            id:true,
            category:{
                select:{
                    id:true,
                    name:true,
                }
            }
        })

        if(!currentProduct) throw new NotFoundException('Current product not found!')

        const product = await this.prisma.product.findMany({
            where:{
                category:{
                    name: currentProduct.category.name
                },
                NOT:{
                    id:currentProduct.id
                }
            },
            orderBy:{
                createdAt:'desc'
            },
            select: {
                id:true,
                name:true,
                slug:true,
                description:true,
                price:true,
                images:true,
                createdAt:true,
                author:{
                    select:{
                        id:true,
                        name:true,
                        avatarPath:true,
                    }
                },
                reviews:{
                    select:{
                        id:true,
                        text:true,
                        createdAt:true,
                        author:{
                            select:{
                                id:true,
                                name:true,
                                avatarPath:true,
                            }
                        },
                        responses:{
                            select:{
                                id:true,
                                text:true,
                                author:{
                                    select:{
                                        id:true,
                                        name:true,
                                        avatarPath:true,
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })
            
        if(!product) throw new NotFoundException("Product not found!")

        return product
    }



    async getAll () {
        const products =  await this.prisma.product.findMany({
            select:{
                id:true,
                name:true,
                slug:true,
                description:true,
                price:true,
                images:true,
                createdAt:true,
            }
        })
        return products
    }

    async create (userId, dto:ProductDto) {
        const product =  await this.prisma.product.findUnique({
            where:{
                name : dto.name
            }
        })

        if(!!product) throw new BadRequestException("Product already created!")

        const newProduct = await this.prisma.product.create({
            data:{
                name:dto.name,
                price:dto.price,
                images:dto.images,
                description:dto.description,
                slug:generateSlug(dto.name),
                author:{
                    connect:{
                        id:userId
                    }
                },
                category:{
                    connect:{
                        id:dto.categoryId
                    }
                },
              }
        })
        
        return newProduct
        
    }


    async update (id: number, dto:ProductDto) {
        const product =  await this.prisma.product.findUnique({
            where:{
                id
            }
        })

        if(!product) throw new BadRequestException("Product not found!")

        const updatedProduct = await this.prisma.product.update({
            where:{
                id
            },
            data:{
                name:dto.name,
                price:dto.price,
                images:dto.images,
                description:dto.description,
                slug:generateSlug(dto.name),
              }
        })

        return updatedProduct
        
    }

    async delete (id: number) {
        const product =  await this.prisma.product.findUnique({
            where:{
                id
            }
        })

        if(!product) throw new BadRequestException("Product not found!")

         await this.prisma.product.delete({
            where:{
                id
            }
         })
            
        return "Success"
        
    }
}
