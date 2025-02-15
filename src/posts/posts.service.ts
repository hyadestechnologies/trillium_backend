import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { User, PrismaClient, PostVisibility } from '@prisma/client';

import { CreatePostDto, SearchPostParamsDto } from '../types/posts';

@Injectable()
export class PostsService extends PrismaClient implements OnModuleInit {
  public async createNewPost(newPost: CreatePostDto, user: User) {
    try {
      const post = await this.post.create({
        data: {
          title: newPost.title,
          description: newPost.description,
          userId: user.id,
          deletedOn: null,
          visibility: newPost.visibility ?? PostVisibility.public,
        },
      });
      return post;
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAllPosts(page: number, size: number, user:User) {
    if (isNaN(page) || isNaN(size)) {
      throw new HttpException(
        'Page or size are not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let userFriends: string[] = [];
      if (user) {
        const loggedUser = await this.user.findUnique({
          where: {
            id: user.id,
          },
        });

        userFriends = !loggedUser ? [] : loggedUser.friends;
      }
      
      const posts = await this.post.findMany({
        skip: page * size,
        take: size,
        where: {
          OR: [
            { visibility: PostVisibility.public },
            {
              user: {
                id: { in: userFriends },
              },
            },
          ],
          NOT: {
            visibility: PostVisibility.hidden,
          },
        },
      });

      return posts;
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deletePost(postId: string, user: User) {
    try {
      const deletePost = await this.post.deleteMany({
        where: {
          id: postId,
          userId: user.id,
        },
      });

      if (deletePost.count === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      return deletePost;
    } catch (exp) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  public async updatePost(newPost: CreatePostDto, postId: string, user: User) {
    try {
      let queryArgs: {
        where: {
          id: string;
          userId: string;
        };
        data: CreatePostDto;
      } = {
        where: {
          id: postId,
          userId: user.id,
        },
        data: {
          title: newPost.title,
          description: newPost.description,
        },
      };

      if (newPost.visibility) {
        queryArgs = {
          where: {
            ...queryArgs.where,
          },
          data: {
            ...queryArgs.data,
            visibility: newPost.visibility,
          },
        };
      }

      const updatePost = await this.post.updateMany({
        ...queryArgs,
      });

      if (updatePost.count < 1) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Post updated successfully!',
      };
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async searchPost(searchParams: SearchPostParamsDto) {
    try {
      if (!searchParams.searchQuery) {
        return new HttpException(
          'Provide search params',
          HttpStatus.BAD_REQUEST,
        );
      }

      const pageSize = searchParams.pageSize ?? 5;
      const page = searchParams.page ?? 0;

      const posts = await this.post.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: {
          OR: [
            { title: { contains: searchParams.searchQuery } },
            { description: { contains: searchParams.searchQuery } },
          ],
        },
      });

      return posts;
    } catch (exp) {
      throw new HttpException(exp + '', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserPosts(page: number, size: number, id: string) {
    if (isNaN(page) || isNaN(size)) {
      throw new HttpException(
        'Page or size are not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const searchedUser = await this.user.findUniqueOrThrow({
        where: { id: id },
      });

      const posts = await this.post.findMany({
        skip: page * size,
        take: size,
        where: {
          userId: id,
        },
      });

      return posts;
    } catch (exp) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
