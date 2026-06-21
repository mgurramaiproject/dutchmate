const TEXT_NODE = 3;

type RangeBoundaryNode = {
  nodeType: number;
};

export function isValidTextRangeBoundary(
  node: RangeBoundaryNode,
  text: string,
  start: number,
  end: number,
): boolean {
  return (
    node.nodeType === TEXT_NODE &&
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end >= start &&
    end <= text.length
  );
}
