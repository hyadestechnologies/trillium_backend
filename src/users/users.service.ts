import { Injectable, OnModuleInit } from '@nestjs/common';

import { User, PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }
}
