/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface IMenuItem {
    Id: string;
    _menuId: string;
    Name?: string;
    Icon?: string;
    Url?: string;
    ParentId?: string;
    Children?: IMenuItem[];
}
export interface IMainMenuState {
    id?: string;
    nodes?: {
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
    menuArea: any;
    timer: any;
    y: number;
    constructor(props: IMainMenuState & IMainMenuAction);
    render(): JSX.Element;
    componentDidMount(): void;
    _buildMenuName: (node: any, menuClickHandler: any) => JSX.Element;
    _buildMenu: (children: any, menuClickHandler: any) => any[];
    checkHeight: () => void;
    componentWillUnmount(): void;
}
