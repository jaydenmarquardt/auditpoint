import { Tokens } from "./Tokens";
const STYLE_ID = "auditpoint-global-styles";
export function injectGlobalStyles() {
    if (document.getElementById(STYLE_ID))
        return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    .auditpoint-root, .auditpoint-root *, .auditpoint-root *::before, .auditpoint-root *::after {
      box-sizing: border-box;
    }
    .auditpoint-root { max-width: 100%; }
    .auditpoint-root svg { display: block; max-width: 100%; }
    .auditpoint-root pre, .auditpoint-root code { max-width: 100%; }
    @keyframes auditpoint-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }
    @keyframes auditpoint-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.45; }
    }
    @keyframes auditpoint-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .auditpoint-spin { display: inline-block; animation: auditpoint-spin 1.1s linear infinite; }
    @keyframes auditpoint-stripes {
      from { background-position: 0 0; }
      to { background-position: 36px 0; }
    }
    @keyframes auditpoint-slide-up {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .auditpoint-root :focus-visible {
      outline: 2px solid ${Tokens.colour.focus};
      outline-offset: 2px;
    }
  `;
    document.head.appendChild(style);
}
//# sourceMappingURL=Global.styles.js.map