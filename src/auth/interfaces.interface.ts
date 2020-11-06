import { Request } from 'express';
import { User } from 'src/users/user.entity';

export interface RequestWithUser extends Request {
  user: User;
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
