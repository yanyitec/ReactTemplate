export declare function ajax(url: any, opts?: any): IThenable;
export declare let getJson: (url: any, data?: any, opts?: any) => IThenable;
export declare let postJson: (url: any, data?: any, opts?: any) => IThenable;
export default function ajaxable(target: any, store: any, defaultOpts: any): void;
