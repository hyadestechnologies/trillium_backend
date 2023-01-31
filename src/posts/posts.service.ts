import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { responseType } from 'src/types/types';

import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Injectable()
export class PostsService extends PrismaClient implements OnModuleInit {
  public async createNewPost(newPost: CreatePostDto) {
    // todo: upload media

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
    // todo: update media
    console.log(newPost);
    try {
      const updatePost = await this.post.update({
        where: {
          id: postId,
        },
        data: {
          title: newPost.title,
          description: newPost.description,
        },
      });

      return updatePost;
    } catch (exp) {
      console.log(exp);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
