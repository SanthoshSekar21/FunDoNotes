import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class NoteValidator {
  public newNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
//   public loginUser=(req:Request,res:Response,next:NextFunction):void =>{
//     const schema = Joi.object({
//     Email:Joi.string().email().required(),
//     Password:Joi.string().min(8).required()
//   });
  
//    const { error } = schema.validate(req.body);
//   if (error) {
//     next(error);
//   }
//   next();
// }
 }

export default NoteValidator;
