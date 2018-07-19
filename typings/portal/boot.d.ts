declare var require: any;
declare var Promise: Function;
declare let bootMsg: HTMLElement;
declare let showMessage: (message: string, color?: any) => void;
declare let showError: (msg: string) => void;
declare let sniffer: (mod: any, index: any, value: any) => void;
declare let booter: {
    showMessage: (message: string, color?: any) => void;
    increaseTask: (count: any) => any;
    decreaseTask: (count: any) => number;
};
declare let taskcount: number;
declare let donecount: number;
declare let config: any;
