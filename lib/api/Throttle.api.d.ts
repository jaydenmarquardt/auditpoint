import { ThrottleCallOptions, ThrottleOptions, ThrottleState } from "./Throttle.types";
export declare const throttleStore: import("../core/state/Store").Store<ThrottleState>;
export declare function configureThrottle(next: Partial<ThrottleOptions>): void;
export declare function pauseThrottle(): void;
export declare function resumeThrottle(): void;
export declare function isThrottlePaused(): boolean;
export declare function useThrottleState(): ThrottleState;
/** Every SharePoint call goes through here so 429/503 backoff is handled in one place. */
export declare function throttled<T>(run: () => Promise<T>, callOptions?: ThrottleCallOptions): Promise<T>;
export declare function throttledAll<T>(runners: (() => Promise<T>)[], callOptions?: ThrottleCallOptions): Promise<T[]>;
//# sourceMappingURL=Throttle.api.d.ts.map