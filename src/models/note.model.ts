import { Schema, model,Types} from 'mongoose';
import { Inote } from '../interfaces/note.interface';
import { string } from '@hapi/joi';
import { boolean } from '@hapi/joi';

const noteSchema = new Schema<Inote>(
  {
    title:{type: String,require:true},
    description: {type: String,require:true},
    color: {type: String},
    isArchive: {type: Boolean,default:false},
    isTrash: {type: Boolean,default:false},
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }
  },
  {
    timestamps: true,        
  }
);


export default model('Note', noteSchema);
