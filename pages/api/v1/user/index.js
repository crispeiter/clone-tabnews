import database from "infra/database.js";

async function statusUsers(request, response) {
  const updatedAt = new Date().toISOString();

  // Consulta para contar o número total de usuários na tabela 'users'
  const countUsersResult = await database.query("SELECT COUNT(*) FROM users;");
  const countUsersValue = countUsersResult.rows[0].count;

  // Consulta para encontrar o usuário mais recentemente registrado
  const latestUserResult = await database.query(
    "SELECT * FROM users ORDER BY created_at DESC LIMIT 1;",
  );
  const latestUser = latestUserResult.rows[0];

  response.status(200).json({
    updated_at: updatedAt,
    users: {
      total_count: parseInt(countUsersValue),
      latest_user: latestUser,
    },
  });
}

export default statusUsers;
