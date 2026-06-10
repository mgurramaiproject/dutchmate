export const TRANSLATION_CONTEXTS = new Set(["hover", "selection"]);

export function validateTranslationRequest(body) {
  if (!isObject(body)) {
    return "Request body must be a JSON object";
  }

  if (typeof body.text !== "string" || !body.text.trim()) {
    return "text is required";
  }

  if (body.sourceLanguage !== "auto") {
    return "sourceLanguage must be auto";
  }

  if (typeof body.targetLanguage !== "string" || !body.targetLanguage.trim()) {
    return "targetLanguage is required";
  }

  if (!TRANSLATION_CONTEXTS.has(body.context)) {
    return "context must be hover or selection";
  }

  return null;
}

export function normalizeTranslationRequest(body) {
  return {
    text: body.text.trim(),
    sourceLanguage: body.sourceLanguage,
    targetLanguage: body.targetLanguage.trim().toLowerCase(),
    context: body.context,
  };
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
