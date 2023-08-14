import Client from ".";
import { Request, Response } from 'express';

class ClientController {
	public async create(request: Request, response: Response): Promise<any>{
		const { body } = request;
		const { id } = await Client.create(body);
		
		return response.status(201).send({ id });
	}
}

export default new ClientController();