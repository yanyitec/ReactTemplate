/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface IAuthInfo {
    Username?: string;
    Password?: string;
    RememberMe?: boolean;
    AccessToken?: string;
}
export interface IAuthPermission {
    Id: string;
    Name?: string;
    SystemId?: string;
    Url?: string;
    Icon?: string;
    ControllerName?: string;
    ActionName?: string;
    ParentId?: string;
}
export interface IAuthData {
    AccessToken: string;
    Info: IAuthInfo;
    Permissions: IAuthPermission[];
    Profile: any;
    User: any;
}
export interface IAuthState {
    enable: boolean;
    data?: IAuthInfo;
    auth_type?: string;
    url?: string;
    auth_dataType?: string;
    authview_resolve?: Function;
}
export interface IAuthNotice {
    onAuthSuccess?: Function;
}
export interface IAuthInternalState extends IAuthInfo {
    nameInputing?: boolean | string;
    pswdInputing?: boolean | string;
    errorMessages?: string[];
    processing?: boolean;
}
export default class Auth extends Component {
    refs: any;
    props: IAuthState & IAuthNotice;
    setState: any;
    forceUpdate: any;
    state: IAuthInternalState;
    context: any;
    timer: any;
    iframe: HTMLIFrameElement;
    view_resolve: Function;
    constructor(props: IAuthState & IAuthNotice);
    doAuth(): void;
    checkInputs(): any[];
    nameChange: (e: any) => void;
    pswdChange: (e: any) => void;
    rememberMeChange: (e: any) => void;
    nameFocusin: () => void;
    nameFocusout: (e: any) => void;
    pswdFocusin: () => void;
    pswdFocusout: (e: any) => void;
    formSubmit: (e: any) => void;
    render(): JSX.Element;
    componentDidMount(): void;
}
