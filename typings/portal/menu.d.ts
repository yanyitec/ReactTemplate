/// <reference types="react" />
import { Component } from 'lib/react/react';
export interface IMenuItem {
    Id: string;
    Name?: string;
    Icon?: string;
    Url?: string;
    Children?: IMenuItem[];
}
export interface IMainMenuState {
    data: IMenuItem[];
    defaultSelectedKeys: string[];
    defaultOpenKeys: string[];
    mode: string;
    beforeMode: string;
    hidden: boolean;
    className?: string;
    timer: number;
}
export interface IMainMenuNotice {
    onItemClick: Function;
    onToggleIcon: Function;
}
export default class MainMenuView extends Component {
    props: IMainMenuState & IMainMenuNotice;
    collapsed: boolean;
    state: any;
    setState: Function;
    constructor(props: IMainMenuState & IMainMenuNotice);
    render(): JSX.Element;
    _buildMenuName: (node: any, menuClickHandler: any) => JSX.Element;
    _buildMenu: (children: any, menuClickHandler: any) => any[];
}
