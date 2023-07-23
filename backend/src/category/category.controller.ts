import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/decorator/auth.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRoleEnum } from '@prisma/client';
import { AuthRole } from 'src/decorator/auth-with-roles.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  @Get()
  getCategories() {
    return this.categoryService.getAll()
  }
  
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.byId(+id)
  }
  @Get(':slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Post()
  createCategory(@Body() categoryDto: CategoryDto){
    return this.categoryService.create(categoryDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Patch()
  updateCategory(@Param('id') id:string, @Body() categoryDto: CategoryDto){
    return this.categoryService.update(+id, categoryDto)
  }

  @AuthRole()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Delete()
  deleteCategory(@Param('id') id:string){
    return this.categoryService.delete(+id)
  }

}
