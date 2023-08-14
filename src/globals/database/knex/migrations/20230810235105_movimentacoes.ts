exports.up = knex => knex.schema.createTable('tb_movimentacoes', table => {
    table.varchar('id').primary();
    table.uuid('idCliente').references('id').inTable('tb_clientes');
    table.uuid('idPlano').references('id').inTable('tb_planos');
    table.decimal('valor');
    table.datetime('data');
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('tb_movimentacoes');