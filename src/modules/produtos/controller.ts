import Product from ".";
import { Request, Response } from 'express';

class ProductController {
	public async create(request: Request, response: Response): Promise<any>{
		const { body } = request;
		const { id } = await Product.create(body);
		
		return response.status(201).send({ id });
	}

	public async signature(request: Request, response: Response): Promise<any>{
		const { body } = request;
		const { id } = await Product.signature(body);
		
		return response.status(201).send({ id });
	}

	public async withdraw(request: Request, response: Response): Promise<any>{
		const { body } = request;
		const { id } = await Product.withdraw({ idPlano: body.idPlano, valor: body.valorResgate });
		
		return response.status(201).send({ id });
	}

	public async deposit(request: Request, response: Response): Promise<any>{
		const { body } = request;
		const { id } = await Product.deposit({ idCliente: body.idCliente, idPlano: body.idPlano, valor: body.valorAporte });
		
		return response.status(201).send({ id });
	}
}

export default new ProductController();