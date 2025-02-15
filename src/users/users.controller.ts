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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../decorators/public-decorator';
import { userInfoType } from '../types/types';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('send_request/:to')
  sendFriendRequest(@Request() req, @Param('to') toUser: string) {
    return this.userService.sendFriendRequest(toUser, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend_requests')
  getFriendRequests(@Request() req) {
    return this.userService.getUserFriendRequests(req.user.username);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('accept_request/:id')
  acceptFriendRequest(@Request() req, @Param('id') requestId: string) {
    return this.userService.acceptFriendRequest(req.user.id, requestId);
  }

  @Public()
  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  updateProfile(@Request() req, @Body() userProfileInfo: userInfoType) {
    return this.userService.updateProfile(req.user.id, userProfileInfo);
  }
}
