import { Controller, Get,Body, Patch, Param, Delete, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/decorator/auth.decorator';
import { User } from 'src/decorator/user.decorator';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Auth()
  @Get()
  getMyProfile(@User('id') id:number,) {
    return this.userService.getMyProfile(+id);
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(+id);
  }

  @HttpCode(200)
  @Auth()
  @Patch()
  updateProfile(@User('id') id:number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @HttpCode(200)
  @Auth()
  @Patch('favorites/:productId') 
  toggleFavarite(@User('id') id:number, @Param('productId') productId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.toggleFavorite(id, +productId);
  }

   @Auth()
  @Delete()
  remove(@User('id') id:number, @Body() deleteUserDto: DeleteUserDto) {
    return this.userService.remove(id, deleteUserDto.password);
  }
}
