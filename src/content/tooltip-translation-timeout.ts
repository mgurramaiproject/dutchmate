export const TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE =
  "Translation request timed out before the backend responded.";

export function withTooltipTranslationTimeout<T>(
  request: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      reject(new Error(TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE));
    }, timeoutMs);

    request.then(
      (result) => {
        globalThis.clearTimeout(timeout);
        resolve(result);
      },
      (error) => {
        globalThis.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}
