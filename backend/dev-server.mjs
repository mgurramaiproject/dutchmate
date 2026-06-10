import { createProviderFromEnvironment } from "./providers/provider-factory.mjs";
import { createTranslationBackendServer } from "./server.mjs";
import { createTranslationService } from "./translation-service.mjs";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "8787", 10);

const provider = createProviderFromEnvironment();
const service = createTranslationService(provider);
const server = createTranslationBackendServer({ service });

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other translation server or run with PORT=<other-port>.`);
    process.exit(1);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`Local translation backend listening at http://localhost:${port}`);
  console.log(`Translate endpoint: http://localhost:${port}/translate`);
  console.log(`Provider: ${provider.name}`);
});
