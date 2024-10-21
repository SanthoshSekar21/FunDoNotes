import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import NoteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';

class NoteRoutes {
  private NoteController = new NoteController();
  private router = express.Router();
  private NoteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // //route to get all users
    // this.router.get('', this.UserController.getAllUsers);

    //route to create a new user
    // this.router.post(
    //   '/register',
    //   this.UserValidator.newUser,
    //   this.UserController.newUser
    // );
    this.router.post('/',
      this.NoteValidator.newNote,userAuth,
      this.NoteController.createNote)
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

export default NoteRoutes;
