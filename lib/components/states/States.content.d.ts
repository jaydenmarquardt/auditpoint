export declare const StatesContent: {
    readonly loading: {
        readonly label: "Loading…";
    };
    readonly empty: {
        readonly title: "Nothing here yet";
        readonly description: "Once data exists for this view it will show up here.";
        readonly action: "Refresh";
    };
    readonly error: {
        readonly title: "Something went wrong";
        readonly description: "The request did not complete. Try again, and if it keeps failing send the detail below to an admin.";
        readonly action: "Try again";
        readonly detailToggle: "Show detail";
    };
    readonly unauthorised: {
        readonly title: "You do not have access";
        readonly description: (appName: string) => string;
        readonly action: "Reload";
    };
    readonly crash: {
        readonly title: "This view crashed";
        readonly description: "A bug stopped this page from rendering. Reloading usually clears it.";
        readonly action: "Reload page";
    };
};
//# sourceMappingURL=States.content.d.ts.map