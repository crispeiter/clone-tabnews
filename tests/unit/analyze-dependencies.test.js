import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();

  // Verifica se o campo dependencies está presente e é um objeto
  expect(responseBody.dependencies).toBeDefined();
  expect(typeof responseBody.dependencies).toBe("object");
});
