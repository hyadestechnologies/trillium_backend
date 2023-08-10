import {
  Controller,
  Get,
  Param,
  Put,
  Post,
  Request,
  UseGuards,
  Body,
  HttpCode,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/decorators/public-decorator';

import { UserSettingsService } from './user-settings.service';

@Controller({ path: 'settings', version: '1' })
export class UserSettingsController {
  constructor(private readonly settingsService: UserSettingsService) {}
}
