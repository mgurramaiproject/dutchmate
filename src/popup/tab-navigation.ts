export type PopupTab = "today" | "lessons" | "saved";

export function getPopupTabForKey(current: PopupTab, key: string): PopupTab | null {
  if (key === "Home") {
    return "today";
  }
  if (key === "End") {
    return "saved";
  }
  if (key === "ArrowRight" || key === "ArrowLeft") {
    const tabs: PopupTab[] = ["today", "lessons", "saved"];
    const direction = key === "ArrowRight" ? 1 : -1;
    return tabs[(tabs.indexOf(current) + direction + tabs.length) % tabs.length];
  }
  return null;
}
