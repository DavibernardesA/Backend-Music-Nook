import { UserList } from '../../users/userList';
import { UserRepository } from '../../../domain/core/repositories/userRepository';
import { createUser, createUserMinimumInformationDTO, createUserInformationDTO } from '../utils';
import * as getUserInfoModule from '../../utils/getUserInfo';
import { userInformationDTO } from '../../../domain/core/models/dtos/userInformation';
import { UserMinimumInformationDTO } from '../../../domain/core/models/dtos/userMinimumInformationDTO';
import { UserNotFoundException } from '../../exceptions/users/UserNotFoundException';

describe('UserList', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let userList: UserList;

  beforeEach(() => {
    userRepositoryMock = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      isFollowing: jest.fn()
    } as unknown as jest.Mocked<UserRepository>;

    userList = new UserList(userRepositoryMock);
  });

  const setUp = async (isPrivate: boolean, isFollowed: boolean) => {
    const mockUser = await createUser('@johndoe_2024', 'johndoe', [], []);
    const targetMockUser = await createUser('@john_2024', 'john', [mockUser], [mockUser], isPrivate);

    mockUser.followers = [targetMockUser];
    mockUser.following = isFollowed ? [targetMockUser] : [];

    return { mockUser, targetMockUser };
  };

  it('should return minimal user info for a private target user if not followed', async () => {
    const { mockUser, targetMockUser } = await setUp(true, false);

    jest.spyOn(getUserInfoModule, 'getUserInfoForTarget').mockResolvedValue(createUserMinimumInformationDTO(targetMockUser));

    userRepositoryMock.findById.mockResolvedValue(mockUser);

    const result = await userList.handler(mockUser.id, targetMockUser.id);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockUser.id);
    expect(getUserInfoModule.getUserInfoForTarget).toHaveBeenCalledWith(userRepositoryMock, mockUser, targetMockUser.id);
    expect(result).toBeInstanceOf(UserMinimumInformationDTO);
    expect(result).toEqual(createUserMinimumInformationDTO(targetMockUser));
  });

  it('should return a list of users if no target user is specified', async () => {
    const mockUser1 = await createUser('@user_1111', 'user1', [], []);
    const mockUser2 = await createUser('@user_2222', 'user2', [], []);
    const mockUser3 = await createUser('@user_3333', 'user3', [], [], true); //private user

    userRepositoryMock.findAll.mockResolvedValue([mockUser1, mockUser2, mockUser3]);
    userRepositoryMock.findById.mockResolvedValue(mockUser1);
    const result = await userList.handler(mockUser1.id);

    expect(userRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(3);
    expect(result).toEqual([createUserInformationDTO(mockUser1), createUserInformationDTO(mockUser2), createUserMinimumInformationDTO(mockUser3)]);
  });

  it('should return user info for a target user if followed or public', async () => {
    const { mockUser, targetMockUser } = await setUp(false, true);

    jest.spyOn(getUserInfoModule, 'getUserInfoForTarget').mockResolvedValue(createUserInformationDTO(targetMockUser));

    userRepositoryMock.findById.mockResolvedValue(mockUser);

    const result = await userList.handler(mockUser.id, targetMockUser.id);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockUser.id);
    expect(getUserInfoModule.getUserInfoForTarget).toHaveBeenCalledWith(userRepositoryMock, mockUser, targetMockUser.id);
    expect(result).toBeInstanceOf(userInformationDTO);
    expect(result).toEqual(createUserInformationDTO(targetMockUser));
  });

  it('should throw an error if the user is not found', async () => {
    const { mockUser, targetMockUser } = await setUp(false, true);

    jest.spyOn(getUserInfoModule, 'getUserInfoForTarget').mockResolvedValue(createUserInformationDTO(targetMockUser));

    userRepositoryMock.findById.mockRejectedValue(new UserNotFoundException('User not found.'));

    await expect(userList.handler(mockUser.id, targetMockUser.id)).rejects.toThrow(UserNotFoundException);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockUser.id);
  });
});
