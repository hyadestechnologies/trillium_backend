import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {
  AccountVisibility,
  Languages,
  PrismaClient,
  User,
  UserSettings,
} from '@prisma/client';

@Injectable()
export class UserSettingsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async getUserSettings(user: User): Promise<UserSettings | null> {
    try {
      const userSettings = await this.userSettings.findUniqueOrThrow({
        where: {
          userId: user.id,
        },
      });

      return userSettings;
    } catch (NotFoundError) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
  }

  async setUserLanguage(user: User, language: Languages) {
    try {
      await this.userSettings.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          language: language,
        },
      });

      return await this.userSettings.findUniqueOrThrow({
        where: {
          userId: user.id,
        },
      });
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setUserVisibility(user: User, visibility: AccountVisibility) {
    try {
      await this.userSettings.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          visibility: visibility,
        },
      });

      return await this.userSettings.findUniqueOrThrow({
        where: {
          userId: user.id,
        },
      });
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvatar(seed: string)  {
    const dicebear = await import('@dicebear/core');
    const collection = await import('@dicebear/collection');

    const createAvatar = dicebear.createAvatar;
    const micah = collection.micah;

    const avatar = createAvatar(micah, {
      seed: seed,
    });
    return avatar;
  }
}
