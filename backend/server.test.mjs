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

  it("translates a valid HTTP request", async () => {
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    server = createTranslationBackendServer({ service });
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: " huis ",
        sourceLanguage: " NL ",
        targetLanguage: " EN ",
        context: "selection",
      }),
    });

    await expect(response.json()).resolves.toEqual({
      translatedText: "house",
    });
    expect(response.status).toBe(200);
    expect(service.translate).toHaveBeenCalledWith({
      text: "huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    });
  });

  it("rejects invalid translation requests before calling the service", async () => {
    const service = {
      translate: vi.fn(),
    };

    server = createTranslationBackendServer({ service });
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    });

    await expect(response.json()).resolves.toEqual({
      error: "text is required",
    });
    expect(response.status).toBe(400);
    expect(service.translate).not.toHaveBeenCalled();
  });

  it("rejects oversized translation requests before calling the service", async () => {
    const service = {
      translate: vi.fn(),
    };

    server = createTranslationBackendServer({ service });
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "a".repeat(11 * 1024),
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "selection",
      }),
    });

    await expect(response.json()).resolves.toEqual({
      error: "Request body is too large",
    });
    expect(response.status).toBe(400);
    expect(service.translate).not.toHaveBeenCalled();
  });

  it("rate limits repeated translation requests from the same client", async () => {
    let currentTime = 1000;
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    server = createTranslationBackendServer({
      service,
      rateLimit: {
        maxRequests: 2,
        windowMs: 60_000,
        now: () => currentTime,
      },
    });
    const baseUrl = await listen(server);

    await expect(postTranslate(baseUrl)).resolves.toMatchObject({ status: 200 });
    await expect(postTranslate(baseUrl)).resolves.toMatchObject({ status: 200 });

    const limitedResponse = await postTranslate(baseUrl);

    await expect(limitedResponse.json()).resolves.toEqual({
      error: "Too many translation requests. Try again soon.",
    });
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("retry-after")).toBe("60");
    expect(service.translate).toHaveBeenCalledTimes(2);

    currentTime += 60_000;

    await expect(postTranslate(baseUrl)).resolves.toMatchObject({ status: 200 });
    expect(service.translate).toHaveBeenCalledTimes(3);
  });

  it("does not count health checks against the translation rate limit", async () => {
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    server = createTranslationBackendServer({
      service,
      rateLimit: {
        maxRequests: 1,
        windowMs: 60_000,
      },
    });
    const baseUrl = await listen(server);

    await fetch(`${baseUrl}/health`);
    await fetch(`${baseUrl}/health`);

    await expect(postTranslate(baseUrl)).resolves.toMatchObject({ status: 200 });
    expect(service.translate).toHaveBeenCalledTimes(1);
  });

  it("returns a clear 404 for unknown routes", async () => {
    const service = {
      translate: vi.fn(),
    };

    server = createTranslationBackendServer({ service });
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/unknown`);

    await expect(response.json()).resolves.toEqual({
      error: "Use POST /translate",
    });
    expect(response.status).toBe(404);
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

function postTranslate(baseUrl) {
  return fetch(`${baseUrl}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": "203.0.113.10",
    },
    body: JSON.stringify({
      text: "huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    }),
  });
}
