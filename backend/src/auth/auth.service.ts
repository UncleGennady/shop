import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService , private readonly jwt: JwtService) {}

  private async issueTokens(userId: number) {
    const data = {id: userId}

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    } )

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }

   private async getUser(field: string, value: string) {
    return this.prisma.user.findUnique({
      where: {
        [field]: value,
      },
    });
  }

  private async createNewUser(dto: RegisterDto) {
    const passwordHash = await hash(dto.password);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        name: dto.name,
        phone: dto.phone,
        avatarPath: dto.avatarPath,
      },
    });
  }


  async register(dto:RegisterDto ) {
    const existUser = await this.getUser('email', dto.email)

    if(existUser) throw new BadRequestException('User already exists')

    const user = await this.createNewUser(dto)

    const {password, ...res} = user

    const tokens = await this.issueTokens(user.id)

    return {
      ...res,
      ...tokens
    }
  }
  

  async login(dto: LoginDto ) {
    const user = await this.getUser('email', dto.email)

    if(!user && !verify(user.password, dto.password)) throw new ForbiddenException('Wrong login or password')
    
    const {password, ...res} = user
    
    const tokens = await this.issueTokens(user.id)

    return {
      ...res,
      ...tokens
    }
  }

  async getNewToken (refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)
    if(!result) throw new UnauthorizedException('Invalid refresh token')

    const user = await this.prisma.user.findUnique({where:{
      id: result.id
    }})

    const tokens = await this.issueTokens(user.id)

    const {password, ...res} = user
    return {
      ...res,
      ...tokens
    }
  }

}
