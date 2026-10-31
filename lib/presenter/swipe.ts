export type SwipePoint = { x: number; y: number };

/**
 * Touch swipe on the slide. A leftward swipe moves to the next slide; rightward moves back.
 * Small or mostly vertical moves are ignored so a scroll or a tap does not change slides.
 * Mouse drags are not swipes — callers should not pass them here.
 */
export function swipeDirection(start: SwipePoint, end: SwipePoint): "next" | "previous" | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) < 64) return null;
  if (Math.abs(dx) < Math.abs(dy)) return null;
  return dx < 0 ? "next" : "previous";
}
