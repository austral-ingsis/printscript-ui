import { User } from "../utils/users";

class FriendDTO {
  constructor(readonly id: string, readonly nickname: string) {}

  static toUser(dto: FriendDTO): User {
    return {
      id: dto.id,
      name: dto.nickname,
    };
  }
}

export default FriendDTO;
