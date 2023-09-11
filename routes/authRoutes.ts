import express from 'express';
import authController from '../controllers/authController';
import auth from '../middlewares/auth';
import AuthValidators from '../Validators/authValidator';

const router = express.Router();

const {
  validateSignup,
  validateLogin,
  validateForgetPassword,
  validateVerifyResetCode,
  validateResetPassword,
  validatorMiddleware,
} = AuthValidators;

const { signup, login, forgetPassword, verifyResstCode, resetPassword } =
  authController;

router.post('/signup', validateSignup(), validatorMiddleware, signup);

router.post('/login', validateLogin(), validatorMiddleware, login);

router.post(
  '/forgetPassword',
  validateForgetPassword(),
  validatorMiddleware,
  forgetPassword,
);

router.post(
  '/verifyResetCode',
  validateVerifyResetCode(),
  validatorMiddleware,
  verifyResstCode,
);

router.post(
  '/resetPassword',
  auth,
  validateResetPassword(),
  validatorMiddleware,
  resetPassword,
);

export default router;
