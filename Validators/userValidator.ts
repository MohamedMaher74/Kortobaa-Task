import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationChain,
  body,
  param,
} from 'express-validator';
import { Roles } from '../enum/roles';

class UserValidators {
  static validateCreateUser(): ValidationChain[] {
    return [
      body('fullname').notEmpty().withMessage('Fullname is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('role')
        .optional()
        .isIn([Roles.USER, Roles.ADMIN])
        .withMessage('Invalid role. It must be either "user" or "admin"'),
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

  static validateUpdateUser(): ValidationChain[] {
    return [
      param('id').notEmpty().withMessage('User ID is required'),
      body('fullname').optional().notEmpty(),
      body('role')
        .optional()
        .isIn([Roles.USER, Roles.ADMIN])
        .withMessage('Invalid role. It must be either "user" or "admin"'),
    ];
  }

  static validateGetUser(): ValidationChain[] {
    return [param('id').notEmpty().withMessage('User ID is required')];
  }

  static validateDeleteUser(): ValidationChain[] {
    return [param('id').notEmpty().withMessage('User ID is required')];
  }

  static validateUpdateLoggedUserPassword(): ValidationChain[] {
    return [
      body('oldPassword')
        .notEmpty()
        .withMessage('Old password is required')
        .isLength({ min: 6 })
        .withMessage('Old password must be at least 6 characters long'),
      body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
      body('newPasswordConfirm')
        .notEmpty()
        .withMessage('Password confirmation is required')
        .custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error(
              'New password confirmation does not match new password',
            );
          }
          return true;
        }),
    ];
  }

  static validateupdateLoggedUserData(): ValidationChain[] {
    return [body('fullname').optional().notEmpty()];
  }

  static validatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

export default UserValidators;
