export declare let Validators: {
    required: (text: any, rule: any) => any;
    length: (text: any, rule: any) => any;
    regex: (text: any, rule: any) => any;
};
export declare function validation(obj: any): (field: string | {
    [index: string]: any;
}, text: string) => {};
