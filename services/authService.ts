import { PrismaClient } from '@prisma/client';
import {
  SignUpType,
  LoginType,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from '../interfaces/authInterface';
import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError';
import generateOTP, { encrypt } from '../utils/generateOTP';
import comparePasswords from '../utils/correctPassword';
import { sanitizedUser } from '../responseTypes/userSanitizer';
import sendEmail from '../utils/sendEmails';

const prisma = new PrismaClient();

class AuthService {
  async signUp(data: SignUpType) {
    try {
      const { fullname, email, password } = data;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          role: 'user',
        },
      });

      const sanitizedUserData = sanitizedUser(user);

      return sanitizedUserData;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginType) {
    try {
      const { email, password } = data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await comparePasswords(password, user.password))) {
        throw new ApiError('Incorrect email or password', 401);
      }

      const sanitizedUserData = sanitizedUser(user);

      return sanitizedUserData;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(data: forgetPassword) {
    try {
      const { email } = data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new ApiError(`There is no user with that email ${email}`, 404);
      }

      const { otp, hashedOTP, otpExpiration } = generateOTP();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: hashedOTP,
          resetExpiresTime: otpExpiration,
        },
      });

      const message = `Hi ${
        user.fullname.split(' ')[0]
      },\n We received a request to reset the password on your Business Account. \n ${otp} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Kortobaa Team`;
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your password reset code (valid for 3 min)',
          message,
        });
      } catch (err) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: undefined,
            resetExpiresTime: undefined,
          },
        });

        throw new ApiError(`There is an error in sending email`, 500);
      }

      return { message: `Check code in your email: ${user.email}`, user };
    } catch (error) {
      throw error;
    }
  }

  async verifyResetCode(data: verifyResetCode) {
    try {
      const { resetCode } = data;

      const hashedOTP = encrypt(resetCode);

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: hashedOTP,
          resetExpiresTime: { gte: new Date() },
          passwordResetVerified: false,
        },
      });

      if (!user) {
        throw new ApiError(`Reset code invalid or expired!`, 404);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetVerified: true,
        },
      });

      return { message: `Now you can reset your password` };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data: resetPassword) {
    try {
      const { id, password } = data;

      const user = await prisma.user.findFirst({
        where: { id, passwordResetVerified: true },
      });

      if (!user) {
        throw new ApiError(`You didn't confirm otp yet!`, 404);
      }

      if (await comparePasswords(password, user.password)) {
        throw new ApiError('You can not use the old password!', 401);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetVerified: false,
          resetPasswordToken: null,
          resetExpiresTime: null,
        },
      });

      return { message: `Password reset successfully!` };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
