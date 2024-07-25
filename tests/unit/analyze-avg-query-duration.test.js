import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();

  // Verifica o campo avg_query_duration dentro de database
  expect(responseBody.dependencies.database.avg_query_duration).toBeDefined();
  expect(typeof responseBody.dependencies.database.avg_query_duration).toBe(
    "number",
  );
});
