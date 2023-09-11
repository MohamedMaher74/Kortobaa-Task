import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationChain,
  body,
  param,
} from 'express-validator';

class ProductValidators {
  static validateCreateProduct(): ValidationChain[] {
    return [
      body('title').notEmpty().withMessage('Title is required'),
      body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    ];
  }

  static validateUpdateProduct(): ValidationChain[] {
    return [
      param('id').isInt().withMessage('Product ID must be an integer'),
      body('title').optional().notEmpty(),
      body('imageUrl')
        .optional()
        .notEmpty()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
      body('price')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    ];
  }

  static validateGetProduct(): ValidationChain[] {
    return [param('id').isInt().withMessage('Product ID must be an integer')];
  }

  static validateDeleteProduct(): ValidationChain[] {
    return [param('id').isInt().withMessage('Product ID must be an integer')];
  }

  static validatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

export default ProductValidators;
