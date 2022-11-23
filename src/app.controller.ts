import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorators/public-decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('/health-check')
  async healthCheck() {
    return { status: true };
  }

  @Public()
  @Get('/')
  async helloFromUs() {
    return '<h1>Hello from the Hyades team</h1><p>Cristian Scapin, Matteo Brusarosco and Antonio Gelain</p>';
  }
}
