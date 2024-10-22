import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface'; 
import  User from '../models/user.model';
import { Types } from 'mongoose';
class NoteService {
  
  // Create a new note
  
      public createNote = async (noteData: any): Promise<any> => {
    const newNote = await Note.create(noteData); 
    // createdBy is already part of noteData
    newNote.createdBy=noteData.createBy;
    newNote.save();
    return newNote; 
  
};
   
  // Get all notes for a specific user
  public async getAllNotes(body:Inote): Promise<Inote[]> {
    return await Note.find({$and:[{createdBy:body.createdBy},{isTrash:false},{isArchive:false}]});
  }
  
     public getNote = async (noteId: string): Promise<Inote | null> => {
        // Find the note by its _id
        const note = await Note.findOne({$and:[{ _id: new Types.ObjectId(noteId) as any},{isTrash:false},{isArchive:false}]});

        // If note doesn't exist, throw an error
        if (!note) {
            throw new Error("Note not found");
        }

        return note;
    };

  // Update a note by ID
  public async updateNote(noteId: string, noteData: Partial<Inote>): Promise<Inote | null> {
    if (!noteId) {
      throw new Error('Note ID is required');
    }
    // Find the note by ID and update it with the new data
    const updatedNote = await Note.findByIdAndUpdate(noteId, noteData);
    return updatedNote;
  }
  // Delete a note by ID
  public async deleteNote(noteId: string): Promise<Inote | null> {
    if(!noteId){
      throw new Error("note id is required");
    }
    return await Note.findOneAndUpdate({_id:noteId},{isTrash:true});
  }
}

export default NoteService;
