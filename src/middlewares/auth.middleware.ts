//  /* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt  from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {string} secret - The secret key used for JWT verification
 */
export const userAuth = (secret: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        throw new Error('Authorization token is required')
      }
      const bearerToken = authHeader.split(' ')[1];
      if (!bearerToken) {
        return next({
            code: HttpStatus.BAD_REQUEST,
             message: 'Authorization token is required',
            });
      }
      const user: any = await jwt.verify(bearerToken, secret);
      req.body.createdBy = user.id;
      req.body.Email = user.Email;

      next();
    } catch (error) {
      next(error);
    } 
  };
};
