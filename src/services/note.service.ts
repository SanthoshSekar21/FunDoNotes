import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface'; 
import  User from '../models/user.model';
import { Types } from 'mongoose';
class NoteService {
  
  // Create a new note
  
  
      // Method to create a new note
      public async createNote(noteData: Inote): Promise<any> {
             
        // Create the new note
        return await Note.create(noteData);
    
        
         
        
    }
  
  


  // // Get all notes for a specific user
  // public async getAllNotes(userId: string): Promise<Inote[]> {
  //   return await Note.find({ createdBy: userId });
  // }

  // // Get a single note by ID
  // public async getNoteById(noteId: string): Promise<Inote | null> {
  //   return await Note.findById(noteId);
  // }

  // // Update a note by ID
  // public async updateNote(noteId: string, noteData: Partial<Inote>): Promise<Inote | null> {
  //   return await Note.findByIdAndUpdate(noteId, noteData, { new: true });
  // }

  // // Delete a note by ID
  // public async deleteNote(noteId: string): Promise<Inote | null> {
  //   return await Note.findByIdAndDelete(noteId);
  // }
}

export default NoteService;
