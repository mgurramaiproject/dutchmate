import { DEFAULT_TRANSLATION_PROVIDER } from "./providers/provider-factory.mjs";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const SUPPORTED_PROVIDERS = new Set([DEFAULT_TRANSLATION_PROVIDER]);

export function readBackendConfig(environment = process.env) {
  const provider = normalizeProvider(environment.TRANSLATION_PROVIDER);
  const host = normalizeHost(environment.HOST);
  const port = normalizePort(environment.PORT);

  return {
    provider,
    host,
    port,
  };
}

function normalizeProvider(value) {
  const provider = (value ?? DEFAULT_TRANSLATION_PROVIDER).trim().toLowerCase();

  if (!provider) {
    throw new Error("TRANSLATION_PROVIDER must not be empty");
  }

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw new Error(`Unsupported TRANSLATION_PROVIDER "${value}". Supported providers: local-dev`);
  }

  return provider;
}

function normalizeHost(value) {
  const host = (value ?? DEFAULT_HOST).trim();

  if (!host) {
    throw new Error("HOST must not be empty");
  }

  return host;
}

function normalizePort(value) {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65535 || String(port) !== value.trim()) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}
