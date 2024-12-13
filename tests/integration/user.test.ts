import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

describe('User and Note APIs Test', () => {
  let userToken: string;
  let createdNoteId: string;

  before(async () => {
    const clearCollections = async () => {
      for (const collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteMany({});
      }
    };

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_TEST);
      await clearCollections();
    } else {
      await clearCollections();
    }
  });

  const mockUser = {
    Firstname: 'John',
    Lastname: 'Doe',
    Email: 'john.doe@example.com',
    Password: 'password123'
  };

  describe('User registration', () => {
    it('should create a new user with hashed password', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/register')
        .send(mockUser);

      expect(res.statusCode).to.be.equal(201);
      expect(res.body.message).to.equal(`${mockUser.Firstname} ${mockUser.Lastname} registered Successfully!`);
    });

    it('should return an error if the email already exists', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/register')
        .send(mockUser);

      expect(res.statusCode).to.be.equal(400);
      expect(res.body.message).to.include('Email ID already exists');
    });

    describe('User Login', () => {
      it('should log in the user successfully', async () => {
        const loginDetails = {
          Email: mockUser.Email,
          Password: mockUser.Password
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(loginDetails);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.token).to.be.a('string');
        expect(res.body.message).to.equal(`${mockUser.Firstname} ${mockUser.Lastname} login Successful!`);
        userToken = res.body.token;
      });

      it('should return error if user does not exist', async () => {
        const invalidUser = {
          Email: 'nonexistent.email@example.com',
          Password: 'somepassword'
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(invalidUser);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.message).to.include('No user exists');
      });

      it('should return error for incorrect password', async () => {
        const invalidPasswordUser = {
          Email: mockUser.Email,
          Password: 'wrongpassword'
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(invalidPasswordUser);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.message).to.include('Invalid Password');
      });
    });
  });

  describe('Note APIs', () => {
    it('should create a new note successfully', async () => {
      const mockNote = {
        title: 'Sample Note',
        description: 'This is a sample note.'
      };
      const res = await request(app.getApp())
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockNote);

      expect(res.statusCode).to.equal(201);
      expect(res.body.message).to.equal('note created successfully');
      expect(res.body.data).to.have.property('_id');
      createdNoteId = res.body.data._id;
    });

    it('should retrieve all notes for the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body.data).to.be.an('array');
    });

    it('should retrieve a note by ID', async () => {
      const res = await request(app.getApp())
        .get(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body.data).to.have.property('_id', createdNoteId);
    });

    it('should update a note successfully', async () => {
      const updatedNote = {
        title: 'Updated Sample Note',
        description: 'This is an updated note.'
      };
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNote);

      expect(res.statusCode).to.be.equal(200);
      expect(res.body.message).to.equal('Note updated successfully');
      expect(res.body.data).to.have.property('title', updatedNote.title);
    });

    it('should archive or unarchive the note', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}/archive`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.body.message).to.equal('Note moved to the Archive successfully');  
      const note = res.body.data;
      expect(note.isArchive).to.be.a('boolean');
    });
    it('should move note to trash', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}/trash`) 
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Note moved to the Trash successfully');  
    });
    
    it('should permanently delete a note', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}/delete`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('deleted successfully');
    });
  });
});
