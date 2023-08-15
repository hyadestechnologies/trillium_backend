import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { AccountVisibility, Languages, PrismaClient, User, UserSettings } from '@prisma/client';

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
  ) {
      try {
          const userSettings = await this.userSettings.updateMany({
              where: {
                  userId: user.id
              },
              data: {
                  language: language
              }
          });

          return userSettings;
      } catch (NotFoundError) {
          throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
  }

  async setUserVisibility(user: User, visibility: AccountVisibility) {
      try {
          const userSettings = await this.userSettings.updateMany({
              where: {
                  userId: user.id
              },
              data: {
                  visibility: visibility 
              }
          });

          return userSettings;
      } catch (NotFoundError) {
          throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
  }
}
