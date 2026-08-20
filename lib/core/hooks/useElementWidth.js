import { useEffect, useRef, useState } from "react";
/** Fluent's non-cartesian charts need a pixel width, so measure the container. */
export function useElementWidth(fallback = 320) {
    const ref = useRef(null);
    const [width, setWidth] = useState(fallback);
    useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const measure = () => setWidth(Math.max(160, Math.floor(element.clientWidth)));
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    return [ref, width];
}
//# sourceMappingURL=useElementWidth.js.map