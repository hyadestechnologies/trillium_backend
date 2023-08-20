import { signupUserType } from '../types/types';
import { UsersService } from '../users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../types/posts';
import { PostVisibility, User } from '@prisma/client';

describe('PostController', () => {
  let postService: PostsService;

  let userService: UsersService;

  beforeEach(() => {
    postService = new PostsService();
    userService = new UsersService();
  });

  it('Should be defined', () => {
    expect(postService).toBeDefined();
    expect(userService).toBeDefined();
  });

  const randNumber = Math.floor(Math.random() * 1000000);
  const userData: signupUserType = {
    username: `unitTestUser${randNumber}`,
    surname: 'test',
    name: 'test',
    email: `unit${randNumber}@test.com`,
    password: 'unitest99',
  };
  let user: User;

  it('should create user', async () => {
    user = await userService.createUser(userData);

    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.username).toBe(userData.username);
    expect(user.name).toBe(userData.name);
    expect(user.surname).toBe(userData.surname);
  });

  const postData: CreatePostDto = {
    title: `Test ${randNumber}`,
    description: 'Test description',
    visibility: PostVisibility.hidden,
  };

  it('should create post', async () => {
    const newPost = await postService.createNewPost(postData, user);

    expect(newPost.title).toBe(postData.title);
    expect(newPost.description).toBe(postData.description);
    expect(newPost.visibility).toBe(postData.visibility);
  });
});
