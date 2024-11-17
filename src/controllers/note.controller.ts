import { Request, Response,NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import NoteService from '../services/note.service';
import { Types } from 'mongoose';
import noteModel from '../models/note.model';

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
  public getNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const note = await this.NoteService.getNote(req.params.noteId);

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
      const updatedNote = await this.NoteService.updateNote(req.params.noteId, req.body);
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
  public trash= async (req: Request, res: Response): Promise<any> => {
    try {
      const trash = await this.NoteService.trash(req.params.noteId);
      const message = trash.isTrash
      ? 'Note moved to the Trash successfully'
      : 'Note restored from the trash successfully';
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message:message
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
  
  public archive= async (req: Request, res: Response): Promise<any> => {
    try {
      const noteId = req.params.noteId;
      const archive = await this.NoteService.archive(noteId);
      const message = archive.isArchive 
      ? 'Note moved to the Archive successfully'
      : 'Note  UnArchive successfully';
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
         data:archive,
        message:message,
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
  public PermanentlyDelete = async (req: Request, res: Response): Promise<any> => {
    try {
      const noteId = req.params.noteId;
      const deletedNote = await this.NoteService.permanentlyDelete(noteId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message:'deleted successfully',
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };

}

export default NoteController;
