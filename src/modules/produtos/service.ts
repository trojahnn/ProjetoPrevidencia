import { IProduct, IProductRepository, ISignature, ITransaction } from "./interfaces";

class ProductModule {
	constructor(private repository: IProductRepository) {}

	public async create(Product: IProduct): Promise<{ id: string }> {
		return await this.repository.create(Product);
	}

	public async signature(Contract: ISignature): Promise<{ id: string }> {
		return await this.repository.signature(Contract);
	}

	public async withdraw(Transaction: ITransaction): Promise<{ id: string }> {
		return await this.repository.withdraw(Transaction);
	}

	public async deposit(Transaction: ITransaction): Promise<{ id: string }> {
		return await this.repository.deposit(Transaction);
	}
}

export default ProductModule;