import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthRole } from 'src/decorator/auth-with-roles.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRoleEnum } from '@prisma/client';
import { ProductDto } from './dto/create-product.dto';
import { User } from 'src/decorator/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getCategories() {
    return this.productService.getAll()
  }
  
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.productService.byId(+id)
  }
  @Get(':slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Post()
  createCategory(@User('id') id:number , @Body() categoryDto: ProductDto){
    return this.productService.create(id, categoryDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Patch()
  updateCategory(@Param('id') id:string, @Body() categoryDto: ProductDto){
    return this.productService.update(+id, categoryDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Delete()
  deleteCategory(@Param('id') id:string){
    return this.productService.delete(+id)
  }
}
