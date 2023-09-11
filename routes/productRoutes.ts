import express from 'express';
import productController from '../controllers/productController';
import ProductValidators from '../Validators/productValidator';
import auth from '../middlewares/auth';
import { allowedTo } from '../middlewares/allowedTo';
import uploadToDiskStorage from '../middlewares/multer';

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getAllMineProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = productController;

const {
  validateCreateProduct,
  validateUpdateProduct,
  validateGetProduct,
  validateDeleteProduct,
  validatorMiddleware,
} = ProductValidators;

router.use(auth);

router.use(allowedTo('user', 'admin'));

router.route('/Mine').get(getAllMineProducts);

router
  .route('/')
  .get(getAllProducts)
  .post(
    uploadToDiskStorage.single('imageUrl'),
    validateCreateProduct(),
    validatorMiddleware,
    createProduct,
  );

router
  .route('/:id')
  .get(validateGetProduct(), validatorMiddleware, getProductById)
  .patch(
    uploadToDiskStorage.single('imageUrl'),
    validateUpdateProduct(),
    validatorMiddleware,
    updateProduct,
  )
  .delete(validateDeleteProduct(), validatorMiddleware, deleteProduct);

export default router;
