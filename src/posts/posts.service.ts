import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreatePostDto, UpdatePostDto } from './posts.dto';

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
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  private uploadMedia(postMedia: any[]): string[] {
    // TODO: proper upload to s3

    // manage media
    let mediaUrls = [];
    postMedia.forEach((media) => {
      // upload media to s3
      console.log(media);
      mediaUrls = [];
    });

    return mediaUrls;
  }
}
