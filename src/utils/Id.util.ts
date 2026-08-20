let counter = 0;

/** Stable-enough ids for queue items and DOM aria wiring. Not a security primitive. */
export function createId(prefix = "id"): string {
  counter = counter + 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
