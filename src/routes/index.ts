import express, { IRouter } from 'express';
const router = express.Router();
import NoteRoutes from './note.route'; 
import UserRoutes from './user.route'; 
import  swaggerUI from 'swagger-ui-express'
import swaggerDocument from '../swagger/openApi.json'
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/home', (req, res) => {
    res.json('Welcome to the FundoNotes');
  });
  router.use('/notes',new NoteRoutes().getRoutes())
  router.use('/users', new UserRoutes().getRoutes());
  router.use('/api-doc',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
  return router;
};

export default routes;
