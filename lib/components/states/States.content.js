export const StatesContent = {
    loading: { label: "Loading…" },
    empty: {
        title: "Nothing here yet",
        description: "Once data exists for this view it will show up here.",
        action: "Refresh",
    },
    error: {
        title: "Something went wrong",
        description: "The request did not complete. Try again, and if it keeps failing send the detail below to an admin.",
        action: "Try again",
        detailToggle: "Show detail",
    },
    unauthorised: {
        title: "You do not have access",
        description: (appName) => `${appName} is restricted to site administrators and owners. Ask a site owner to grant you access, then reload the page.`,
        action: "Reload",
    },
    crash: {
        title: "This view crashed",
        description: "A bug stopped this page from rendering. Reloading usually clears it.",
        action: "Reload page",
    },
};
//# sourceMappingURL=States.content.js.map