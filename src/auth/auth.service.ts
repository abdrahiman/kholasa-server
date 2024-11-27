import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types';
import { UpdateUserDto } from 'src/users/dtos/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user: any = await this.usersService.findByEmail(email);

    if (user && (await compare(password, user.password))) return user;

    return null;
  }
  async createUser(email: string, password: string,name?:string) {
    console.log("MAn")
    return await this.usersService.create({
      email,
      name:name||email.split("@")[0],
      password,
      role: 'user',
    });
  }
  async saveIt(user: User) {
    const payload: any = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async updateMe(payload: UpdateUserDto, id: string) {
    await this.usersService.update(id, payload);
  }

  async deleteMe(id: string) {
    await this.usersService.remove(id);
  }
}
