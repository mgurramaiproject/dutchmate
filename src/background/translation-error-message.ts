export function getTranslationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (message === "Provider returned 429") {
    return "Translation is temporarily busy. Try again soon.";
  }

  return `Translation failed: ${message}`;
}
