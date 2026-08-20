export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Narrow an unknown thrown value into something renderable. */
export function toErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error && isNonEmptyString(error.message)) return error.message;
  if (isNonEmptyString(error)) return error;
  return fallback;
}

/** SharePoint returns 401/403 in several shapes depending on the transport. */
export function isUnauthorised(error: unknown): boolean {
  const status = (error as { status?: number; httpStatus?: number })?.status ??
    (error as { httpStatus?: number })?.httpStatus;
  if (status === 401 || status === 403) return true;
  return /\b(401|403|access denied|unauthoriz)/i.test(toErrorMessage(error, ""));
}
