import express from 'express';
import ClientController from './controller';

const ClientRouter = express.Router();

ClientRouter.post('/', ClientController.create);

export default ClientRouter;