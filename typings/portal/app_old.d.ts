/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface ICredence {
    Username: string;
    Password: string;
    RememberMe: boolean;
    AccessToken?: string;
}
export interface IAuthState {
    enable: boolean;
    credence?: ICredence;
    validStates?: any;
    auth_type?: string;
    url?: string;
    auth_dataType?: string;
    authview_resolve?: Function;
    [key: string]: any;
}
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
declare let App: import("../../../../Front/ReactTemplate/src/lib/module").IModule;
export declare let $app: IApp;
export default App;
