declare const _default: {
    resolves: {
        "^\\{Auth\\}/": string;
        "^\\{Site\\}/": string;
    };
    preloads: string[];
    entry: string;
    auth: {
        url: string;
    };
    release_version: string;
    ajax: {
        headers: {
            'X-Requested-With': string;
            'X-Requested-Type': string;
            'X-Response-Type': string;
        };
        url_resolve: string;
    };
};
export default _default;
