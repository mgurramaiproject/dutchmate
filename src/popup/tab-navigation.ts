export type PopupTab = "learn" | "settings";

export function getPopupTabForKey(current: PopupTab, key: string): PopupTab | null {
  if (key === "Home") {
    return "learn";
  }
  if (key === "End") {
    return "settings";
  }
  if (key === "ArrowRight" || key === "ArrowLeft") {
    return current === "learn" ? "settings" : "learn";
  }
  return null;
}
