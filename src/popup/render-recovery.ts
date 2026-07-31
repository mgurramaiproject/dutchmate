export function renderWithRecovery(
  content: HTMLElement,
  renderScreen: () => HTMLElement,
  renderRecovery: () => HTMLElement,
): void {
  try {
    content.replaceChildren(renderScreen());
  } catch {
    content.replaceChildren(renderRecovery());
  }
}
