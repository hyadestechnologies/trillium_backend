import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreatePostDto, SearchPostParamsDto, UpdatePostDto } from './posts.dto';

@Injectable()
export class PostsService extends PrismaClient implements OnModuleInit {
  public async createNewPost(newPost: CreatePostDto) {
    const post = await this.post.create({
      data: {
        title: newPost.title,
        description: newPost.description,
        userId: newPost.userId,
        deletedOn: null,
      },
    });

    return post;
  }

  public async getAllPosts(page: number, size: number) {
    const posts = await this.post.findMany({
      skip: page * size,
      take: size,
    });

    return posts;
  }

  public async deletePost(postId: string) {
    try {
      const deletePost = await this.post.delete({
        where: {
          id: postId,
        },
      });

      return deletePost;
    } catch (exp) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  public async updatePost(newPost: UpdatePostDto, postId: string) {
    try {
      const updatePost = await this.post.updateMany({
        where: {
          id: postId,
          userId: newPost.userId,
        },
        data: {
          title: newPost.title,
          description: newPost.description,
        },
      });

      return updatePost;
    } catch (exp) {
      console.log(exp);
      return new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  public async searchPost(searchParams: SearchPostParamsDto) {
    try {
      if (!searchParams.title && !searchParams.description) {
        return new HttpException(
          'Provide search params',
          HttpStatus.BAD_REQUEST,
        );
      }

      searchParams.title = searchParams.title ?? '';
      searchParams.description = searchParams.description ?? '';

      const posts = await this.post.findMany({
        where: {
          title: { contains: searchParams.title },
          description: { contains: searchParams.description },
        },
      });

      return posts;
    } catch (exp) {
      console.log(exp);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
