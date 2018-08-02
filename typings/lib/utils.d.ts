declare let utils: any;
export declare function deepClone(src: any): any;
export declare function mergeDiff(dest: any, src: any, prop?: string): any;
export declare let attach: (elem: any, evt: any, handler: any) => void;
export declare let detech: (elem: any, evt: any, handler: any) => void;
export declare let getCookie: (name: string) => string;
export declare let setCookie: (name: string, value?: any, time?: string) => any;
export declare function delCookie(name: string): void;
export declare let getBox: (elem?: any) => {
    x: number;
    y: number;
    width: any;
    height: any;
};
export interface IViewport {
    w: number;
    h: number;
    name: string;
}
export declare let viewport: (onChange?: boolean | ((type: any) => void)) => string | IViewport;
export interface IAccessor {
    setValue($root: object, value: any): object;
    getValue($root: object): any;
}
export declare function objectAccessor(path: string): IAccessor;
export declare function is_array(obj: any): boolean;
export declare function array_remove(arr: any[], item: any): void;
export declare function array_filter(arr: any[], predicator: Function): any[];
export default utils;
