import { NextFunction, Request, Response } from 'express';
import UserService from '../services/userService';
import isEmailTaken from '../utils/isEmailTaken';
import response from '../utils/response';
import {
  CreateUser,
  UpdateUser,
  UpdateLoggedUserPassword,
  UpdateLoggedUserData,
} from '../interfaces/userInterface';
import CustomRequest from '../interfaces/customRequest';
import signToken from '../utils/signToken';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, email, password, role } = req.body;

      const emailTaken = await isEmailTaken(email);

      if (emailTaken) {
        return response(res, 400, {
          status: false,
          message: 'Email is already used!',
        });
      }

      const obj: CreateUser = {
        fullname,
        email,
        password,
        role,
      };

      const user = await UserService.createUser(obj);

      response(res, 201, {
        status: true,
        message: 'Account created successfully!',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sort, limit, skip } = req.query;

      const users = await UserService.getAllUsers({
        search: search as string,
        sort: sort as string,
        limit: parseInt(limit as string, 10),
        skip: parseInt(skip as string, 10),
      });

      response(res, 200, {
        status: true,
        message: `no. of users: ${users.length}`,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      const user = await UserService.getUserById(+userId);

      response(res, 200, {
        status: true,
        message: 'Your target user is found.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, role } = req.body;

      if (!fullname.length) {
        throw new Error('Fullname is required');
      }

      if (!role.length) {
        throw new Error('Role is required');
      }

      const obj: UpdateUser = {
        fullname,
        role,
      };

      const userId = +req.params.id;

      const user = await UserService.updateUser(userId, obj);

      response(res, 200, {
        status: true,
        message: 'User updated Correctly.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      await UserService.deleteUser(+userId);

      response(res, 204, {
        status: true,
        message: 'User deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoggedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).userId!;

      const user = await UserService.getUserById(userId);

      response(res, 200, {
        status: true,
        message: 'Logged-in user data retrieved successfully.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLoggedUserPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { oldPassword, newPassword } = req.body;

      const userId = (req as CustomRequest).userId!;

      const obj: UpdateLoggedUserPassword = {
        oldPassword,
        newPassword,
      };

      const user = await UserService.updateLoggedUserPassword(userId, obj);

      const token = signToken({ id: user.id });

      response(res, 200, {
        status: true,
        message: 'Your password updated successfuly.',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLoggedUserData(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname } = req.body;

      if (!fullname.length) {
        throw new Error('Fullname is required');
      }

      const userId = (req as CustomRequest).userId!;

      const obj: UpdateLoggedUserData = {
        fullname,
      };

      const user = await UserService.updateLoggedUserData(userId, obj);

      const token = signToken({ id: user.id });

      response(res, 200, {
        status: true,
        message: 'Your account data updated successfuly.',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).userId!;

      await UserService.deleteMe(userId);

      response(res, 204, {
        status: true,
        message: 'Your account deleted successfuly.',
      });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;
