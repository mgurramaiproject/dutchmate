import { readBackendConfig } from "./config.mjs";
import { createProvider } from "./providers/provider-factory.mjs";
import { createTranslationBackendServer } from "./server.mjs";
import { createTranslationService } from "./translation-service.mjs";

const config = readBackendConfig();

const provider = createProvider(config.provider, config);
const service = createTranslationService(provider);
const server = createTranslationBackendServer({
  service,
  rateLimit: config.rateLimit,
  diagnostics: {
    configuredProvider: provider.name,
    myMemoryEmailConfigured: Boolean(config.mymemory.email),
  },
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${config.port} is already in use. Stop the other translation server or run with PORT=<other-port>.`);
    process.exit(1);
  }

  throw error;
});

server.listen(config.port, config.host, () => {
  console.log(`Local translation backend listening at http://localhost:${config.port}`);
  console.log(`Translate endpoint: http://localhost:${config.port}/translate`);
  console.log(`Provider: ${provider.name}`);
  console.log(`MyMemory email configured: ${Boolean(config.mymemory.email)}`);
  console.log(
    `Rate limit: ${config.rateLimit.maxRequests} translate requests per ${config.rateLimit.windowMs} ms`,
  );
});
