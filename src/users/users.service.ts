import { Injectable, OnModuleInit } from '@nestjs/common';

import { User, PrismaClient } from '@prisma/client';
import { signupUserType } from 'src/types/types';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findOne(username: string): Promise<User | null> {
    try {
      const user = await this.user.findUniqueOrThrow({
        where: {
          username: username,
        },
      });

      return user;
    } catch (NotFoundError) {
      return null;
    }
  }

  async createUser(user: signupUserType): Promise<User> {
    const newUser = await this.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
      },
    });

    return newUser;
  }

  async sayHello() {
    return "Hello!";
  }
}
