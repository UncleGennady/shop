import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { Prisma } from '@prisma/client';


@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService){}

    
    private getCategory<T>(field:string, value: T, select: Prisma.CategorySelect) {
        return this.prisma.category.findUnique({
          where: {
            [field]: value 
            
          },
           select
        }); 
      }


    async byId(id: number) {

        const category = await this.getCategory('id', id, {
            id:true,
            name:true,
            slug:true,
        })
            
        if(!category) throw new NotFoundException("Category not found!")

        return category
    }

    async bySlug(slug: string) {

        const category = await this.getCategory('slug', slug, {
            id:true,
            name:true,
            slug:true,
        })
            
        if(!category) throw new NotFoundException("Category not found!")

        return category
    }

    async getAll () {
        const categories =  await this.prisma.category.findMany({
            select:{
                id:true,
                name:true,
                slug:true,
            }
        })
        return categories
    }

    async create (dto:CategoryDto) {
        const category =  await this.prisma.category.findUnique({
            where:{
                name : dto.name
            }
        })

        if(!!category) throw new BadRequestException("Category already created!")

        const newCategory = await this.prisma.category.create({
            data:{
                name: dto.name,
                slug: generateSlug(dto.name)
              }
        })
        
        return newCategory
        
    }


    async update (id: number, dto:CategoryDto) {
        const category =  await this.prisma.category.findUnique({
            where:{
                id
            }
        })

        if(!category) throw new BadRequestException("Category not found!")

        const updatedCategory = await this.prisma.category.update({
            where:{
                id
            },
            data:{
                name: dto.name,
                slug: generateSlug(dto.name)
              }
        })

        return updatedCategory
        
    }

    async delete (id: number) {
        const category =  await this.prisma.category.findUnique({
            where:{
                id
            }
        })

        if(!category) throw new BadRequestException("Category not found!")

         await this.prisma.category.delete({
            where:{
                id
            }
         })
            
        return "Success"
        
    }
}
