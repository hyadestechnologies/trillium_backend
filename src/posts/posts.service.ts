import { Injectable, OnModuleInit } from '@nestjs/common';
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

  public async getAllPosts(page: number, size: number): Promise<responseType> {
    const posts = await this.post.findMany();

    return {
      status: 200,
      body: posts,
    };
  }

  public async deletePost(postId: string): Promise<responseType> {
    let response: responseType;

    try {
      const deletePost = await this.post.delete({
        where: {
          id: postId,
        },
      });

      response = {
        status: 200,
        message: 'Post deleted successfully',
        body: deletePost,
      };
    } catch (exp) {
      response = {
        status: 404,
        message: 'Post not found',
      };
    }

    return response;
  }

  public async updatePost(
    newPost: UpdatePostDto,
    postId: string,
  ): Promise<responseType> {
    let response: responseType;

    // todo: update media

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

      response = {
        status: 200,
        body: updatePost,
      };
    } catch (exp) {
      response = {
        status: 404,
        message: 'Post not found',
      };
    }

    return response;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
