import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/decorators/public-decorator';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {

  constructor (
    private readonly userService: UsersService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('sayHello')
  sayHello() {
    return this.userService.sayHello();
  }

}
