import { User } from '@prisma/client';

export const sanitizedAdmin = (user: User) => {
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    password: user.password,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
