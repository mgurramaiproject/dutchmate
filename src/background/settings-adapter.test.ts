import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PROVIDER_ENDPOINT } from "../shared/provider-endpoint";
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
    expect(get).toHaveBeenCalledWith(
      {
        providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
        providerApiKey: "",
      },
      expect.any(Function),
    );
  });
});
