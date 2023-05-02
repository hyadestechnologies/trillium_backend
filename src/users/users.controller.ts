import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/decorators/public-decorator';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('all')
  getAllUsers(@Request() req) {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('send_request/:to')
  sendFriendRequest(@Request() req, @Param('to') toUser) {
    console.log(req.user);
    return this.userService.sendFriendRequest(toUser, req.user);
  }
}
