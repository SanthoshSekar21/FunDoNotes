import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';
import dotenv from 'dotenv';
dotenv.config();
class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

    this.router.post(
      '/register',
      this.UserValidator.newUser,
      this.UserController.newUser
    );
    this.router.post('/login',
      this.UserValidator.loginUser,
      this.UserController.loginUser);

      this.router.post('/forgetPassword',
        this.UserValidator.forgetPassword,
        this.UserController.forgetPassword)

      this.router.put('/resetpassword/',
        this.UserValidator.resetPassword,
        userAuth(process.env.JWT_FORGETSECRET),
        this.UserController.resetPassword);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
