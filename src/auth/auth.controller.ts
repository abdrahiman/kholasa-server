import {
  Controller,
  UseGuards,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dtos/users.dto';
import { Response } from 'express';
import { IS_PROD } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res() response: Response) {
    try {
      let data = await this.authService.saveIt(req.user);

      response.clearCookie('access_token');
      response.cookie('access_token', data.access_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: IS_PROD,
        sameSite: false,
      });
      return response.json(data);
    } catch (err) {
      console.log(err);
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('signup'))
  @Post('signup')
  async signUp(@Req() req, @Res() response) {
    try {
      let data = await this.authService.saveIt(req.user);

      response.clearCookie('access_token');
      response.cookie('access_token', data.access_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: IS_PROD,
        sameSite: false,
      });
      return response.json(data);
    } catch (err) {
      console.log(err);
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('signout')
  signout(@Req() req, @Res() response) {
    response.clearCookie('access_token');
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Req() req, @Body() payload: UpdateUserDto) {
    return this.usersService.update(req.user._id, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteProfile(@Req() req) {
    return this.usersService.remove(req.user._id);
  }
}
