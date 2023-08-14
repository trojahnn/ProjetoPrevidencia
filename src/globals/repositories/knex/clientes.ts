import { v4 as uuidv4 } from 'uuid';
import connection from "../../database/knex/knex";
import { IClient, IClientRepository } from "../../../modules/clientes/service";

export default class Repository implements IClientRepository {
  
	async create(client: IClient): Promise<{ id: string }> {
		const id = uuidv4();
		
		await connection(`tb_clientes`).insert({ ...client, id });

		return { id };
	}
}