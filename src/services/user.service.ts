import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/user.util';
class UserService {

  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const existingUser = await User.findOne({Email:body.Email}).exec();
    if(existingUser){
      throw new Error("Email Id is Already Exists")
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
        process.env.JWT_SECRET
    );
    return [token,data[0].Firstname,data[0].Lastname];
    }
  };
  
  public forgetPassword= async(body):Promise<any> =>{
    if (!body.Email) {
      throw new Error("Email is required");
  }

    const data = await User.find({ Email: body.Email });
    if(data.length==0)
      throw new Error("No user exists")
    const token = jwt.sign({Email:body.Email},process.env.JWT_FORGETSECRET,{expiresIn:'10m'});
    const subject = 'Password Reset Token';
    const message = `Your password reset token is: ${token}`;
    await sendEmail({
      recipients: body.Email, // Send to the user's email
      subject: subject,
      message: message
  });
  return token;
  }
  public resetPassword= async(body):Promise<any>=>{
    const hashedPassword = await bcrypt.hash(body.Password, 10);    
    return await User.updateOne({Email:body.Email},{Password:hashedPassword})
   }

}

export default UserService;
