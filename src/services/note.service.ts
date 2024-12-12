import Note from '../models/note.model';
import { Inote } from '../interfaces/note.interface'; 
import { Types } from 'mongoose'; 
import  redisClient  from '../config/redis'
class NoteService {
  
  // Create a new note
     public createNote = async (noteData: any): Promise<any> => {
      const color = noteData.color || 'white';
    const newNote = await Note.create({...noteData, color: color}); 
    newNote.createdBy=noteData.createdBy;
    await newNote.save();
    await redisClient.del(`notes:${noteData.createdBy}`);
    return newNote; 
  
};
   
  // Get all notes for a specific user
  public async getAllNotes(body:Inote): Promise<Inote[]> {
    let notes= await Note.find({createdBy:new Types.ObjectId(body.createdBy)});
    if(!notes)
      throw new Error("Note not found");
     await redisClient.setEx(`notes:${body.createdBy}`, 3600, JSON.stringify(notes));   
     return notes;
  }

  //Get Note BY Id
     public getNote = async (noteId:string): Promise<Inote | null> => {
        const note = await Note.findOne({$and:[{ _id: new Types.ObjectId(noteId)},{isTrash:false},{isArchive:false}]});
        return note;
    };

  // Update a note by ID
  public async updateNote(noteId: string, noteData: Partial<Inote>): Promise<Inote | null> {
<<<<<<< HEAD
   const updateNote=await Note.findOneAndUpdate({$and:[{_id:new Types.ObjectId(noteId)},{isTrash:false},{isArchive:false}]},noteData,{new:true});
  if(!updateNote)
  throw new Error('note not found ')
  await redisClient.del(updateNote.createdBy.toString())
=======
   const updateNote=await Note.findOneAndUpdate({$and:[{_id:new Types.ObjectId(noteId),isTrash:false}]},{...noteData},{new:true});
   if(!updateNote)
  throw new Error('note not found ')
  await redisClient.del(`notes:${updateNote.createdBy.toString()}`)
>>>>>>> Notes
  return updateNote  
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
    await note.save();
<<<<<<< HEAD
    await redisClient.del(note.createdBy.toString())
=======
    await redisClient.del(`notes:${note.createdBy.toString()}`)
>>>>>>> Notes
    return note
  };
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
<<<<<<< HEAD
    await redisClient.del(note.createdBy.toString());   
     return note;
  };
  public permanentlyDelete = async (noteId: string): Promise<Inote | null> => {
    const note = await Note.deleteOne({ _id:new Types.ObjectId(noteId) as any, isTrash: true });
    await redisClient.del(note.toString());
    return note;
  };
  
=======
    await redisClient.del(`notes:${note.createdBy.toString()}`);   
     return note;
  };
  public permanentlyDelete = async (noteId: string,createdBy:string): Promise<void> => {
    const result = await Note.deleteOne({ _id: new Types.ObjectId(noteId), isTrash: true });
    if (result.deletedCount === 0) {
      throw new Error('Note not found or not in trash');
    }
    await redisClient.del(`notes:${createdBy}`);
    return;
  };
  
  
>>>>>>> Notes
}

export default NoteService;
