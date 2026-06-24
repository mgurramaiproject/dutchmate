import { Readable } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { ProviderError } from "./provider-error.mjs";
import { createTranslationBackendServer } from "./server.mjs";

describe("createTranslationBackendServer", () => {
  it("returns a health response without calling the translation service", async () => {
    const service = {
      translate: vi.fn(),
    };

    const server = createTranslationBackendServer({ service, logger: createTestLogger() });
    const response = await inject(server, {
      method: "GET",
      url: "/health",
    });

    const body = await response.json();

    expect(body).toMatchObject({
      ok: true,
      service: "dutchmate-backend",
      runtime: {
        lastTranslateAt: null,
        translateRequestsAcceptedTotal: 0,
        requestedTextCharactersTotal: 0,
        translateSuccessTotal: 0,
        translateFailureTotal: 0,
        badRequestTotal: 0,
        clientRateLimitedTotal: 0,
        providerErrorTotal: 0,
        providerRateLimitedTotal: 0,
        byContext: {
          hover: 0,
          selection: 0,
        },
      },
    });
    expect(typeof body.runtime.startedAt).toBe("string");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(service.translate).not.toHaveBeenCalled();
  });

  it("translates a valid HTTP request", async () => {
    const logger = createTestLogger();
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    const server = createTranslationBackendServer({
      service,
      logger,
      diagnostics: {
        configuredProvider: "mymemory",
        myMemoryEmailConfigured: true,
      },
    });
    const response = await inject(server, {
      method: "POST",
      url: "/translate",
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
    expect(logger.messages).toHaveLength(1);
    expect(JSON.parse(logger.messages[0])).toMatchObject({
      event: "translate_request",
      statusCode: 200,
      context: "selection",
      sourceLanguage: "nl",
      targetLanguage: "en",
      textLength: 4,
      configuredProvider: "mymemory",
      myMemoryEmailConfigured: true,
    });
    expect(logger.messages[0]).not.toContain("huis");
    expect(logger.messages[0]).not.toContain("house");
  });

  it("rejects invalid translation requests before calling the service", async () => {
    const service = {
      translate: vi.fn(),
    };

    const server = createTranslationBackendServer({ service, logger: createTestLogger() });
    const response = await inject(server, {
      method: "POST",
      url: "/translate",
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

    const server = createTranslationBackendServer({ service, logger: createTestLogger() });
    const response = await inject(server, {
      method: "POST",
      url: "/translate",
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
    const logger = createTestLogger();
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    const server = createTranslationBackendServer({
      service,
      logger,
      rateLimit: {
        maxRequests: 2,
        windowMs: 60_000,
        now: () => currentTime,
      },
    });

    await expect(postTranslate(server)).resolves.toMatchObject({ status: 200 });
    await expect(postTranslate(server)).resolves.toMatchObject({ status: 200 });

    const limitedResponse = await postTranslate(server);

    await expect(limitedResponse.json()).resolves.toEqual({
      error: "Too many translation requests. Try again soon.",
    });
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("retry-after")).toBe("60");
    expect(service.translate).toHaveBeenCalledTimes(2);
    expect(JSON.parse(logger.messages[2])).toMatchObject({
      event: "translate_request",
      statusCode: 429,
      rateLimited: true,
    });

    currentTime += 60_000;

    await expect(postTranslate(server)).resolves.toMatchObject({ status: 200 });
    expect(service.translate).toHaveBeenCalledTimes(3);
  });

  it("does not count health checks against the translation rate limit", async () => {
    const service = {
      translate: vi.fn(async () => ({
        translatedText: "house",
      })),
    };

    const server = createTranslationBackendServer({
      service,
      logger: createTestLogger(),
      rateLimit: {
        maxRequests: 1,
        windowMs: 60_000,
      },
    });

    await inject(server, { method: "GET", url: "/health" });
    await inject(server, { method: "GET", url: "/health" });

    await expect(postTranslate(server)).resolves.toMatchObject({ status: 200 });
    expect(service.translate).toHaveBeenCalledTimes(1);
  });

  it("reports a privacy-safe runtime summary through the health endpoint", async () => {
    const service = {
      translate: vi
        .fn()
        .mockResolvedValueOnce({ translatedText: "house" })
        .mockRejectedValueOnce(
          new ProviderError("Google returned 429", {
            statusCode: 429,
            providerName: "google-translate",
            providerStatus: 429,
          }),
        ),
    };

    const server = createTranslationBackendServer({
      service,
      logger: createTestLogger(),
      rateLimit: {
        maxRequests: 2,
        windowMs: 60_000,
      },
    });

    await postTranslate(server);
    await postTranslate(server, { text: "english", context: "hover" });
    await postTranslate(server);
    await inject(server, {
      method: "POST",
      url: "/translate",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "",
        sourceLanguage: "nl",
        targetLanguage: "en",
        context: "selection",
      }),
    });

    const response = await inject(server, {
      method: "GET",
      url: "/health",
    });
    const body = await response.json();

    expect(body.runtime).toMatchObject({
      translateRequestsAcceptedTotal: 2,
      requestedTextCharactersTotal: 11,
      translateSuccessTotal: 1,
      translateFailureTotal: 3,
      badRequestTotal: 1,
      clientRateLimitedTotal: 1,
      providerErrorTotal: 1,
      providerRateLimitedTotal: 1,
      byContext: {
        hover: 1,
        selection: 1,
      },
    });
    expect(typeof body.runtime.lastTranslateAt).toBe("string");
  });

  it("preserves provider rate-limit failures as HTTP 429 responses", async () => {
    const logger = createTestLogger();
    const service = {
      translate: vi.fn(async () => {
        throw new ProviderError("MyMemory returned 429", {
          statusCode: 429,
          providerName: "mymemory",
          providerStatus: 429,
        });
      }),
    };

    const server = createTranslationBackendServer({
      service,
      logger,
      diagnostics: {
        configuredProvider: "mymemory",
        myMemoryEmailConfigured: true,
      },
    });

    const response = await postTranslate(server);

    await expect(response.json()).resolves.toEqual({
      error: "MyMemory returned 429",
    });
    expect(response.status).toBe(429);
    expect(service.translate).toHaveBeenCalledTimes(1);
    expect(JSON.parse(logger.messages[0])).toMatchObject({
      event: "translate_request",
      statusCode: 429,
      error: "MyMemory returned 429",
      providerName: "mymemory",
      providerStatus: 429,
      providerRateLimited: true,
      configuredProvider: "mymemory",
      myMemoryEmailConfigured: true,
    });
    expect(logger.messages[0]).not.toContain("dutchmate.project@gmail.com");
  });

  it("returns a clear 404 for unknown routes", async () => {
    const service = {
      translate: vi.fn(),
    };

    const server = createTranslationBackendServer({ service, logger: createTestLogger() });
    const response = await inject(server, {
      method: "GET",
      url: "/unknown",
    });

    await expect(response.json()).resolves.toEqual({
      error: "Use POST /translate",
    });
    expect(response.status).toBe(404);
    expect(service.translate).not.toHaveBeenCalled();
  });
});

function postTranslate(server, overrides = {}) {
  return inject(server, {
    method: "POST",
    url: "/translate",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": "203.0.113.10",
    },
    body: JSON.stringify({
      text: "huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
      ...overrides,
    }),
  });
}

async function inject(server, { method, url, headers = {}, body = "" }) {
  const request = Readable.from(body ? [Buffer.from(body)] : []);
  request.method = method;
  request.url = url;
  request.headers = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  request.socket = {
    remoteAddress: "127.0.0.1",
  };

  return new Promise((resolve, reject) => {
    let statusCode = 200;
    const responseHeaders = new Map();
    const chunks = [];

    const response = {
      setHeader(name, value) {
        responseHeaders.set(name.toLowerCase(), String(value));
      },
      writeHead(nextStatusCode, nextHeaders = {}) {
        statusCode = nextStatusCode;
        for (const [name, value] of Object.entries(nextHeaders)) {
          responseHeaders.set(name.toLowerCase(), String(value));
        }
      },
      end(chunk = "") {
        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        }

        const text = Buffer.concat(chunks).toString("utf8");
        resolve({
          status: statusCode,
          headers: {
            get(name) {
              return responseHeaders.get(name.toLowerCase()) ?? null;
            },
          },
          async json() {
            return JSON.parse(text);
          },
          async text() {
            return text;
          },
        });
      },
    };

    request.on("error", reject);

    try {
      server.emit("request", request, response);
    } catch (error) {
      reject(error);
    }
  });
}

function createTestLogger() {
  return {
    messages: [],
    info(message) {
      this.messages.push(message);
    },
  };
}
