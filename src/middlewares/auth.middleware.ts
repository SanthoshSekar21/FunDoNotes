 /* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';


/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const bearerToken = authHeader?.split(' ')[1];
    if (!bearerToken)
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required'
      };try{
    const user: any = await jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.body.createdBy=user.id;
      }catch(error){
        req.body.email =(await jwt.verify(bearerToken,process.env.JWT_FORGETSECRET)).Email;
    
      }
    // res.locals = user;
    // res.locals.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
