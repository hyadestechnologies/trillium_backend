import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { User, FriendRequest, PrismaClient } from '@prisma/client';
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

  async getAllUsers(): Promise<User[]> {
    const users = await this.user.findMany({});
    return users;
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

  async sendFriendRequest(to: string, from: User): Promise<FriendRequest> {
    // check if targeted user exists
    try {
      await this.user.findUniqueOrThrow({
        where: {
          id: to,
        },
      });
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // get sender id
    let senderId: string | null = null;
    try {
      const user = await this.user.findUniqueOrThrow({
        where: {
          username: from.username,
        },
      });
      senderId = user.id;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // it should only be one or zero
    const prevRequests = await this.friendRequest.findMany({
      where: {
        senderId: senderId,
        receiverId: to,
      },
    });

    if (prevRequests.length > 0) {
      return prevRequests[0];
    }

    const friendRequest = await this.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: to,
      },
    });

    return friendRequest;
  }

  async getUserFriendRequests(
    friendReqOfUsername: string,
  ): Promise<FriendRequest[]> {
    // get user id
    let userId: string | null = null;
    try {
      const user = await this.user.findUniqueOrThrow({
        where: {
          username: friendReqOfUsername,
        },
      });
      userId = user.id;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // get all user friend requests
    const friendRequests = await this.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
    });

    return friendRequests;
  }
}
