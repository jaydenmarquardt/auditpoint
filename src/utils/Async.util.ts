export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bounded fan-out, unbounded Promise.all gets the tenant to 429. */
export async function mapWithConcurrency<TIn, TOut>(
  items: readonly TIn[],
  limit: number,
  worker: (item: TIn, index: number) => Promise<TOut>
): Promise<TOut[]> {
  const results: TOut[] = new Array(items.length);
  let cursor = 0;

  const runners = new Array(Math.max(1, Math.min(limit, items.length))).fill(0).map(async () => {
    for (;;) {
      const index = cursor;
      cursor = cursor + 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(runners);
  return results;
}

export async function retry<T>(
  operation: () => Promise<T>,
  attempts = 3,
  backoffMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt = attempt + 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await delay(backoffMs * Math.pow(2, attempt));
    }
  }
  throw lastError;
}
