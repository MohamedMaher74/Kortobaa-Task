import { PrismaClient } from '@prisma/client';
import {
  CreateUser,
  UpdateUser,
  UpdateLoggedUserPassword,
  UpdateLoggedUserData,
} from '../interfaces/userInterface';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';
import { sanitizedAdmin } from '../responseTypes/adminSanitizer';
import comparePasswords from '../utils/correctPassword';
import { sanitizedUser } from '../responseTypes/userSanitizer';

const prisma = new PrismaClient();

class UserService {
  async createUser(data: CreateUser) {
    try {
      const { fullname, email, password, role } = data;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          role,
        },
      });

      const sanitizedAdminData = sanitizedAdmin(user);

      return sanitizedAdminData;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();

      const sanitizedUsers = users.map((user) => sanitizedAdmin(user));

      return sanitizedUsers;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${id}`, 404);
      }

      const sanitizedAdminData = sanitizedAdmin(user);

      return sanitizedAdminData;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, data: UpdateUser) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${id}`, 404);
      }

      const updatedUser = await prisma.user.update({ where: { id }, data });

      const sanitizedAdminData = sanitizedAdmin(updatedUser);

      return sanitizedAdminData;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${id}`, 404);
      }

      await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async updateLoggedUserPassword(
    userId: number,
    data: UpdateLoggedUserPassword,
  ) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${userId}`, 404);
      }

      const { oldPassword, newPassword } = data;

      if (!(await comparePasswords(oldPassword, user.password))) {
        throw new ApiError('Wrong in current password!', 401);
      }

      if (await comparePasswords(newPassword, user.password)) {
        throw new ApiError('You can not use the old password!', 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const updatedUser = await prisma.user.update({
        where: { id: +userId },
        data: {
          password: hashedPassword,
        },
      });

      const sanitizedUserData = sanitizedUser(updatedUser);

      return sanitizedUserData;
    } catch (error) {
      throw error;
    }
  }

  async updateLoggedUserData(userId: number, data: UpdateLoggedUserData) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${userId}`, 404);
      }

      const updatedUser = await prisma.user.update({
        where: { id: +userId },
        data,
      });

      const sanitizedUserData = sanitizedUser(updatedUser);

      return sanitizedUserData;
    } catch (error) {
      throw error;
    }
  }

  async deleteMe(userId: number) {
    try {
      await prisma.user.delete({
        where: { id: +userId },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
