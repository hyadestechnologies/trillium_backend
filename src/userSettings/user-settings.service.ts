import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Languages, PrismaClient, User, UserSettings } from '@prisma/client';

@Injectable()
export class UserSettingsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async getUserSettings(user: User): Promise<UserSettings | null> {
      try {
          const userSettings = await this.userSettings.findUniqueOrThrow({
              where: {
                  userId: user.id
              }
          });

          return userSettings;
      } catch (NotFoundError) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
  }

  async setUserLanguage(
      user: User, 
      language: Languages
  ): Promise<UserSettings | null> {
      return null;
  }

  async setUserVisibility(
      user: User, 
      visibility: string
  ): Promise<UserSettings | null> {
    return null;
  }
}
