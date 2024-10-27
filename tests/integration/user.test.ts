import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/index';

describe('User APIs Test', () => {
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
  const mockUser = {
    Firstname: 'John',
    Lastname: 'Doe',
    Email: 'john.doe@example.com',
    Password: 'password123'
  };

  describe('POST/users/register', () => {
    it('should create a new user with hashed password', (done) => {
      request(app.getApp())
        .post('/api/v1/users/register')
        .send(mockUser)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body.message).to.equal(`${mockUser.Firstname} ${mockUser.Lastname} registered Successfully!`);
          done();
        });
    });
     it('should return an error if the email already exists', (done) => {
      request(app.getApp())
        .post('/api/v1/users/register')
        .send(mockUser) // Attempting to register the same user again
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body.message).to.include('Email Id is Already Exists');
          done();
        });
    });

    
  });
  describe('POST/users/login', () => {
    it('should log in the user successfully', (done) => {
      const loginDetails = {
        Email: mockUser.Email,
        Password: mockUser.Password
      };
      request(app.getApp())
        .post('/api/v1/users/login')
        .send(loginDetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.token).to.be.a('string');
          expect(res.body.message).to.equal(`${mockUser.Firstname} ${mockUser.Lastname} login Successful!`);         
          done();
        });
    });
    it('should return error if user does not exist', (done) => {
      const invalidUser = {
        Email: 'nonexistent.email@example.com',
        Password: 'somepassword'
      };
        request(app.getApp())
          .post('/api/v1/users/login')
          .send(invalidUser)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(400);
            expect(res.body.message).to.include('No user exists');
            done();
          });
      });
      it('should return error for incorrect password', (done) => {
        const mockUser = {
          Email: 'john.doe@example.com',
          Password: 'wrongpassword'
        };
  
        request(app.getApp())
          .post('/api/v1/users/login')
          .send(mockUser)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(400);
            expect(res.body.message).to.include('Invalid Password');
            done();
          });
      });
    
  });

});
