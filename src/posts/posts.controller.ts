import { Controller } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';

@Controller({path: 'posts', version: '1'})
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createNewPost(@Body() newPost: CreatePostDto) {
    // call service to create post
    return await this.service.createNewPost(newPost);
  }
}
