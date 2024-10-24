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

   
    this.router.post('/createnote', 
      this.NoteValidator.newNote,
      userAuth,
      this.NoteController.createNote);

      this.router.get('/viewall', userAuth, this.NoteController.getAllNotes);
    // //route to get a single note
    this.router.get('/viewone/:noteId', userAuth, this.NoteController.getNote);

    // //route to update a note
    this.router.put('/update/:noteId', userAuth, this.NoteController.updateNote );

    //route to delete a note
    this.router.delete('/delete/:noteId',userAuth, this.NoteController.deleteNote);
    //route to a trash
    this.router.delete('/trash/:noteId',userAuth,this.NoteController.trash);
    //route to view the trash note
    this.router.get('/trash',userAuth,this.NoteController.viewTrash);
    // route to a archeive
    this.router.put('/archive/:noteId',userAuth,this.NoteController.archive);
    //route to a view the archive note
    this.router.get('/archive',userAuth,this.NoteController.viewArchive);
    //route to delete permanently
    this.router.delete('/permanentlydelete/:noteId',userAuth,this.NoteController.PermanentlyDelete);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
