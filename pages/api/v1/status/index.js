import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  try {
    // Informações sobre a base de dados PostgreSQL
    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;

    const databaseOpenedConnectionsResult = await database.query(
      "SELECT count(*)::int FROM pg_stat_activity WHERE datname = '" +
        databaseName +
        "';",
    );
    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].count;

    const activeQueriesResult = await database.query(
      "SELECT count(*)::int FROM pg_stat_activity WHERE state = 'active';",
    );
    const activeQueriesCount = activeQueriesResult.rows[0].count;

    // Calcula o tempo médio de execução das consultas ativas
    const avgQueryDurationResult = await calculateAvgQueryDuration(database);
    const avgQueryDuration = avgQueryDurationResult;

    const databaseSizeResult = await database.query(
      "SELECT pg_size_pretty(pg_database_size('" +
        databaseName +
        "')) AS size;",
    );
    const databaseSize = databaseSizeResult.rows[0].size;

    const indexCountResult = await database.query(
      "SELECT count(*) AS index_count FROM pg_indexes WHERE schemaname = 'public';",
    );
    const indexCount = indexCountResult.rows[0].index_count;

    const uptimeResult = await database.query(
      "SELECT now() - pg_postmaster_start_time() AS uptime;",
    );
    const uptime = uptimeResult.rows[0].uptime;

    const tableCountResult = await database.query(
      "SELECT count(*) AS table_count FROM information_schema.tables WHERE table_schema = 'public';",
    );
    const tableCount = tableCountResult.rows[0].table_count;

    const connectionsByUserResult = await database.query(
      "SELECT usename, count(*) AS connection_count FROM pg_stat_activity GROUP BY usename;",
    );
    const connectionsByUser = connectionsByUserResult.rows;

    const pgVersionResult = await database.query("SHOW server_version_num;");
    const pgVersion = pgVersionResult.rows[0].server_version_num;

    const activeTransactionsResult = await database.query(
      "SELECT count(*) AS active_transactions FROM pg_locks WHERE granted = true;",
    );
    const activeTransactions =
      activeTransactionsResult.rows[0].active_transactions;

    const connectionsByStateResult = await database.query(
      "SELECT state, count(*) AS connection_count FROM pg_stat_activity GROUP BY state;",
    );
    const connectionsByState = connectionsByStateResult.rows;

    const activeLocksResult = await database.query(
      "SELECT count(*) AS active_locks FROM pg_locks WHERE granted = true;",
    );
    const activeLocks = activeLocksResult.rows[0].active_locks;

    // Resposta JSON com todas as informações coletadas
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
          active_queries: activeQueriesCount,
          avg_query_duration: avgQueryDuration,
          database_size: databaseSize,
          index_count: indexCount,
          uptime: uptime,
          table_count: tableCount,
          connections_by_user: connectionsByUser,
          pg_version: pgVersion,
          active_transactions: activeTransactions,
          connections_by_state: connectionsByState,
          active_locks: activeLocks,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao obter status do banco de dados:", error);
    response
      .status(500)
      .json({ error: "Erro ao obter status do banco de dados" });
  }
}

async function calculateAvgQueryDuration(database) {
  // Implementação alternativa para calcular o tempo médio de execução das consultas ativas
  const activeQueriesResult = await database.query(
    "SELECT query_start, now() AS current_time FROM pg_stat_activity WHERE state = 'active';",
  );

  let totalQueryTime = 0;
  activeQueriesResult.rows.forEach((row) => {
    const queryStart = new Date(row.query_start);
    const currentTime = new Date(row.current_time);
    const queryDuration = currentTime - queryStart;
    totalQueryTime += queryDuration;
  });

  const avgQueryCount = activeQueriesResult.rows.length;
  const avgQueryDuration =
    avgQueryCount > 0 ? totalQueryTime / avgQueryCount : 0;

  return avgQueryDuration;
}

export default status;
