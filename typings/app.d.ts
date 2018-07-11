/// <reference types="react" />
import { Component } from 'lib/react/react';
export default class App extends Component {
    setState: Function;
    props: any;
    modalPromise: IPromise;
    constructor(props: any);
    state: {
        layout_collapsed: boolean;
        modal_visible: boolean;
        modal_title: string;
        modal_content: string;
        workspace_module: any;
    };
    _toggleLayoutCollapsed: () => void;
    _onMenuClick: (node: any) => void;
    _buildMenuName: (node: any) => JSX.Element;
    _buildMenu: (data: any) => any[];
    dialog: (opts: any) => any;
    _onModalOk: () => void;
    _onModalCancel: () => void;
    genId: () => any;
    render(): JSX.Element;
}
