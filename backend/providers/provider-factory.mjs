import { createLocalDevProvider } from "./local-dev-provider.mjs";

export const DEFAULT_TRANSLATION_PROVIDER = "local-dev";

export function createProviderFromEnvironment(environment = process.env) {
  const providerName = environment.TRANSLATION_PROVIDER ?? DEFAULT_TRANSLATION_PROVIDER;

  return createProvider(providerName);
}

export function createProvider(providerName) {
  switch (providerName.trim().toLowerCase()) {
    case "local-dev":
      return createLocalDevProvider();
    default:
      throw new Error(
        `Unsupported TRANSLATION_PROVIDER "${providerName}". Supported providers: local-dev`,
      );
  }
}
