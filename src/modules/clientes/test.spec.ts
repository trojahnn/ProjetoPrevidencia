import { it, expect } from "vitest";
import Client from ".";
import moment from "moment";

it("Test create a client", async() => {
    const result = await Client.create({
        nome: "Teste",
        email: "henrique@trojahn.com.br",
        cpf: "12345678901",
        dataDeNascimento: moment("1990-01-01 00:00:00").toDate(),
        genero: "Masculino",
        rendaMensal: 1000,

    });

    expect(result).toEqual({ id: result.id });
});