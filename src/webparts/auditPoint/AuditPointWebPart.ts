import { AuditPointBaseWebPart, AuditPointSetup, IAuditPointWebPartProps } from "@/webparts/AuditPointBaseWebPart";

export type { IAuditPointWebPartProps };

/**
 * The stock host: every module, no narrowing. Anything solution specific belongs in
 * the consuming solution's own subclass rather than here.
 */
export default class AuditPointWebPart extends AuditPointBaseWebPart {
  /** This is the reference host, so it carries the component board. */
  protected async setup(): Promise<AuditPointSetup> {
    return { componentBoard: true };
  }
}
