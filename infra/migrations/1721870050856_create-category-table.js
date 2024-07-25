/* eslint-disable camelcase */

exports.up = (pgm) => {
  // Criação da tabela categoria
  pgm.createTable("categoria", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
      notNull: true,
    },
    observacao: {
      type: "varchar(255)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  // Reverter a criação da tabela categoria
  pgm.dropTable("categoria");
};
