exports.up = knex => knex.schema.createTable('tb_planos', table => {
    table.varchar('id').primary();
    table.uuid('idCliente').references('id').inTable('tb_clientes');
    table.uuid('idProduto').references('id').inTable('tb_produtos');
    table.decimal('aporte');
    table.datetime('dataDaContratacao');
    table.integer('idadeDeAposentadoria');
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('tb_planos');