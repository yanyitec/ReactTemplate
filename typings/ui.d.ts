/// <reference types="react" />
import * as React from 'lib/react/react';
export declare class Loadable extends React.Component {
    private module;
    private parameters;
    private clientId;
    private domElement;
    state: any;
    setState: any;
    refs: any;
    props: any;
    constructor(props: any);
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
