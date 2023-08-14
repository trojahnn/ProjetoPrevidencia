exports.up = knex => knex.schema.createTable('tb_produtos', table => {
    table.varchar('id').primary();
    table.varchar('nome');
    table.varchar('susep');
    table.datetime('expiracaoDeVenda');
    table.decimal('valorMinimoAporteInicial');
    table.decimal('valorMinimoAporteExtra');
    table.integer('idadeDeEntrada');
    table.integer('idadeDeSaida');
    table.integer('carenciaInicialDeResgate');
    table.integer('carenciaEntreResgates');
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('tb_produtos');