import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface'; 
import  User from '../models/user.model';
import { Types } from 'mongoose'; 
import { string } from '@hapi/joi';
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
  public async getAllNotes(body:Inote): Promise<Inote[] > {
   
    let note= await Note.find({$and:[{createdBy:new Types.ObjectId(body.createBy)},{isTrash:false},{isArchive:false}]});
    if(!note)
      throw new Error("Note not found");
    return note;
  }

// public async getAllNotes(body: Inote): Promise<Inote[]> {
//   const createdBy = body.createBy;
//   console.log('CreatedBy:', createdBy);

//   // Ensure it's cast correctly as ObjectId only if needed
//   const queryCreatedBy = Types.ObjectId.isValid(createdBy)
//     ? new Types.ObjectId(createdBy)
//     : createdBy;

//   return await Note.find({
//     $and: [
//       { createdBy: queryCreatedBy }, // Safely cast as ObjectId if necessary
//       { isTrash: false },
//       { isArchive: false }
//     ]
//   });
// }

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
    const updatedNote = await Note.findOneAndUpdate( {$and: [{_id: new Types.ObjectId(noteId) as any },{ isTrash: false },{ isArchive: false }]},noteData,{ new: true });
     if(!updatedNote)
      throw new Error ('Note not found');
    return updatedNote.save();
  }
  // Delete a note by ID
  public async deleteNote(noteId: string): Promise<Inote | null> {
    if(!noteId){
      throw new Error("note id is required");
    }
    let note=await Note.findOne({$and:[{_id:noteId},{isTrash:false}]});
    if(!note)
      throw new Error ('Note not found');
    note.isTrash=!note.isTrash;
    return note.save();
  }
  //View the Trash Notes
  public viewTrash=async(body:Inote):Promise<Inote|null> =>{
    return await Note.find({$and:[{createdBy:new Types.ObjectId(body.createBy)},{isTrash:true}]})
  }
  //  perform trash and restore operation
  public trash =async(noteId:string):Promise<Inote|null>=>{
    if(!noteId){
      throw new Error("note id is required");
    }
    let note=await Note.findOne({_id:noteId});
    if(!note)
      throw new Error ('Note not found');
    note.isTrash=!note.isTrash;
    return note.save();
  
  };
  //view the Archive note
  public viewArchive=async(body:Inote):Promise<Inote|null> =>
  {
    return await Note.find({$and:[{createdBy:new Types.ObjectId(body.createBy)},{isArchive:true}]})
  }
   //perform Archive operation
  public archive =async(noteId:string):Promise<Inote|null>=>{
    if(!noteId){
      throw new Error("note id is required");
    }
    let note=await Note.findOne({$and:[{_id:noteId},{isTrash:false}]});
    if (!note) {
      throw new Error("Note not found");
    }
    note.isArchive = !note.isArchive;
    return note.save();
  
  };
  public pemanentlyDelete = async(noteId:string):Promise<Inote|null> => {
    return await Note.deleteOne({$and:[{_id:noteId},{isTrash:true}]})
   
  };
}

export default NoteService;
