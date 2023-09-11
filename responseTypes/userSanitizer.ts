import { User } from '@prisma/client';

export const sanitizedUser = (user: User) => {
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
