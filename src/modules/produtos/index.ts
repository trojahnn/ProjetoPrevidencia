import Repository from '../../globals/repositories/knex/produtos';
import ProductModule from './service';

const ProductRepository = new Repository();
const Product = new ProductModule(ProductRepository);

export default Product;
