import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { User, PrismaClient, FriendRequest } from '@prisma/client';
import { signupUserType, userInfoType } from 'src/types/types';

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
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
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

  async acceptFriendRequest(receiverId: string, requestId: string) {
    // get user id

    let updated: FriendRequest & {
      sender: User;
      receiver: User;
    };

    try {
      updated = await this.friendRequest.update({
        where: {
          id: requestId,
        },
        include: {
          receiver: true,
          sender: true,
        },
        data: {
          accepted: true,
        },
      });
    } catch (e) {
      console.error(`friend request with id "${requestId}" not found`, e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    // update the two users friends list
    const updateList = [
      { user: updated.receiver, friend: updated.senderId },
      { user: updated.sender, friend: updated.receiverId },
    ];
    for (const { user, friend } of updateList) {
      const res = await this.updateUserFriendsList(user, friend);
      if (res === false) {
        try {
          await this.friendRequest.update({
            where: {
              id: requestId,
            },
            data: {
              accepted: false,
            },
          });
        } catch (e) {
          console.error(`friend request with id "${requestId}" not found`, e);
          throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Server error 🤯',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return {
      success: true,
    };
  }

  async getUserProfile(userId: string): Promise<userInfoType> {
    try {
      const userInfo = await this.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      // we don't want to return passwords to the client
      return {
        username: userInfo.username,
        email: userInfo.email,
        name: userInfo.name ?? '',
        surname: userInfo.surname ?? '',
        description: userInfo.description ?? '',
      };
    } catch (exp) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
  }

  async updateUserFriendsList(user: User, friendId: string) {
    const oldFriendsList = user.friends;

    if (oldFriendsList.includes(friendId)) {
      return true;
    }

    const friendsList = oldFriendsList.concat([friendId]);

    try {
      const updated = await this.user.update({
        where: {
          id: user.id,
        },
        data: {
          friends: friendsList,
        },
      });
    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }

  async updateProfile(user, newUserInfo: userInfoType) {
    if (!this.validateUserInfo(newUserInfo)) {
      throw new HttpException(
        'Params are missing or not well formed',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const loggedUser = await this.user.findUniqueOrThrow({
        where: {
          id: user.id,
        },
      });

      const updatedUserInfo = await this.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: newUserInfo.username,
          email: newUserInfo.email,
          description: newUserInfo.description,
          name: newUserInfo.name,
          surname: newUserInfo.surname,
        },
      });

      return updatedUserInfo;
    } catch (exp) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  private validateUserInfo(userInfo: userInfoType): boolean {
    const namingRegex = new RegExp(/^[a-zA-Z0-9_.@]+$/);

    return (
      !(
        !userInfo.email ||
        !userInfo.name ||
        !userInfo.surname ||
        !userInfo.username
      ) &&
      namingRegex.test(userInfo.email) &&
      namingRegex.test(userInfo.name) &&
      namingRegex.test(userInfo.surname) &&
      namingRegex.test(userInfo.username)
    );
  }
}
