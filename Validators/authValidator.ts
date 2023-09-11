import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';

class AuthValidators {
  static validateSignup(): ValidationChain[] {
    return [
      body('fullname').notEmpty().withMessage('Fullname is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
      body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    ];
  }

  static validateLogin(): ValidationChain[] {
    return [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').notEmpty().withMessage('Password is required'),
    ];
  }

  static validateForgetPassword(): ValidationChain[] {
    return [body('email').isEmail().withMessage('Invalid email')];
  }

  static validateVerifyResetCode(): ValidationChain[] {
    return [
      body('resetCode')
        .notEmpty()
        .withMessage('Reset code is required')
        .isNumeric()
        .withMessage('Reset code must be numeric'),
    ];
  }

  static validateResetPassword(): ValidationChain[] {
    return [
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
      body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    ];
  }

  static validatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

export default AuthValidators;
