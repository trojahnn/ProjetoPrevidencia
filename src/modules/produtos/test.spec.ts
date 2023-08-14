import { it, expect, describe } from "vitest";
import moment from "moment";
import ProductModule from ".";
import Client from "../clientes";
import { IProduct } from "./interfaces";
import { IClient } from "../clientes/service";

const productModel: IProduct = {
    nome: "Teste",
    susep: "12345678901",
    expiracaoDeVenda: moment("2023-12-01 00:00:00").toDate(),
    valorMinimoAporteInicial: 1000,
    valorMinimoAporteExtra: 1000,
    idadeDeEntrada: 18,
    idadeDeSaida: 65,
    carenciaInicialDeResgate: 60,
    carenciaEntreResgates: 60,
}

const clientModel: IClient = {
    nome: "Teste",
    email: "henrique@trojahn.com.br",
    cpf: "12345678901",
    dataDeNascimento: moment("2000-01-01 00:00:00").toDate(),
    genero: "Masculino",
    rendaMensal: 1000
};

describe('Test product module with success cases.', () => {

    let product;
    it("Test create a product.", async() => {
        product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });
    });

    let plan;
    it("Test signature a product.", async() => {
        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: 1000,
            dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });

        expect(plan).toEqual({ id: plan.id });
    });

    it("Test deposit", async() => {
        const result = await ProductModule.deposit({
            idCliente: plan.idCliente,
            idPlano: plan.id,
            valor: 1000,
            data: moment("2023-06-01 00:00:00").toDate(),
        });

        expect(result).toEqual({ id: result.id });
    });

    it("Test withdraw", async() => {
        const result = await ProductModule.withdraw({
            idCliente: plan.idCliente,
            idPlano: plan.id,
            valor: 1000,
        });

        expect(result).toEqual({ id: result.id });
    });
});


describe('Test product module with fail cases.', () => {

    it("Test signature a product with client id not exists.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const failSignature = async () => {
            await ProductModule.signature({
                idCliente: "a5423628-0dd7-44ed-b23e-xxxxxxxxxxx",
                idProduto: product.id,
                aporte: 1000,
                dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
                idadeDeAposentadoria: 65,
            });
        }

        await expect(failSignature).rejects.toThrow(new Error('Cliente não encontrado.'));
    });

    it("Test signature a product with product id not exists.", async() => {
        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const failSignature = async () => {
            await ProductModule.signature({
                idCliente: insertClient.id,
                idProduto: "a5423628-0dd7-44ed-b23e-xxxxxxxxxxx",
                aporte: 1000,
                dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
                idadeDeAposentadoria: 65,
            });
        }

        await expect(failSignature).rejects.toThrow(new Error('Produto não encontrado.'));
    });

    it("Test signature a expired product.", async() => {
        const product = await ProductModule.create({ ...productModel, expiracaoDeVenda: moment("2021-12-01 00:00:00").toDate() });
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const failSignature = async () => {
            await ProductModule.signature({
                idCliente: insertClient.id,
                idProduto: product.id,
                aporte: 1000,
                dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
                idadeDeAposentadoria: 65,
            });
        }

        await expect(failSignature).rejects.toThrow(new Error('Este produto não está mais disponível.'));
    });

    it("Test signature with a minimal deposit.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const failSignature = async () => {
            await ProductModule.signature({
                idCliente: insertClient.id,
                idProduto: product.id,
                aporte: 500,
                dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
                idadeDeAposentadoria: 65,
            });
        }

        await expect(failSignature).rejects.toThrow(new Error('O valor do aporte é menor que o valor mínimo permitido.'));
    });

    it("Test signature with a minimal age.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create({ ...clientModel, dataDeNascimento: moment("2023-01-01 00:00:00").toDate() });
        expect(insertClient).toEqual({ id: insertClient.id });

        const failSignature = async () => {
            await ProductModule.signature({
                idCliente: insertClient.id,
                idProduto: product.id,
                aporte: 1000,
                dataDaContratacao: moment("2023-05-01 00:00:00").toDate(),
                idadeDeAposentadoria: 65,
            });
        }

        await expect(failSignature).rejects.toThrow(new Error('O cliente não tem a idade mínima para este produto.'));
    });

    it("Test a withdraw out of date.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: 1000,
            dataDaContratacao: moment("2023-08-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });

        expect(plan).toEqual({ id: plan.id });

        const failWithdraw = async () => {
            await ProductModule.withdraw({
                idCliente: insertClient.id,
                idPlano: plan.id,
                valor: 1000,
            });
        }

        await expect(failWithdraw).rejects.toThrow(new Error('Saque não permitido, pois o plano ainda está em carência.'));
    });

    it("Test a withdraw is not enabled if last withdraw is out of date.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: 1000,
            dataDaContratacao: moment("2023-06-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });

        expect(plan).toEqual({ id: plan.id });

        const successWithdraw = await ProductModule.withdraw({
            idCliente: insertClient.id,
            idPlano: plan.id,
            valor: 500,
            data: moment("2023-08-01 00:00:00").toDate(),
        });

        await expect(successWithdraw).toEqual({ id: successWithdraw.id });

        const failWithdraw = async () => {
            await ProductModule.withdraw({
                idCliente: insertClient.id,
                idPlano: plan.id,
                valor: 500,
            });
        }

        await expect(failWithdraw).rejects.toThrow(new Error('Saque não permitido, pois o plano ainda está em carência.'));
    });

    it("Test a withdraw out of value.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const money = 1000;
        const plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: money,
            dataDaContratacao: moment("2023-06-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });

        expect(plan).toEqual({ id: plan.id });

        const failWithdraw = async () => {
            await ProductModule.withdraw({
                idCliente: insertClient.id,
                idPlano: plan.id,
                valor: 1500,
            });
        }

        await expect(failWithdraw).rejects.toThrow(new Error(`O valor disponível para saque é de R$ ${money}.`));
    });

    it("Test a deposit out of value.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const money = 1000;
        const plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: money,
            dataDaContratacao: moment("2023-06-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });

        expect(plan).toEqual({ id: plan.id });

        const failDeposit = async () => {
            await ProductModule.deposit({
                idCliente: insertClient.id,
                idPlano: plan.id,
                valor: 10,
            });
        }

        await expect(failDeposit).rejects.toThrow(new Error(`O valor do aporte é menor que o valor mínimo permitido.`));
    });

    it("Test canceled a plan.", async() => {
        const product = await ProductModule.create(productModel);
        expect(product).toEqual({ id: product.id });

        const insertClient = await Client.create(clientModel);
        expect(insertClient).toEqual({ id: insertClient.id });

        const money = 1000;
        const plan = await ProductModule.signature({
            idCliente: insertClient.id,
            idProduto: product.id,
            aporte: money,
            dataDaContratacao: moment("2023-06-01 00:00:00").toDate(),
            idadeDeAposentadoria: 65,
        });
        
        expect(plan).toEqual({ id: plan.id });

        const successWithdraw = await ProductModule.withdraw({
            idPlano: plan.id,
            valor: 1000,
            data: moment("2023-08-01 00:00:00").toDate(),
        });

        await expect(successWithdraw).toEqual({ id: successWithdraw.id });

        const failDeposit = async () => {
            await ProductModule.deposit({
                idCliente: insertClient.id,
                idPlano: plan.id,
                valor: 1000,
            });
        }

        await expect(failDeposit).rejects.toThrow(new Error(`O plano selecionado não está mais disponível.`));
    });
});