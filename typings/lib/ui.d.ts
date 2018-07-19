/// <reference types="react" />
import React, { Component } from 'lib/react/react';
export declare let $app: any;
export declare let __setApp: (app: any) => void;
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
export interface IMountArguments {
    model?: any;
    mapStateToProps?: any;
    mapDispatchToProps?: any;
    action_handlers?: {
        [index: string]: (state: any, action: any) => any;
    };
    store?: any;
    onCreating?: (mountArguments: IMountArguments) => void;
    superStore?: any;
    transport?: any;
    targetElement?: any;
    Redux?: any;
    apiProvider?: (store: any) => {
        [index: string]: Function;
    };
}
export interface IOnCreateInstanceEvent {
    Component?: any;
    props?: any;
    $superStore?: any;
    model?: any;
    mapStateToProps?: any;
    mapDispatchToProps?: any;
    controller?: {};
}
export declare let $mountable: (Component: any, mountArguments?: IMountArguments) => any;
export declare function eachChildren(node: any, handler: (node: any, index: number, parent: any, deep?: number) => string | boolean, deep?: number): void;
export declare function registerComponent(name: any, component: any): void;
export declare class HtmlElementView extends Component {
    content: any;
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    _fillContent(): void;
}
export declare class LoadableView extends Component {
    isUnmount: boolean;
    url: string;
    module: any;
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    static contextTypes: {
        store: any;
    };
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    _removeLoading: (loadableElement: any, contentElement: any, loadingElmement: any, transport: any, onload: any) => void;
    _renderTo: (loadableElement: any, contentElement: any, loadingElement: any, content: any, props: any, transport: any, onload: any) => any;
    _fillContent(): any;
}
export declare class ContentView extends Component {
    props: any;
    render(): JSX.Element;
}
export declare class Center extends React.Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    render(): JSX.Element;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export declare class CascadingView extends React.Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    constructor(props: any);
    render(): JSX.Element;
}
export interface IField {
    name?: string;
    text?: string;
    inputType?: string;
    css?: string;
    info?: string;
}
export interface IFieldState {
    disabled?: boolean;
    field: IField;
    name?: string;
    text?: string;
    className?: string;
    valid?: string;
    inputType?: string;
    required?: string | string;
    xs?: boolean;
    sm?: boolean;
}
export declare class FieldView extends Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    cls: string;
    render(): JSX.Element;
}
export declare class FieldsetView extends Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    cls: string;
    constructor(props: any);
    onToggle: () => void;
    render(): JSX.Element;
}
