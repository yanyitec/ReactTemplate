/// <reference types="react" />
import { Component } from 'lib/react/react';
interface IAuthData {
    Username?: string;
    Password?: string;
    RememberMe?: boolean;
    AccessToken?: boolean;
}
interface IAuthState extends IAuthData {
    nameInputing?: boolean | string;
    pswdInputing?: boolean | string;
    errorMessages?: string[];
    processing?: boolean;
}
interface IAuthModel {
    enable: boolean;
    data?: IAuthData;
    auth_type?: string;
    url?: string;
    auth_dataType?: string;
    authview_resolve?: Function;
    onAuthSuccess?: Function;
}
export default class Auth extends Component {
    refs: any;
    props: IAuthModel;
    setState: any;
    forceUpdate: any;
    state: IAuthState;
    context: any;
    timer: any;
    iframe: HTMLIFrameElement;
    view_resolve: Function;
    constructor(props: IAuthModel);
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
export {};
