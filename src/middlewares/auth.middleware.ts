/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
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
    let bearerToken = req.body.accessToken || req.header('Authorization')?.split(' ')[1];
    if (!bearerToken)
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required'
      };
    bearerToken = bearerToken.split(' ')[1];
<<<<<<< Updated upstream
    const  user : any = await jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.body.createBy=user.id;
    // res.locals = user;
    // res.locals.token = bearerToken;
=======
<<<<<<< Updated upstream

    const { user }: any = await jwt.verify(bearerToken, 'your-secret-key');
    res.locals.user = user;
    res.locals.token = bearerToken;
=======
    const user: any = await jwt.verify(bearerToken, req.body.accessToken ? process.env.JWT_SECRET : process.env.JWT_FORGETSECRET);

    req.body.createdBy=user.id;
    
    // res.locals = user;
    // res.locals.token = bearerToken;
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    next();
  } catch (error) {
    next(error);
  }
};
