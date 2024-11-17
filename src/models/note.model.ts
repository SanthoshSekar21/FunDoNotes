import { Schema, model,Types} from 'mongoose';
import { Inote } from '../interfaces/note.interface';
import { string } from '@hapi/joi';
import { boolean } from '@hapi/joi';

const noteSchema = new Schema<Inote>(
  {
    title:{type: String},
    description: {type: String},
    color: {type: String,default: '#FFFFFF' },
    isArchive: {type: Boolean,default:false},
    isTrash: {type: Boolean,default:false},
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,        
  }
);


export default model('Note', noteSchema);
