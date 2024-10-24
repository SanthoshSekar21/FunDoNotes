import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/user.util';
class UserService {

  // //get all users
  // public getAllUsers = async (): Promise<IUser[]> => {
  //   const data = await User.find();
  //   return data;
  // };

  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const existingUser = await User.findOne({Email:body.Email}).exec();
    if(existingUser){
      throw new Error("Email Id is Aldready Exists")
    }
    const hashedPassword=await bcrypt.hash(body.Password,10);
    body.Password=hashedPassword;
    const data = await User.create(body);
    return   data;
  };
  
  public loginUser= async (body): Promise<any> => {
    const data = await User.find({ Email: body.Email });
    if(data.length==0)
     throw new Error("No user exists")
  
    const passwordMatch=await bcrypt.compare(body.Password,data[0].Password)
    if(!passwordMatch)
     throw new Error("Invalid Password")
           
    else{
      const token = jwt.sign(
        { id: data[0]._id, email: data[0].Email }, 
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
    return [token,data[0].Firstname,data[0].Lastname];
    }
  };
  
 






  // //update a user
  // public updateUser = async (_id: string, body: IUser): Promise<IUser> => {
  //   const data = await User.findByIdAndUpdate(
  //     {
  //       _id
  //     },
  //     body,
  //     {
  //       new: true
  //     }
  //   );
  //   return data;
  // };

  //delete a user
  // public deleteUser = async (_id: string): Promise<string> => {
  //   await User.findByIdAndDelete(_id);
  //   return '';
  // };

  //get a single user
  // public getUser = async (_id: string): Promise<IUser> => {
  //   const data = await User.findById(_id);
  //   return data;
  // };
}

export default UserService;
