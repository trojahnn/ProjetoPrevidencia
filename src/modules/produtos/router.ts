import express from 'express';
import ProductController from './controller';

const ProductRouter = express.Router();

ProductRouter.post('/', ProductController.create);
ProductRouter.post('/assinar', ProductController.signature);
ProductRouter.post('/depositar', ProductController.deposit);
ProductRouter.post('/sacar', ProductController.withdraw);

export default ProductRouter;