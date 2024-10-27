import { expect } from 'chai';
import UserService from '../../src/services/user.service';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import { IUser } from '../../src/interfaces/user.interface';
dotenv.config();

describe('User', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  describe('Register User', () => {
    it('should throw an error if the email already exists', async () => {
      const userService = new UserService();
      const mockUser: Partial<IUser> = {
        Firstname: 'John',
        Lastname: 'Doe',
        Email: 'john.doe@example.com',
        Password: 'password123',
      };

      // First, create a user with the mock email
      const result = await userService.newUser(mockUser as IUser);
      expect(result).to.be.an('object');
      expect(result.Email).to.equal(mockUser.Email);

      // Attempt to register the same user again to trigger the "email already exists" error
      try {
        await userService.newUser(mockUser as IUser);
      } catch (error: any) {
        expect(error.message).to.equal('Email Id is Already Exists');
      }
    });
  });
});
