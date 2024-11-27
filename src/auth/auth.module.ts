import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './startegies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { JwtStrategy } from './startegies/jwt.startegy';
import { SignUpStrategy } from './startegies/register.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SignUpStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
