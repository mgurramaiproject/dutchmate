export const TRANSLATION_CONTEXTS = new Set(["hover", "selection"]);
export const SOURCE_LANGUAGES = new Set(["auto", "en", "nl", "te"]);
export const MAX_HOVER_TEXT_LENGTH = 48;
export const MAX_SELECTION_TEXT_LENGTH = 600;

export function validateTranslationRequest(body) {
  if (!isObject(body)) {
    return "Request body must be a JSON object";
  }

  if (typeof body.text !== "string" || !body.text.trim()) {
    return "text is required";
  }

  const trimmedText = body.text.trim();

  if (typeof body.sourceLanguage !== "string" || !SOURCE_LANGUAGES.has(body.sourceLanguage.trim().toLowerCase())) {
    return "sourceLanguage must be auto, en, nl, or te";
  }

  if (typeof body.targetLanguage !== "string" || !body.targetLanguage.trim()) {
    return "targetLanguage is required";
  }

  if (!TRANSLATION_CONTEXTS.has(body.context)) {
    return "context must be hover or selection";
  }

  if (body.context === "hover" && trimmedText.length > MAX_HOVER_TEXT_LENGTH) {
    return `hover text must be ${MAX_HOVER_TEXT_LENGTH} characters or fewer`;
  }

  if (body.context === "selection" && trimmedText.length > MAX_SELECTION_TEXT_LENGTH) {
    return `selection text must be ${MAX_SELECTION_TEXT_LENGTH} characters or fewer`;
  }

  return null;
}

export function normalizeTranslationRequest(body) {
  return {
    text: body.text.trim(),
    sourceLanguage: body.sourceLanguage.trim().toLowerCase(),
    targetLanguage: body.targetLanguage.trim().toLowerCase(),
    context: body.context,
  };
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
