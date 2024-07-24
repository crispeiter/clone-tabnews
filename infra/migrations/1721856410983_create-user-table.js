/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"), // Valor padrão gerado automaticamente
      notNull: true,
      primaryKey: true,
    },
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    features: {
      type: "varchar[]",
      notNull: true,
      default: `{}`,
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  // Inserir dados de exemplo para 12 usuários
  pgm.sql(`
    INSERT INTO users (username, email, password)
    VALUES
      ('alice', 'alice@example.com', 'senha123'),
      ('bob', 'bob@example.com', 'senha456'),
      ('charlie', 'charlie@example.com', 'senha789'),
      ('david', 'david@example.com', 'senhaabc'),
      ('emma', 'emma@example.com', 'senhaxyz'),
      ('frank', 'frank@example.com', 'senha123'),
      ('gina', 'gina@example.com', 'senha456'),
      ('hugo', 'hugo@example.com', 'senha789'),
      ('isabel', 'isabel@example.com', 'senhaabc'),
      ('javier', 'javier@example.com', 'senhaxyz'),
      ('kate', 'kate@example.com', 'senha123'),
      ('lucas', 'lucas@example.com', 'senha456');
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
