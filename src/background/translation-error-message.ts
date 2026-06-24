export function getTranslationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (
    message === "Provider returned 429" ||
    message === "Too many translation requests. Try again soon." ||
    message === "Translation backend is busy. Try again soon."
  ) {
    return "Translation is temporarily busy. Try again soon.";
  }

  if (message === "Provider request timed out") {
    return "Translation request timed out before the backend responded.";
  }

  return `Translation failed: ${message}`;
}
