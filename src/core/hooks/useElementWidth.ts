import { useEffect, useRef, useState } from "react";

/** Fluent's non-cartesian charts need a pixel width, so measure the container. */
export function useElementWidth<TElement extends HTMLElement>(
  fallback = 320
): [React.RefObject<TElement>, number] {
  const ref = useRef<TElement>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = (): void => setWidth(Math.max(160, Math.floor(element.clientWidth)));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
