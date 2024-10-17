import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string | number;
  Firstname: string;
  Lastname:string;
  Email: string;
  Password: string;
}
