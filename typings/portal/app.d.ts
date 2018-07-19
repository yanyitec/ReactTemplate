/// <reference types="react" />
import { Component } from 'lib/react/react';
export declare class DialogView extends Component {
    props: any;
    render(): JSX.Element;
}
export declare class AppView extends Component {
    props: any;
    render(): JSX.Element;
}
export interface IApp {
    dialog(opts: any): any;
    navigate(urlOrOpts: any): any;
    dispach(action: {
        type: string;
    }): any;
    GET(url: any, data: any): IThenable;
    POST(url: any, data: any): IThenable;
    winAlert(msg: any): any;
}
declare let App: any;
export declare let $app: IApp;
export default App;
