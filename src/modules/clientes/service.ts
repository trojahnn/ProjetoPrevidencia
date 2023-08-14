interface IClient {
	id?: string;
	nome: string;
	email: string;
	cpf: string;
	dataDeNascimento: Date;
	genero: string;
	rendaMensal: number;
}

interface IClientRepository {
	create(client: IClient): Promise<{ id: string }>;
}

class ClientModule {
	constructor(private repository: IClientRepository) {}

	public async create(client: IClient): Promise<{ id: string }> {
		return await this.repository.create(client);
	}
}

export { IClient, IClientRepository, ClientModule };