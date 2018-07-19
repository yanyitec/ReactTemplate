/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface IMenuItem {
    Id: string;
    Name?: string;
    Icon?: string;
    Url?: string;
    ParentId?: string;
    Children?: IMenuItem[];
}
export interface IMainMenuState {
    id?: string;
    data?: {
        [index: string]: IMenuItem;
    };
    roots?: IMenuItem[];
    defaultSelectedKeys?: string[];
    defaultOpenKeys?: string[];
    mode?: string;
    collapsed?: boolean;
    foldable?: boolean;
    hidden?: boolean;
    beforeMode?: string;
    className?: string;
    theme_type?: string;
    waitForHidden?: number;
}
export interface IMainMenuAction {
    onMenuClick: Function;
    onMenuToggleFold: Function;
    onMouseOver: Function;
    onMouseOut: Function;
}
export default class MainMenuView extends Component {
    props: IMainMenuState & IMainMenuAction;
    collapsed: boolean;
    state: any;
    setState: any;
    forceUpdate: any;
    context: any;
    refs: any;
    constructor(props: IMainMenuState & IMainMenuAction);
    render(): JSX.Element;
    _buildMenuName: (node: any, menuClickHandler: any) => JSX.Element;
    _buildMenu: (children: any, menuClickHandler: any) => any[];
}
