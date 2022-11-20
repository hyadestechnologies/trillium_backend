import { Injectable, OnModuleInit } from '@nestjs/common';

import { User, PrismaClient } from '@prisma/client';
import { signupUserType } from 'src/types/types';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // async findOne(username: string): Promise<User | null> {
  //   const user = await this.user.findUnique({
  //     where: {
  //       username: username,
  //     },
  //   });

  //   return user;
  // }

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(
    username: string,
  ): Promise<
    { userId: number; username: string; password: string } | undefined
  > {
    return this.users.find((user) => user.username === username);
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
}
