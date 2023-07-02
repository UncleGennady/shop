import { Injectable} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignogeExpiration: true, 
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({id}: Pick<User, 'id'>) {
        return this.prisma.user.findUnique({
            where:{
                id: +id
            }
        })
    }
}