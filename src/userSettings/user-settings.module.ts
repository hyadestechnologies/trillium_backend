import { Module } from '@nestjs/common';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

@Module({
  providers: [UserSettingsService],
  exports: [UserSettingsService],
  controllers: [UserSettingsController],
})
export class UserSettingsModule {}
