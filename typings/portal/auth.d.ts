/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface ICredence {
    Username: string;
    Password: string;
    RememberMe: boolean;
    AccessToken?: string;
}
export interface IPrincipal {
    Id: string;
    Username: string;
    Permissions: any;
    Roles: any;
}
export interface IAuthData {
    AccessToken: string;
    Principal: IPrincipal;
    Profile: any;
}
export interface IAuthState {
    visible: boolean;
    message?: string;
    validStates?: any;
    auth_type?: string;
    url?: string;
    credence?: ICredence;
    [key: string]: any;
}
export default class AuthView extends Component {
    refs: any;
    props: any;
    forceUpdate: any;
    state: any;
    context: any;
    setState: any;
    bg: any;
    elem: any;
    form: any;
    isAttached: boolean;
    constructor(props: any);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    keepCenter: () => void;
}
