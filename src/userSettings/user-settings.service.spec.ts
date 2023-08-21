import { Test, TestingModule } from '@nestjs/testing';
import { AccountVisibility, Languages, User } from '@prisma/client';
import { signupUserType } from '../types/types';
import { UsersService } from '../users/users.service';
import { UserSettingsService } from './user-settings.service';

describe('userSettingsService', () => {
  let settingsService: UserSettingsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingsService, UsersService],
    }).compile();

    settingsService = module.get<UserSettingsService>(UserSettingsService);
    usersService = module.get<UsersService>(UsersService);
  });

  const randNumber = Math.floor(Math.random() * 1000000);
  const newUser: signupUserType = {
    username: `unitTestUser${randNumber}`,
    surname: 'test',
    name: 'test',
    email: `unit${randNumber}@test.com`,
    password: 'unitest99',
  };
  let createdUser: User;
  const avatarSeed = '123123123';

  it('should be defined', () => {
    expect(settingsService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create user', async () => {
    const registerResponse = await usersService.createUser(newUser);

    expect(registerResponse.email).toBe(newUser.email);
    expect(registerResponse.password).toBe(newUser.password);
    expect(registerResponse.username).toBe(newUser.username);
    expect(registerResponse.name).toBe(newUser.name);
    expect(registerResponse.surname).toBe(newUser.surname);
    createdUser = registerResponse;
  });

  describe('gets', () => {
    it('get settings', async () => {
      const response = await settingsService.getUserSettings(createdUser);

      expect(response?.language).toBeDefined();
      expect(response?.visibility).toBeDefined();
      expect(response?.userId).toStrictEqual(createdUser.id);
    });
  });

  describe('sets', () => {
    it('set language', async () => {
      const response = await settingsService.setUserLanguage(
        createdUser,
        Languages.EN,
      );

      expect(response.language).toStrictEqual(Languages.EN);
    });

    it('set visibility', async () => {
      const response = await settingsService.setUserVisibility(
        createdUser,
        AccountVisibility.hidden,
      );

      expect(response.visibility).toStrictEqual(AccountVisibility.hidden);
    });

    it('set avatar', async () => {
      const response = await settingsService.setAvatar(createdUser, avatarSeed);

      expect(response.avatar).toStrictEqual(avatarSeed);
    });
  });
});
