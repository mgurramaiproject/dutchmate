import { describe, expect, it, vi } from "vitest";
import { normalizeBaseUrl, runSmokeBackend } from "./smoke-backend.mjs";

describe("runSmokeBackend", () => {
  it("reports health and translation success separately", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }))
      .mockResolvedValueOnce(jsonResponse(200, { translatedText: "house" }));
    const stdout = vi.fn();
    const stderr = vi.fn();

    await expect(
      runSmokeBackend({
        baseUrl: "https://example.test/",
        fetchFn,
        stdout,
        stderr,
      }),
    ).resolves.toEqual({ ok: true });

    expect(stdout).toHaveBeenCalledWith("Backend health check passed: https://example.test");
    expect(stdout).toHaveBeenCalledWith(
      "Backend translation smoke test passed: https://example.test",
    );
    expect(stderr).not.toHaveBeenCalled();
  });

  it("reports provider rate limits as translation failures after health passes", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }))
      .mockResolvedValueOnce(jsonResponse(429, { error: "MyMemory returned 429" }));
    const stdout = vi.fn();
    const stderr = vi.fn();

    await expect(
      runSmokeBackend({
        baseUrl: "https://example.test",
        fetchFn,
        stdout,
        stderr,
      }),
    ).resolves.toEqual({ ok: false });

    expect(stdout).toHaveBeenCalledWith("Backend health check passed: https://example.test");
    expect(stderr).toHaveBeenCalledWith(
      "Backend translation smoke test failed: POST /translate returned 429: MyMemory returned 429",
    );
  });

  it("stops before translation when health fails", async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonResponse(503, { ok: false }));
    const stdout = vi.fn();
    const stderr = vi.fn();

    await expect(
      runSmokeBackend({
        baseUrl: "https://example.test",
        fetchFn,
        stdout,
        stderr,
      }),
    ).resolves.toEqual({ ok: false });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(stdout).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith("Backend health check failed: GET /health returned 503");
  });
});

describe("normalizeBaseUrl", () => {
  it("removes trailing slashes", () => {
    expect(normalizeBaseUrl("https://example.test///")).toBe("https://example.test");
  });
});

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}
