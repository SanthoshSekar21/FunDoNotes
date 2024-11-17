import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import NoteValidator from '../validators/note.validator';
 import { userAuth } from '../middlewares/auth.middleware';
 import { cache } from '../middlewares/cache.middleware';
 import dotenv from 'dotenv';
dotenv.config();
class NoteRoutes {
  private NoteController = new NoteController();
  private router = express.Router();
  private NoteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
   
    this.router.post('', 
      this.NoteValidator.newNote,
      userAuth(process.env.JWT_SECRET),
      this.NoteController.createNote);
   
      this.router.get('/',
       userAuth(process.env.JWT_SECRET), cache,
       this.NoteController.getAllNotes);

    // //route to get a single note
     this.router.get('/:noteId', 
      userAuth(process.env.JWT_SECRET), 
      this.NoteController.getNote);

    // //route to update a note
    this.router.put('/:noteId', 
      userAuth(process.env.JWT_SECRET), 
      this.NoteController.updateNote );

    //route to delete permanently
    this.router.delete('/:noteId/delete',
      userAuth(process.env.JWT_SECRET),
      this.NoteController.PermanentlyDelete);

    //route to a trash
    this.router.put('/:noteId/trash',
      userAuth(process.env.JWT_SECRET),
      this.NoteController.trash);

    // route to a archeive
    this.router.put('/:noteId/archive',
      userAuth(process.env.JWT_SECRET),
      this.NoteController.archive);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
