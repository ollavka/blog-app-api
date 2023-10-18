import { User } from '@prisma/client';

export type UserCredentials = {
  email: string;
  username: string;
  password: string;
};
