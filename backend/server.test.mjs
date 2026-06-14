import { afterEach, describe, expect, it, vi } from "vitest";
import { createTranslationBackendServer } from "./server.mjs";

let server;

afterEach(async () => {
  if (!server) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  server = undefined;
});

describe("createTranslationBackendServer", () => {
  it("returns a health response without calling the translation service", async () => {
    const service = {
      translate: vi.fn(),
    };

    server = createTranslationBackendServer({ service });
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/health`);

    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: "dutchmate-backend",
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(service.translate).not.toHaveBeenCalled();
  });
});

async function listen(server) {
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Server address is unavailable");
  }

  return `http://127.0.0.1:${address.port}`;
}
