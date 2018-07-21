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
