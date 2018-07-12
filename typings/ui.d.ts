/// <reference types="react" />
import React, { Component } from 'lib/react/react';
export declare let mergemo: (old: any, newModel: any) => any;
export interface IMountArguments {
    model?: any;
    mapStateToProps?: any;
    mapDispatchToProps?: any;
    controller?: {};
    store?: any;
    onCreating?: (mountArguments: IMountArguments) => void;
    superStore?: any;
    transport?: any;
    targetElement?: any;
    Redux?: any;
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
export declare class CascadingView extends React.Component {
    props: any;
    constructor(props: any);
    render(): JSX.Element;
}
