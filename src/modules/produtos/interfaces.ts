interface IProduct {
	id?: string;
	nome: string;
	susep: string;
	expiracaoDeVenda: Date;
	valorMinimoAporteInicial: number;
	valorMinimoAporteExtra: number;
	idadeDeEntrada: number;
	idadeDeSaida: number;
	carenciaInicialDeResgate: number;
	carenciaEntreResgates: number;
}

interface ISignature {
	idCliente: string;
	idProduto: string;
	aporte: number;
	dataDaContratacao: Date;
	idadeDeAposentadoria: number;
}

interface ITransaction {
	idCliente?: string;
	idPlano: string;
	valor: number;
	data?: Date;
}

interface IProductRepository {
	create(Product: IProduct): Promise<{ id: string }>;
	signature(Product: ISignature): Promise<{ id: string }>;
	withdraw(Transaction: ITransaction): Promise<{ id: string }>;
	deposit(Transaction: ITransaction): Promise<{ id: string }>;
}

export { IProduct, IProductRepository, ISignature, ITransaction };