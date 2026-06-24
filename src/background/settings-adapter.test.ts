import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PROVIDER_ENDPOINT } from "../shared/provider-endpoint";

const storageSyncGet = vi.hoisted(() => vi.fn());

vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      sync: {
        get: storageSyncGet,
      },
    },
  },
}));

import { readProviderSettings, type BackgroundExtensionApi } from "./settings-adapter";

describe("readProviderSettings", () => {
  it("uses the production backend endpoint when the extension API is unavailable", async () => {
    await expect(readProviderSettings(undefined)).resolves.toEqual({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
      providerApiKey: "",
    });
  });

  it("uses the production backend endpoint as the storage default", async () => {
    const get = vi.fn((defaults, callback) => callback(defaults));
    const extensionApi: BackgroundExtensionApi = {
      storage: {
        sync: {
          get,
        },
      },
      runtime: {},
    };

    await expect(readProviderSettings(extensionApi)).resolves.toEqual({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
      providerApiKey: "",
    });
    expect(get).toHaveBeenCalledTimes(1);
    expect(get.mock.calls[0]?.[0]).toMatchObject({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
      providerApiKey: "",
    });
  });

  it("normalizes stored provider settings through the shared settings seam", async () => {
    const extensionApi: BackgroundExtensionApi = {
      storage: {
        sync: {
          get: (_defaults, callback) => {
            callback({
              providerEndpoint: 42,
              providerApiKey: "secret",
            } as unknown as Partial<typeof _defaults>);
          },
        },
      },
      runtime: {},
    };

    await expect(readProviderSettings(extensionApi)).resolves.toEqual({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
      providerApiKey: "secret",
    });
  });
});
