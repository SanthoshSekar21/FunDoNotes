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
      const userId = req.body.createdBy;
      const newNote = await this.NoteService.createNote(req.body,userId);
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

  // Get all notes for the authenticated user
  // public getAllNotes = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const userId = req.user._id;
  //     const notes = await this.NoteService.getAllNotes(userId);
  //     res.status(200).json({ message: 'Notes fetched successfully', data: notes });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error fetching notes', error });
  //   }
  // };

  // Get a single note by ID
  // public getNoteById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const noteId = req.params.noteId;
  //     const note = await this.NoteService.getNoteById(noteId);
  //     if (!note) {
  //       return res.status(404).json({ message: 'Note not found' });
  //     }
  //     res.status(200).json({ message: 'Note fetched successfully', data: note });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error fetching note', error });
  //   }
  // };

  // Update a note
  // public updateNote = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const noteId = req.params.noteId;
  //     const noteData = req.body;
  //     const updatedNote = await this.NoteService.updateNote(noteId, noteData);
  //     if (!updatedNote) {
  //       return res.status(404).json({ message: 'Note not found' });
  //     }
  //     res.status(200).json({ message: 'Note updated successfully', data: updatedNote });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error updating note', error });
  //   }
  // };

  // Delete a note
  // public deleteNote = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const noteId = req.params.noteId;
  //     const deletedNote = await this.NoteService.deleteNote(noteId);
  //     if (!deletedNote) {
  //       return res.status(404).json({ message: 'Note not found' });
  //     }
  //     res.status(200).json({ message: 'Note deleted successfully', data: deletedNote });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error deleting note', error });
  //   }
  // };
}

export default NoteController;
