import { Document,Types} from 'mongoose';

export interface Inote extends Document {
  _id: string | number;
  title : string;
description : string;
color : string;
isArchive : boolean;
isTrash : boolean;
createdBy :Types.ObjectId;
createdAt?: Date;
updatedAt?: Date;
}
