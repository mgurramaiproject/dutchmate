import { describe, expect, it } from "vitest";
import { LocalCacheStorage, type LocalCacheExtensionApi } from "./local-cache-storage";

describe("LocalCacheStorage", () => {
  it("reads values from extension storage.local", async () => {
    const extensionApi = createFakeExtensionApi({
      "cache-key": { entries: {} },
    });
    const storage = new LocalCacheStorage(extensionApi);

    await expect(storage.get("cache-key")).resolves.toEqual({ entries: {} });
  });

  it("writes values to extension storage.local", async () => {
    const extensionApi = createFakeExtensionApi();
    const storage = new LocalCacheStorage(extensionApi);

    await storage.set("cache-key", { entries: { huis: "house" } });

    expect(extensionApi.values["cache-key"]).toEqual({ entries: { huis: "house" } });
  });

  it("returns undefined when extension storage is unavailable", async () => {
    const storage = new LocalCacheStorage(undefined);

    await expect(storage.get("cache-key")).resolves.toBeUndefined();
    await expect(storage.set("cache-key", { entries: {} })).resolves.toBeUndefined();
  });

  it("returns undefined when storage.local.get reports a runtime error", async () => {
    const extensionApi = createFakeExtensionApi({
      "cache-key": { entries: {} },
    });
    extensionApi.runtime.lastError = { message: "Storage failed" };
    const storage = new LocalCacheStorage(extensionApi);

    await expect(storage.get("cache-key")).resolves.toBeUndefined();
  });
});

type FakeExtensionApi = LocalCacheExtensionApi & {
  values: Record<string, unknown>;
};

function createFakeExtensionApi(values: Record<string, unknown> = {}): FakeExtensionApi {
  const extensionApi: FakeExtensionApi = {
    values: { ...values },
    runtime: {},
    storage: {
      local: {
        get(keys, callback) {
          const requestedKeys = Array.isArray(keys) ? keys : [keys];
          callback(
            Object.fromEntries(
              requestedKeys.map((key) => [key, extensionApi.values[key]]),
            ),
          );
        },
        set(items, callback) {
          extensionApi.values = {
            ...extensionApi.values,
            ...items,
          };
          callback?.();
        },
      },
    },
  };

  return extensionApi;
}
