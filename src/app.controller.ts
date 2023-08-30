import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorators/public-decorator';

@Controller({ version: '1' })
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @Get('/healthcheck')
  async healthCheck() {
    return { status: true };
  }

  @Public()
  @Get('/')
  async helloFromUs() {
    return '<h1>Hello from the Hyades team 👾</h1><p>Cristian Scapin, Matteo Brusarosco and Antonio Gelain</p>';
  }
}
