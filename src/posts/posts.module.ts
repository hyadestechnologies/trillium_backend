import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostsService],
  exports: [PostsModule],
  controllers: [PostsController],
})
export class PostsModule {}
