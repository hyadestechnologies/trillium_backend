import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PostsService } from './posts.service';
import { CreatePostDto, SearchPostParamsDto, UpdatePostDto } from './posts.dto';
import { Public } from 'src/decorators/public-decorator';

@Controller({ path: 'posts', version: '1' })
export class PostsController {
  constructor(private readonly service: PostsService) {}

  //@UseGuards(JwtAuthGuard)
  @Public()
  @Post('create')
  async createNewPost(@Body() newPost: CreatePostDto) {
    // call service to create post
    return await this.service.createNewPost(newPost);
  }

  @Public()
  @Get('getAll/:page/:size')
  async getAllPosts(@Param('page') page, @Param('size') size) {
    return await this.service.getAllPosts(parseInt(page), parseInt(size));
  }

  //@UseGuards(JwtAuthGuard)
  @Public()
  @Delete('delete/:id')
  async deletePost(@Param('id') postId) {
    return this.service.deletePost(postId);
  }

  @Public()
  //@UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updatePost(@Body() newPost: any, @Param('id') postId) {
    console.log(newPost);
    return this.service.updatePost(newPost, postId);
  }

  @Public()
  @Post('search')
  async searchPost(@Body() searchParams: SearchPostParamsDto) {
    return this.service.searchPost(searchParams);
  }
}
