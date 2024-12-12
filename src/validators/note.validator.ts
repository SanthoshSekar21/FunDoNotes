import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class NoteValidator {
  public newNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      color: Joi.string().optional().default('#FFFFFF'),
    
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

 }

export default NoteValidator;
