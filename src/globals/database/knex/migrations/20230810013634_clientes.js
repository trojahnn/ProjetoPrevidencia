exports.up = knex => knex.schema.createTable('tb_clientes', table => {
    table.varchar('id').primary();
    table.varchar('nome');
    table.varchar('email');
    table.varchar('cpf');
    table.datetime('dataDeNascimento');
    table.varchar('genero');
    table.decimal('rendaMensal');
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('tb_clientes');