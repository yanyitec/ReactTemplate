/// <reference types="react" />
import { Component } from 'lib/react/react';
export declare class AppView extends Component {
    props: any;
    context: any;
    constructor(props: any);
    componentDidMount(): void;
    render(): JSX.Element;
}
export interface IApp {
    dialog(opts: any): any;
    navigate(urlOrOpts: any): any;
    dispach(action: {
        type: string;
    }): any;
    getJson(url: any, data: any): IThenable;
    postJson(url: any, data: any): IThenable;
    winAlert(msg: any): any;
}
declare let App: import("../../../../../ITPS/05 architecture/CMBPS.Front/src/lib/module").IModule;
export declare let $app: IApp;
export default App;
