import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, verify} from 'argon2';
import { Prisma } from '@prisma/client';
import { prismaGetBy } from 'src/utils/prisma-get-by';

@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}

  async getMyProfile(id: number) {
    const isSomeUser = await this.getUser('id', id, {
      id: true,
      createdAt: true,
      updateAt: true,
      email: true,
      name: true,
      avatarPath: true,
      role:true,
      phone: true,
      reviews: true,
      favorites: true,
      })

    if(!isSomeUser) throw new NotFoundException('User not found')

    return {
      ...isSomeUser}
  }

  async getProfile(id: number) {
    const isSomeUser = await this.getUser('id', id, {
      id: true,
      email: true,
      name: true,
      avatarPath: true,
      })

    if(!isSomeUser) throw new NotFoundException('User not found')

    return {
      ...isSomeUser}
  }

//  async getUser<T>(field: string, value: T, select: Prisma.UserSelect) {

//     return await this.prisma.user.findUnique({
//       where: {
//         [field]: value,
        
//       },
//        select
//     });
//   }

  getUser = prismaGetBy<Prisma.UserSelect>(this.prisma.user)


  async updateProfile(id: number, dto: UpdateUserDto) {

    const isSomeUser = await this.prisma.user.findUnique({
      where:{
        email : dto.email
      }
    })

    if(isSomeUser && id !== isSomeUser.id) throw new BadRequestException("Email already in use")

    const {password: oldPassword } = await this.getUser('id', id, {
      password: true
    })
 
    return this.prisma.user.update({
      where:{
        id
      },
      data:{
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : oldPassword as Prisma.StringFieldUpdateOperationsInput
      }
    })
  }

  async toggleFavorite(id:number, productId:number){

    const isSomeUser = await this.getUser('id', id, {
      id: true,
      favorites:true
    })

    if(!isSomeUser) throw new NotFoundException('User not found!')

  
   const isExist = isSomeUser.favorites.some(product => product.id === productId)
  
   await this.prisma.user.update({
    where: {
      id: +isSomeUser.id
    },
    data: {
      favorites: {
        [isExist? 'disconnect' : 'connect']:{
          id:productId
        }
      }
    }
   })
    
   return 'Success'
  }

  async remove(id: number, password: string) {
    const isSomeUser = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if(!isSomeUser) throw new NotFoundException('User not found!')

    if(!password || ! await verify(isSomeUser.password, password)) throw new BadRequestException('Something went wrong!')
    

    
     await this.prisma.user.delete(
      {where:{
        id
      }}
    )

    return 'Success'
  }
}
