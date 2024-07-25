import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();
  // Verifica se o campo updated_at está presente e é uma string no formato ISO
  expect(responseBody.updated_at).toBeDefined();
  expect(typeof responseBody.updated_at).toBe("string");
  expect(() => new Date(responseBody.updated_at)).not.toThrow();
});
