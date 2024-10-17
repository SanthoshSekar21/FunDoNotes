import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // //route to get all users
    // this.router.get('', this.UserController.getAllUsers);

    //route to create a new user
    this.router.post(
      '/register',
      this.UserValidator.newUser,
      this.UserController.newUser
    );
    this.router.post('/login',
      this.UserValidator.loginUser,
      this.UserController.loginUser)
    // //route to get a single user
    // this.router.get('/:_id',  this.UserController.getUser);

    // //route to update a single user
    // this.router.put('/:_id', this.UserController.updateUser);

    // //route to delete a single user
    // this.router.delete('/:_id', this.UserController.deleteUser);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
