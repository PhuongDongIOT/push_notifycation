import { Global, Module } from '@nestjs/common'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule,UserService } from '@/shared/user'
import { JwtService } from '@nestjs/jwt'


@Global()
@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                signOptions: {
                    expiresIn: 9000,
                 },
                 secretOrPrivateKey: 'xd',
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, JwtService, UserService, ConfigService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }