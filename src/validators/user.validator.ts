import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class UserValidator {
  public newUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      Firstname: Joi.string().min(2).required(),
      Lastname: Joi.string().min(2).required(),
      Email:Joi.string().email().required(),
      Password:Joi.string().min(8).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
  public loginUser=(req:Request,res:Response,next:NextFunction):void =>{
    const schema = Joi.object({
    Email:Joi.string().email().required(),
    Password:Joi.string().min(8).required()
  });
  
   const { error } = schema.validate(req.body);
  if (error) {
    next(error);
  }
  next();
}
public forgetPassword=(req:Request,res:Response,next:NextFunction):void =>{
  const schema = Joi.object({
  Email:Joi.string().required(),
});

 const { error } = schema.validate(req.body);
if (error) {
  next(error);
}
next();
}
public resetPassword=(req:Request,res:Response,next:NextFunction):void =>{
  const schema = Joi.object({
    Password:Joi.string().min(8).required(),
    
});

 const { error } = schema.validate(req.body);
if (error) {
  next(error);
}
next();
}
}

export default UserValidator;
