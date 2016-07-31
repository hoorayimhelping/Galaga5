/* If the following evaluates to true, the two rectangles are not colliding
 * (first.bottom < second.top) || (first.top > second.bottom) ||
 * (first.left > second.right) || (first.right < second.left)
 */
export const areColliding = (first, second) => (!(
  (first.frame.height + first.frame.y) < second.frame.y ||
  first.frame.y > (second.frame.height + second.frame.y) ||
  first.frame.x > (second.frame.x + second.frame.width) ||
  (first.frame.x + first.frame.width) < second.frame.x
));
