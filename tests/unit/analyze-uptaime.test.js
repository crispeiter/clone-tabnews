import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();

  // Verifica o campo uptime dentro de database
  expect(responseBody.dependencies.database.uptime).toBeDefined();
  expect(typeof responseBody.dependencies.database.uptime).toBe("object");
  expect(
    () => new Date(responseBody.dependencies.database.uptime),
  ).not.toThrow();
});
