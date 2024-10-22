import { Request, Response,NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import NoteService from '../services/note.service';

class NoteController {
  public NoteService = new NoteService()
 /**
   * Controller to create new user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  // Create a new note
  public createNote = async (req: Request,
     res: Response,
    next:NextFunction
    ): Promise<void> => {
    try {
      
    const newNote = await this.NoteService.createNote(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: newNote,
        message:`note created successfully`});
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`});
    }
  };

  //Get all notes for the authenticated user
  public getAllNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const notes = await this.NoteService.getAllNotes(req.body);
      
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: notes,
        });
     
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`});
    }
  };
  // Get a single note by ID
  public getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const noteId = req.params.id; // Get noteId from route param
        // Call the service to get the note
        const note = await this.NoteService.getNote(noteId);

        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: note,
        });
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            code: HttpStatus.BAD_REQUEST,
            message: error.message,
        });
    }
};
  
  // Update a note
  public updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const noteId = req.params.noteId;
      const noteData = req.body;
      const updatedNote = await this.NoteService.updateNote(noteId, noteData);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: updatedNote,
        message: 'Note updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
  // Delete a note
  public deleteNote = async (req: Request, res: Response): Promise<any> => {
    try {
      const noteId = req.params.noteId;
      const deletedNote = await this.NoteService.deleteNote(noteId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message:'deleted successfully',
      })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting note', error });
    }
  };
}

export default NoteController;
