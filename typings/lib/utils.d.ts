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
export default utils;
