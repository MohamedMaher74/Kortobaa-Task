import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService';
import response from '../utils/response';
import signToken from '../utils/signToken';
import isEmailTaken from '../utils/isEmailTaken';
import CustomRequest from '../interfaces/customRequest';
import {
  LoginType,
  SignUpType,
  forgetPassword,
  resetPassword,
  verifyResetCode,
} from '../interfaces/authInterface';

const authService = new AuthService();

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, email, password, role } = req.body;

      const emailTaken = await isEmailTaken(email);

      if (emailTaken) {
        return response(res, 400, {
          status: false,
          message: 'Email is already used!',
        });
      }

      const obj: SignUpType = {
        fullname,
        email,
        password,
        role,
      };

      const user = await authService.signUp(obj);

      const token = signToken({ id: user.id });

      response(res, 201, {
        status: true,
        message: 'Account created successfully!',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const obj: LoginType = {
        email,
        password,
      };

      const user = await authService.login(obj);

      const token = signToken({ id: user.id });

      response(res, 200, {
        status: true,
        message: 'Login successful!',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const obj: forgetPassword = {
        email,
      };

      const { message, user } = await authService.forgetPassword(obj);

      const token = signToken({ id: user.id });

      response(res, 200, {
        status: true,
        message,
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyResstCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetCode } = req.body;

      const obj: verifyResetCode = {
        resetCode,
      };

      const { message } = await authService.verifyResetCode(obj);

      response(res, 200, {
        status: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;

      const Obj: resetPassword = {
        id: req.userId,
        password,
      };

      const { message } = await authService.resetPassword(Obj);

      response(res, 200, {
        status: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;
