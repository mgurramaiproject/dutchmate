import { createLocalDevProvider } from "./local-dev-provider.mjs";
import { createDeepLProvider } from "./deepl-provider.mjs";

export const DEFAULT_TRANSLATION_PROVIDER = "local-dev";

export function createProvider(providerName, config = {}) {
  switch (providerName.trim().toLowerCase()) {
    case "local-dev":
      return createLocalDevProvider();
    case "deepl":
      return createDeepLProvider(config.deepl);
    default:
      throw new Error(
        `Unsupported TRANSLATION_PROVIDER "${providerName}". Supported providers: local-dev, deepl`,
      );
  }
}
