import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserService from '../../src/services/user.service';
import NotesService from '../../src/services/note.service';
import { IUser } from '../../src/interfaces/user.interface';
import { Inote } from '../../src/interfaces/note.interface';

dotenv.config();

describe('User and Notes Service Tests', () => {
  let userService: UserService;
  let notesService: NotesService;
  let createdNoteId: string;
  let mockUser: Partial<IUser>;
  let mockNote: Partial<Inote>;

  before(async () => {
    userService = new UserService();
    notesService = new NotesService();

    if (!process.env.DATABASE_TEST) {
      throw new Error('DATABASE_TEST environment variable is not defined.');
    }

    const clearCollections = async () => {
      for (const collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteMany({});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      await clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      await mongooseConnect();
    } else {
      await clearCollections();
    }
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('User Service', () => {
    beforeEach(async () => {
      // Reset the mock user before each test if needed
      mockUser = {
        Firstname: 'John',
        Lastname: 'Doe',
        Email: 'john.doe@example.com',
        Password: 'password123',
      };
    });

    describe('Register User', () => {
      it('should throw an error if the email already exists', async () => {
        const result = await userService.newUser(mockUser as IUser);
        expect(result).to.be.an('object');
        expect(result.Email).to.equal(mockUser.Email);

        try {
          await userService.newUser(mockUser as IUser);
        } catch (error: any) {
          expect(error.message).to.equal('Email Id is Already Exists');
        }
      });
    });

    describe('Login User', () => {
      it('should log in the user with correct credentials', async () => {
        const loginUser = {
          Email: mockUser.Email,
          Password: mockUser.Password,
        };
    
        const result = await userService.loginUser(loginUser);
        expect(result).to.be.an('array').with.lengthOf(3);
        expect(result[0]).to.be.a('string'); // Token
        expect(result[1]).to.equal(mockUser.Firstname); // First name
        expect(result[2]).to.equal(mockUser.Lastname); // Last name
      });
    
      it('should throw an error for incorrect password', async () => {
        const loginUser = {
          Email: mockUser.Email,
          Password: 'wrongpassword', // Incorrect password
        };
    
        try {
          await userService.loginUser(loginUser);
        } catch (error: any) {
          expect(error.message).to.equal('Invalid Password'); // General error message
        }
      });
    
      it('should throw an error for non-existent user', async () => {
        const loginUser = {
          Email: 'nonexistent@example.com',
          Password: 'password123',
        };
    
        try {
          await userService.loginUser(loginUser);
        } catch (error: any) {
          expect(error.message).to.equal('No user exists'); // General error message
        }
      });
    });
  });

  describe('Notes Service', () => {
    beforeEach(() => {
      // Set up the mock note before each test
      mockNote = {
        title: 'Test Note',
        description: 'This is a test note description.',
        createdBy: new mongoose.Types.ObjectId().toString(),
      };
    });

    describe('Create Note', () => {
      it('should create a note successfully', async () => {
        const createdNote = await notesService.createNote(mockNote as Inote);
        expect(createdNote).to.be.an('object');
        expect(createdNote.title).to.equal(mockNote.title);
        expect(createdNote.description).to.equal(mockNote.description);
        expect(createdNote).to.have.property('_id');
        createdNoteId = createdNote._id;
      });
    });

    describe('Get All Notes', () => {
      it('should retrieve all notes for the user', async () => {
        const notes = await notesService.getAllNotes({ createdBy: mockNote.createdBy } as Inote);
        expect(notes).to.be.an('array');
      });
    });

    describe('Get Note by ID', () => {
      it('should retrieve a note by ID', async () => {
        const note = await notesService.getNote(createdNoteId);
        expect(note).to.be.an('object');
      });

      it('should return null for a non-existent note', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const note = await notesService.getNote(nonExistentId.toString());
        expect(note).to.be.null;
      });
    });

    describe('Update Note', () => {
      it('should update a note successfully', async () => {
        const updatedData: Partial<Inote> = {
          title: 'Updated Test Note',
          description: 'This is the updated description.',
        };

        const updatedNote = await notesService.updateNote(createdNoteId, updatedData);
        expect(updatedNote).to.be.an('object');
        expect(updatedNote.title).to.equal(updatedData.title);
        expect(updatedNote.description).to.equal(updatedData.description);
      });

      it('should throw an error for a non-existent note ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        try {
          await notesService.updateNote(nonExistentId.toString(), { title: 'New Title' });
        } catch (error: any) {
          expect(error.message).to.equal('Note not found');
        }
      });
    });

    describe('Delete Note', () => {
      it('should delete a note successfully', async () => {
        const deletedNote = await notesService.deleteNote(createdNoteId);
        expect(deletedNote).to.be.an('object');
        expect(deletedNote.isTrash).to.be.true; // Assuming 'isTrash' indicates a successful soft delete
      });

      it('should throw an error for a non-existent note ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        try {
          await notesService.deleteNote(nonExistentId.toString());
        } catch (error: any) {
          expect(error.message).to.equal('Note not found');
        }
      });
    });

    describe('Trash Note', () => {
      it('should trash a note successfully', async () => {
        const trashedNote = await notesService.trash(createdNoteId);
        expect(trashedNote).to.be.an('object'); 
    });

    it('should throw an error for a non-existent note ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); 
        try {
            await notesService.trash(nonExistentId.toString());
        } catch (error: any) {
            expect(error.message).to.equal('Note not found'); 
        }
    });

    it('should throw an error if note ID is not provided', async () => {
        try {
            await notesService.trash(''); 
        } catch (error: any) {
            expect(error.message).to.equal('note id is required'); 
        }
    });
});

    describe('Archive Note', () => {
      it('should archive a note successfully', async () => {
        const archivedNote = await notesService.archive(createdNoteId);
        expect(archivedNote).to.be.an('object');
        expect(archivedNote.isArchive).to.be.true; 
      });

      it('should throw an error for a non-existent note ID during archive', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        try {
          await notesService.archive(nonExistentId.toString());
        } catch (error: any) {
          expect(error.message).to.equal('Note not found');
        }
      });
    });

    describe('View Archived Notes', () => {
      it('should retrieve archived notes', async () => {
        const archivedNotes = await notesService.viewArchive({ createdBy: mockNote.createdBy } as Inote);
        expect(archivedNotes).to.be.an('array');
      });
    });

    describe('View Trashed Notes', () => {
      it('should retrieve trashed notes', async () => {
        const trashedNotes = await notesService.viewTrash({ createdBy: mockNote.createdBy } as Inote);
        expect(trashedNotes).to.be.an('array');
      });
    });

    describe('Permanently Delete Note', () => {
      it('should permanently delete a trashed note', async () => {
        const deleteResult = await notesService.pemanentlyDelete(createdNoteId);
        expect(deleteResult).to.be.an('object');
        
    });

      it('should throw an error for a non-existent note ID during permanent deletion', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        try {
          await notesService.pemanentlyDelete(nonExistentId.toString());
        } catch (error: any) {
          expect(error.message).to.equal('Note not found');
        }
      });
    });
  });
});
