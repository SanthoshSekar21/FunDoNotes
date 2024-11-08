import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface'; 
import { Types } from 'mongoose'; 
import  redisClient  from '../config/redis'
class NoteService {
  
  // Create a new note
      public createNote = async (noteData: any): Promise<any> => {
    const newNote = await Note.create(noteData); 
    // createdBy is already part of noteData
    newNote.createdBy=noteData.createdBy;
    await newNote.save();
    await redisClient.del(noteData.createdBy);

    return newNote; 
  
};
   
  // Get all notes for a specific user
  public async getAllNotes(body:Inote): Promise<Inote[]> {
    let notes= await Note.find({$and:[{createdBy:new Types.ObjectId(body.createdBy)},{isTrash:false},{isArchive:false}]});
    if(!notes)
      throw new Error("Note not found");
     await redisClient.setEx(`notes:${body.createdBy}`, 3600, JSON.stringify(notes));   
     return notes;
  }

  //Get Note BY Id
     public getNote = async (noteId:string): Promise<Inote | null> => {
        const note = await Note.findOne({$and:[{ _id: new Types.ObjectId(noteId)},{isTrash:false},{isArchive:false}]});
        // await redisClient.setEx(`note:${noteId}`, 3600, JSON.stringify(note));
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
     await redisClient.del(updatedNote.createdBy);
    return updatedNote.save();
  }

  // Delete a note by ID
  public async deleteNote(noteId: string): Promise<Inote | null> {
    let note=await Note.findOne({$and:[{_id:noteId},{isTrash:false}]});
    if(!note)
      throw new Error ('Note not found');
    note.isTrash=!note.isTrash;
    await note.save();
    await redisClient.del(note.createdBy);
   return await note.save();

  }

  //View the Trash Notes
  public viewTrash=async(body:Inote):Promise<Inote|null> =>
    await Note.find({$and:[{createdBy:body.createdBy},{isTrash:true}]})


  //  perform trash and restore operation
  public trash =async(noteId:string):Promise<Inote|null>=>{
    if(!noteId){
      throw new Error("note id is required");
    }
    let note=await Note.findOne({_id:noteId});
    if(!note)
      throw new Error ('Note not found');
    note.isTrash=!note.isTrash;
    await note.save();
    await redisClient.del(note.createdBy)
    return note
  };

  //view the Archive note
  public viewArchive=async(body:Inote):Promise<Inote|null> =>
  await Note.find({$and:[{createdBy:new Types.ObjectId(body.createdBy)},{isArchive:true}]})
    
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
    await note.save();
    await redisClient.del(note.createdBy);   
     return note;
  };
  public pemanentlyDelete = async(noteId:string):Promise<Inote|null> => {
    const note= await Note.deleteOne({$and:[{_id:new Types.ObjectId(noteId)},{isTrash:true}]})
    await redisClient.del(note.createdBy)
    return note;
  };
}

export default NoteService;
