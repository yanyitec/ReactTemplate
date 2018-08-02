/// <reference types="react" />
import * as React from 'lib/react/react';
export declare class My extends React.Component {
    props: any;
    state: any;
    setState: Function;
    context: any;
    transport: any;
    static contextTypes: {
        store: any;
    };
    constructor(props: any);
    onChange: (evt: any) => void;
    onMaster: (evt: any) => void;
    onApp: (evt: any) => void;
    render(): JSX.Element;
}
declare const _default: import("../../../../Front/ReactTemplate/src/lib/module").IModule;
export default _default;
