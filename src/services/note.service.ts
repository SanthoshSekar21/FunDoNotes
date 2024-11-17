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
   const updateNote=await Note.findOneAndUpdate({$and:[{_id:new Types.ObjectId(noteId)},{isTrash:false},{isArchive:false}]},noteData,{new:true});
  if(!updateNote)
  throw new Error('note not found ')
  await redisClient.del(updateNote.createdBy.toString())
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
    await redisClient.del(note.createdBy.toString())
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
    await redisClient.del(note.createdBy.toString());   
     return note;
  };
  public permanentlyDelete = async (noteId: string): Promise<Inote | null> => {
    const note = await Note.deleteOne({ _id:new Types.ObjectId(noteId) as any, isTrash: true });
    await redisClient.del(note.toString());
    return note;
  };
  
}

export default NoteService;
