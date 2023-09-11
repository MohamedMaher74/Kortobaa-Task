import express from 'express';
import userController from '../controllers/userController';
import UserValidators from '../Validators/userValidator';
import auth from '../middlewares/auth';
import { allowedTo } from '../middlewares/allowedTo';

const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteMe,
} = userController;

const {
  validateCreateUser,
  validateUpdateUser,
  validateGetUser,
  validateDeleteUser,
  validatorMiddleware,
  validateUpdateLoggedUserPassword,
  validateupdateLoggedUserData,
} = UserValidators;

router.use(auth);

router.get('/getMe', getLoggedUser);

router.patch(
  '/changeMyPassword',
  validateUpdateLoggedUserPassword(),
  validatorMiddleware,
  updateLoggedUserPassword,
);

router.patch('/updateMe', validateupdateLoggedUserData(), updateLoggedUserData);

router.delete('/deleteMe', deleteMe);

router.use(allowedTo('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(validateCreateUser(), validatorMiddleware, createUser);

router
  .route('/:id')
  .get(validateGetUser(), validatorMiddleware, getUserById)
  .patch(validateUpdateUser(), validatorMiddleware, updateUser)
  .delete(validateDeleteUser(), validatorMiddleware, deleteUser);

export default router;
