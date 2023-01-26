import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Post } from '@prisma/client';

import { CreatePostDto } from './posts.dto';

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

  async onModuleInit() {
    await this.$connect();
  }
}
