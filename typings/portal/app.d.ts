/// <reference types="react" />
import React from 'lib/react/react';
import { IAuthState } from 'portal/auth';
import { IMainMenuState } from 'portal/menu';
export interface IAppState {
    __$is_workarea__?: boolean | string;
    theme?: string;
    access_token?: string;
    logo_hidden?: boolean;
    auth?: IAuthState;
    menu?: IMainMenuState;
    workarea?: any;
    user?: any;
    nav?: any;
    customActions?: any[];
}
export declare class AppView extends React.Component {
    refs: any;
    props: any;
    forceUpdate: any;
    state: any;
    context: any;
    setState: any;
    render(): JSX.Element;
    static actions: {
        [name: string]: (state: IAppState, action: any) => any;
    };
    static state: any;
    static initialize: (props: IAppState) => IThenable;
    static api: {
        "auth": () => IThenable;
        "navigate": (url: any, data?: any) => IThenable;
    };
}
declare const _default: import("../../../../Front/ReactTemplate/src/lib/module").IModule;
export default _default;
