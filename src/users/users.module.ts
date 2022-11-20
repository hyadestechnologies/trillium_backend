import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
