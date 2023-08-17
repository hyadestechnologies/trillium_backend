import {
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {AccountVisibility, Languages} from '@prisma/client';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UserSettingsService } from './user-settings.service';

@Controller({ path: 'settings', version: '1' })
export class UserSettingsController {
  constructor(private readonly settingsService: UserSettingsService) {}

    @UseGuards(JwtAuthGuard)
    @Put('visibility/:visibility')
    async setVisibility(
        @Request() req: any, 
        @Param('visibility') visibility: AccountVisibility
    ) {
        return this.settingsService.setUserVisibility(req.user, visibility);
    }

    @UseGuards(JwtAuthGuard)
    @Put('language/:language')
    async setLanguage(
        @Request() req: any, 
        @Param('language') language: Languages
    ) {
        return this.settingsService.setUserLanguage(req.user, language);
    }

    @UseGuards(JwtAuthGuard)
    @Get('current')
    async getSettings(@Request() req: any) {
        return this.settingsService.getUserSettings(req.user);
    }
}
