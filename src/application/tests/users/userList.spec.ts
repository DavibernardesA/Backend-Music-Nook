import { UserList } from '../../users/userList';
import { UserRepository } from '../../../domain/core/repositories/userRepository';
import { createUser, createUserMinimumInformationDTO, createUserInformationDTO } from '../utils';
import * as getUserInfoModule from '../../utils/getUserInfo';
import { userInformationDTO } from '../../../domain/core/models/dtos/userInformation';
import { UserMinimumInformationDTO } from '../../../domain/core/models/dtos/userMinimumInformationDTO';

describe('UserList', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let userList: UserList;

  beforeEach(() => {
    userRepositoryMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn()
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assertResult = (result: any, targetMockUser: any, isFullInfo: boolean) => {
    if (isFullInfo) {
      expect(result).toBeInstanceOf(userInformationDTO);
      expect(result).toEqual(createUserInformationDTO(targetMockUser));
    } else {
      expect(result).toBeInstanceOf(UserMinimumInformationDTO);
      expect(result).toEqual(createUserMinimumInformationDTO(targetMockUser));
    }
  };

  it('should return user info for a target user if followed or public', async () => {
    const { mockUser, targetMockUser } = await setUp(false, true);

    jest.spyOn(getUserInfoModule, 'getUserInfoForTarget').mockResolvedValue(createUserInformationDTO(targetMockUser));

    userRepositoryMock.findById.mockResolvedValue(mockUser);

    const result = await userList.handler(mockUser.id, targetMockUser.id);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockUser.id);
    expect(getUserInfoModule.getUserInfoForTarget).toHaveBeenCalledWith(userRepositoryMock, mockUser, targetMockUser.id);
    assertResult(result, targetMockUser, true);
  });

  it('should return minimal user info for a private target user if not followed', async () => {
    const { mockUser, targetMockUser } = await setUp(true, false);

    jest.spyOn(getUserInfoModule, 'getUserInfoForTarget').mockResolvedValue(createUserMinimumInformationDTO(targetMockUser));

    userRepositoryMock.findById.mockResolvedValue(mockUser);

    const result = await userList.handler(mockUser.id, targetMockUser.id);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockUser.id);
    expect(getUserInfoModule.getUserInfoForTarget).toHaveBeenCalledWith(userRepositoryMock, mockUser, targetMockUser.id);
    assertResult(result, targetMockUser, false);
  });

  it('should return a list of users if no target user is specified', async () => {
    const mockUser1 = await createUser('@user1', 'user1', [], []);
    const mockUser2 = await createUser('@user2', 'user2', [], []);
    const mockUser3 = await createUser('@user3', 'user3', [], [], true); //private user

    userRepositoryMock.findAll.mockResolvedValue([mockUser1, mockUser2, mockUser3]);
    userRepositoryMock.findById.mockResolvedValue(mockUser1);
    const result = await userList.handler(mockUser1.id);

    expect(userRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(3);
    expect(result).toEqual([createUserInformationDTO(mockUser1), createUserInformationDTO(mockUser2), createUserMinimumInformationDTO(mockUser3)]);
  });
});
