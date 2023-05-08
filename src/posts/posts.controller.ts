import { Controller, HttpStatus } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common/decorators';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PostsService } from './posts.service';
import { CreatePostDto, SearchPostParamsDto } from '../types/posts';
import { Public } from 'src/decorators/public-decorator';

@Controller({ path: 'posts', version: '1' })
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createNewPost(@Request() req, @Body() newPost: CreatePostDto) {
    return await this.service.createNewPost(newPost, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('getAll/:page/:size')
  async getAllPosts(@Param('page') page, @Param('size') size, @Request() req) {
    return await this.service.getAllPosts(
      parseInt(page),
      parseInt(size),
      req.user,
    );
  }

  @Public()
  @HttpCode(200)
  @Get('getAllUnsigned/:page/:size')
  async getAllPostsUnsigned(@Param('page') page, @Param('size') size) {
    return await this.service.getAllPostsUnsigned(
      parseInt(page),
      parseInt(size),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete('delete/:id')
  async deletePost(@Request() req, @Param('id') postId) {
    return this.service.deletePost(postId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Put('update/:id')
  async updatePost(
    @Request() req,
    @Body() newPost: CreatePostDto,
    @Param('id') postId,
  ) {
    return this.service.updatePost(newPost, postId, req.user);
  }

  @Public()
  @HttpCode(200)
  @Post('search')
  async searchPost(@Body() searchParams: SearchPostParamsDto) {
    return this.service.searchPost(searchParams);
  }

  @Public()
  @HttpCode(200)
  @Get('getAll/:userId/:page/:size')
  async getUserPosts(
    @Param('page') page,
    @Param('size') size,
    @Param('userId') userId,
  ) {
    return await this.service.getUserPosts(
      parseInt(page),
      parseInt(size),
      userId,
    );
  }
}
