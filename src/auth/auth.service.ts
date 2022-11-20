import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { signupUserType } from 'src/types/types';
import { User, PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async signup(user: signupUserType) {
    try {
      const { password, ...newUserData } = await this.usersService.createUser(
        user,
      );
      return newUserData;
    } catch (e: any) {
      console.log(e.meta.target);
      if (e.meta.target === 'User_email_key') {
        throw new HttpException('EMAIL_ALREADY_TAKEN', HttpStatus.BAD_REQUEST);
      } else if (e.meta.target === 'User_username_key') {
        throw new HttpException(
          'USERNAME_ALREADY_TAKEN',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
