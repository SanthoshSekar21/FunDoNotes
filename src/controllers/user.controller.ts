/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';

import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

  /**
   * Controller to create new user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public newUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      // const existingUser = await this.UserService.findByEmail(req.body.Email);
      const data = await this.UserService.newUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: `${req.body.Firstname}${req.body.Lastname} registered Successfully!`
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`});
    
    }
  };
  /** 
  * Controller to create new user
  * @param  {object} Request - request object
  * @param {object} Response - response object
  * @param {Function} NextFunction
  */
  public loginUser = async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
      const token= await this.UserService.loginUser(req.body);
      
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: `${token[1]} ${token[2]} login Successful!`,
          token:token[0],
          });
      }
     catch (error) {
      
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        
        message: `${error}`})
    
    }
  };
  public forgetPassword= async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
       await this.UserService.forgetPassword(req.body);
      
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: ` Token sent to Email SuccessFully`,
          });
      }
     catch (error) {
      
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        
        message: `${error}`})
    }
  };
  public resetPassword = async(req: Request,
    res: Response,):Promise<any> =>{
      try {
        await this.UserService.resetPassword(req.body);
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: "Password reset Successfully ",
            });
        }
       catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          
          message: `${error}`}) 
      }
    };

 
}

export default UserController;
