import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
class UserService {

  // //get all users
  // public getAllUsers = async (): Promise<IUser[]> => {
  //   const data = await User.find();
  //   return data;
  // };

  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const existingUser=await User.findOne({Email:body.Email}).exec();
    if(existingUser){
      throw new Error("Email Id is Aldready Exists")
    }
    const hashedPassword=await bcrypt.hash(body.Password,10);
    body.Password=hashedPassword;
    const data = await User.create(body);
    return   data;
  };
  // public findByEmail = async (Email: string): Promise<IUser | null> => {
  //   const user = await User.findOne({ Email }).exec();
  //   return user;
  // };
  
  public loginUser= async (body): Promise<any> => {
    const data = await User.find({ Email: body.Email });
    if(data.length==0){
     throw new Error("No user exists")
    }
    else if(data[0].Password!=body.Password)
      {
     throw new Error("Invalid Password")
    }
    else
      return data[0];
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
