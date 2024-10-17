import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { string } from '@hapi/joi';

const userSchema = new Schema(
  {
    Firstname: {
      type: String, require:true
    },
    Lastname:{
      type:String,require:true
    },Email:{
      type:String,require:true,unique:true
    },
    Password:{
      type:String,require:true
    }
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);
