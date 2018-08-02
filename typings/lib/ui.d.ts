/// <reference types="react" />
import React, { Component } from 'lib/react/react';
export declare function eachChildren(node: any, handler: (node: any, index: number, parent: any, deep?: number) => string | boolean, deep?: number): void;
export declare function registerComponent(name: any, component: any): void;
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
export interface IFieldState {
    disabled?: boolean;
    name?: string;
    validStates?: any;
    validate?: Function;
    info?: string;
    label?: string;
    className?: string;
    required?: string | string;
    xs?: boolean;
    sm?: boolean;
}
export declare class Field extends Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    css: string;
    render(): JSX.Element;
}
export declare class Fieldset extends Component {
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
