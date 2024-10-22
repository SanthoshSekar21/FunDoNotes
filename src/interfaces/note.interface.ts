import { Document,Types} from 'mongoose';

export interface Inote extends Document {
_id: string |number;
title : string;
description : string;
noteId:number
color : string;
isArchive :boolean;
isTrash :boolean;
createdBy :string;
createdAt?: Date;
updatedAt?: Date;
}
