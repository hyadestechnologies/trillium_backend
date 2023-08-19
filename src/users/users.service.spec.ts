import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { signupUserType, userInfoType } from 'src/types/types';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('userCRUD', () => {
        const randNumber = Math.floor(Math.random() * 1000000);
        const user: signupUserType = {
                username: `unitTestUser${randNumber}`,
                surname: 'test',
                name: 'test',
                email: `unit${randNumber}@test.com`,
                password: 'unitest99',
        };
        let userId: string;

        it('should create user', async () => {
            const registerResponse = await service.createUser(user);

            expect(registerResponse.email).toBe(user.email);
            expect(registerResponse.password).toBe(user.password);
            expect(registerResponse.username).toBe(user.username);
            expect(registerResponse.name).toBe(user.name);
            expect(registerResponse.surname).toBe(user.surname);
            userId = registerResponse.id;
        });

        it('should get user', async () => {
            const findUserResponse  = await service.findOne(user.username);
            
            expect(findUserResponse).toBeTruthy();
            
            // Only because lsp is trying to make me destroy the pc
            if (findUserResponse) {
                expect(findUserResponse.email).toBe(user.email);
                expect(findUserResponse.password).toBe(user.password);
                expect(findUserResponse.username).toBe(user.username);
                expect(findUserResponse.name).toBe(user.name);
                expect(findUserResponse.surname).toBe(user.surname);
            }
        });

        it('should get user info', async () => {
            const findUserResponse  = await service.getUserProfile(userId);
            
            expect(findUserResponse).toBeTruthy();
            
            // Only because lsp is trying to make me destroy the pc
            if (findUserResponse) {
                expect(findUserResponse.email).toBe(user.email);
                expect(findUserResponse.username).toBe(user.username);
                expect(findUserResponse.name).toBe(user.name);
                expect(findUserResponse.surname).toBe(user.surname);
            }
        });

        it('should get friend requests', async () => {
            const friendRequests = 
                await service.getUserFriendRequests(user.username);

            expect(friendRequests).toStrictEqual([]);
        });

        it('should update profile', async () => {
            const newUserInfo: userInfoType = {
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
                description: "This is the new description",
            };

            const updateProfileResponse = await service.updateProfile(
                {id: userId}, 
                newUserInfo
            );

            expect(updateProfileResponse.description)
                .toBe(newUserInfo.description);
            expect(updateProfileResponse.email).toBe(newUserInfo.email);
        });
    });
});
