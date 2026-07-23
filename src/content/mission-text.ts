export function normalizeMissionText(text: string): string {
  return text.replace(/-\s+/gu, "-").replace(/\s+/gu, " ").trim();
}
