import { v4 as uuidv4 } from 'uuid';
import connection from "../../database/knex/knex";
import { IProduct, IProductRepository, ISignature, ITransaction } from '../../../modules/produtos/interfaces';
import moment from 'moment';

export default class Repository implements IProductRepository {
  
	async create(Product: IProduct): Promise<{ id: string }> {
		const id = uuidv4();
		
		await connection(`tb_produtos`).insert({ ...Product, id });

		return { id };
	}

	async signature(Contract: ISignature): Promise<{ id: string }> {
		const id = uuidv4();
		const cliente = await connection('tb_clientes').select('*').where('id', Contract.idCliente);
		const produto = await connection('tb_produtos').select('*').where('id', Contract.idProduto);
		
		if(!cliente.length) throw new Error("Cliente não encontrado.");
		if(!produto.length) throw new Error("Produto não encontrado.");
		
		if(moment().isSameOrAfter(produto[0].expiracaoDeVenda)) throw new Error("Este produto não está mais disponível.");
		
		if(Contract.aporte < produto[0].valorMinimoAporteInicial) throw new Error("O valor do aporte é menor que o valor mínimo permitido.");

		if(moment().diff(cliente[0].dataDeNascimento, 'years') < produto[0].idadeDeEntrada) throw new Error("O cliente não tem a idade mínima para este produto.");

		await connection(`tb_planos`).insert({ ...Contract, id });

		return { id };
	}

	async withdraw(Transaction: ITransaction): Promise<{ id: string }> {
		const id = uuidv4();
		const contract = await connection('tb_planos').select('*').where('id', Transaction.idPlano);
		const produto = await connection('tb_produtos').select('*').where('id', contract[0].idProduto);
		const lastWithdraw = await connection('tb_movimentacoes').select('*').where('idPlano', Transaction.idPlano).orderBy('data', 'desc').limit(1);
		const totalWithdraw = await connection('tb_movimentacoes').select('*').where('idPlano', Transaction.idPlano).sum('valor as total');
		const total = contract[0].aporte + totalWithdraw[0].total;

		if(!lastWithdraw.length){
			if(moment().diff(contract[0].dataDaContratacao, 'days') < produto[0].carenciaInicialDeResgate) throw new Error("Saque não permitido, pois o plano ainda está em carência.");
		} else {
			if(moment().diff(lastWithdraw[0].data, 'days') < produto[0].carenciaEntreResgates) throw new Error("Saque não permitido, pois o plano ainda está em carência.");
		}

		if(total < Transaction.valor) throw new Error(`O valor disponível para saque é de R$ ${total}.`);
		
		Transaction.data = Transaction?.data || new Date();
		Transaction.valor = Transaction.valor * -1;

		await connection(`tb_movimentacoes`).insert({ ...Transaction, id });

		return { id };
	}

	async deposit(Transaction: ITransaction): Promise<{ id: string }> {
		const id = uuidv4();
		const contract = await connection('tb_planos').select('*').where('id', Transaction.idPlano);
		const produto = await connection('tb_produtos').select('*').where('id', contract[0].idProduto);
		const totalWithdraw = await connection('tb_movimentacoes').select('*').where('idPlano', Transaction.idPlano).sum('valor as total');
		const total = contract[0].aporte + totalWithdraw[0].total;

		if(total === 0) throw new Error(`O plano selecionado não está mais disponível.`);

		if(Transaction.valor < produto[0].valorMinimoAporteExtra) throw new Error("O valor do aporte é menor que o valor mínimo permitido.");
		
		await connection(`tb_movimentacoes`).insert({ ...Transaction, id });

		return { id };
	}
}