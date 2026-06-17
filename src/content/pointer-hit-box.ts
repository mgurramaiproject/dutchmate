export type PointerHitBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

export function isPointInsideVisibleBox(
  x: number,
  y: number,
  box: PointerHitBox,
): boolean {
  if (box.width <= 0 || box.height <= 0) {
    return false;
  }

  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}
