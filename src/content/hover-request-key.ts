export type HoverRequestKeyInput = {
  text: string;
  languageSample: string;
  sourceLanguageHint?: string;
  start: number;
  end: number;
};

export function getHoverRequestKey(input: HoverRequestKeyInput): string {
  return [
    input.text,
    input.languageSample,
    input.sourceLanguageHint ?? "",
    String(input.start),
    String(input.end),
  ].join("\u001f");
}
