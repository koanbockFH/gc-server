import { Request } from 'express';
import { UserEntity } from 'src/users/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

export interface AccessToken {
  access_token: string;
}

export interface Payload {
  userId: number;
}

export interface Message {
  message: string;
}
