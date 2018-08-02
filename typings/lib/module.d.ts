import * as React from 'lib/react/react';
import * as PropTypes from 'lib/react/prop-types';
export interface IReactComponent {
    (props: any): any;
    refs?: any;
    props?: any;
    forceUpdate?: any;
    state?: any;
    context?: any;
    setState?: any;
}
export interface ILoadableState {
    id?: string;
    className?: string;
    style?: any;
    width?: any;
    height?: any;
    /**
     * 内容类型 : 必填
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,Component,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype?: string;
    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?: any;
    Component?: Function;
    /**
     *远程类型的url
     *
     * @type {string}
     * @memberof IContentState
     */
    url?: string;
    /**
     * 当远程为module时,里面模块的初始状态
     *
     * @type {*}
     * @memberof IContentState
     */
    parameters?: any;
    /**
     * 内容有变化后，会调用该函数
     *
     * @memberof IContentState
     */
    onContentChange?: (value: any, ctype: any) => any;
    /**
     * iframe 完成检查。
     * 设定了这个值后， iframe是否完成要符合该reg检查
     *
     * @type {string}
     * @memberof ILoadableState
     */
    iframe_finish_url_regex?: string;
    super_store?: any;
    type?: string;
    tick?: number;
    is_workarea?: boolean;
}
export declare class Loadable extends React.Component {
    refs: any;
    props: ILoadableState;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    cnode: HTMLElement;
    tick: number;
    loaded_url?: string;
    loaded_content?: any;
    rszTimer?: any;
    _w: number;
    _h: number;
    constructor(props: ILoadableState);
    ctype(): string;
    render(): any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    renderModule(): void;
    renderIframe(): void;
    renderPage(): void;
}
export interface IModuleDefination {
    /**
     * 默认的状态值
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    state?: any;
    /**
     * IN 消息处理函数
     *  它会跟action_handlers合并成最终的reducer
     *
     * @memberof IModuleDefination
     */
    reducer?: (state: any, action: any) => any;
    /**
     * IN 消息处理器
     * 它会跟reducer合并成最终的reducer
     *
     * @memberof IModuleDefination
     */
    actions?: {
        [index: string]: (state: any, action: any) => any;
    };
    /**
     * IN/OUT
     *
     * 定义一些api
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    api?: (store: any) => {
        [index: string]: Function;
    };
    /**
     * IN / OUT 状态到属性的映射，
     * 如果不写，就是state全部进入到props去
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    mapStateToProps?: any;
    /**
     * 把action工厂函数作为事件处理程序，注入到props中
     * 如果不填，框架会根据action_handlers自动生成一个
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    mapDispatchToProps?: any;
    initialize?: (props: any) => IThenable | any;
}
export interface IMountOpts {
    props: any;
    element: any;
    superStore?: any;
    transport?: any;
    args: IModuleDefination;
}
export interface IModule {
    createInstance(state: any, superStore?: any): React.Component;
    mount(stateOrComponent: any, element: any, superStore?: any): IThenable;
}
export interface IReduxModule extends IModule {
    (props: any): any;
    $reducer?: (state: IModState, action: any) => IModState;
    $api?: {
        [index: string]: Function;
    };
    $Wrap?: any;
    contextTypes?: {
        store: PropTypes.object;
    };
}
export interface IModuleInstance {
    $store(): any;
    $moduleState(path: string | object, value?: any): any;
    $closing?: (handler: Function) => any;
    $app?: () => any;
    $root?: () => any;
    $navigate?: (url: string, ctype?: any, parameters?: any) => IThenable;
    $waiting?: (text: string) => void;
    $modal?: (opts: IModalAction) => IThenable;
    $dialog?: (opts: IModalAction) => IThenable;
    $messageBox?: (text?: string, caption?: string, icon?: string) => IThenable;
    $confirm?: (text?: string, caption?: string, icon?: string) => IThenable;
    $get?: (url: string, data?: any, waiting?: string) => IThenable;
    $post?: (url: string, data?: any, waiting?: string) => IThenable;
    $validate?: (validStates: any, langs?: any, state?: any) => IThenable;
}
export interface IModalAction {
    type?: string;
    id?: string;
    title?: string;
    nav_name?: string;
    className?: string;
    width?: any;
    height?: any;
    /**
     * 内容类型 : 必填
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,Component,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype?: string;
    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?: any;
    Component?: Function;
    /**
     *远程类型的url
     *
     * @type {string}
     * @memberof IContentState
     */
    url?: string;
    /**
     * 当远程为module时,里面模块的初始状态
     *
     * @type {*}
     * @memberof IContentState
     */
    parameters?: any;
    /**
     * 内容有变化后，会调用该函数
     *
     * @memberof IContentState
     */
    onContentChange?: (value: any, ctype: any) => any;
    /**
     * iframe 完成检查。
     * 设定了这个值后， iframe是否完成要符合该reg检查
     *
     * @type {string}
     * @memberof ILoadableState
     */
    iframe_finish_url_regex?: string;
    /**
     *  弹出的类型
     * layer dialog auto
     * 默认auto
     * @type {string}
     * @memberof IModalState
     */
    modalType?: string;
    /**
     *  on close
     *
     * @type {(IDeferred|Function)}
     * @memberof IModalState
     */
    onclose?: IDeferred | Function;
    /**
     *  on load
     *  content_change
     * @type {(IDeferred|Function)}
     * @memberof IModalState
     */
    onload?: IDeferred | Function;
    callbackOnLoad?: boolean;
}
export interface IModalState extends IModalAction {
    /**
     * creating 准备加载
     * loaded 已经完成
     * closing 正在关闭
     * closed
     *
     * @type {string}
     * @memberof IModalState
     */
    status?: string;
    /**
     * 内部使用，dialog函数等会使用
     *
     * @type {IDeferred}
     * @memberof IModalState
     */
    thenable?: IDeferred;
    /**
     * 内部使用，调用then的时机
     * closed/loaded
     *
     * @type {string}
     * @memberof IModalState
     */
    thenType?: string;
    store?: any;
}
export interface IMaskState {
    type: string;
    caption?: string;
    message: string;
    exclusive?: boolean;
    onclose?: Function;
}
export interface IModState {
    $modal?: IModalState;
    $mask?: IMaskState;
    __$is_workarea__?: boolean | string;
}
export interface IModuleCreation {
    super_store?: any;
    state?: any;
    reducer?: (state: IModState, action: any) => IModState;
    api?: {
        [index: string]: Function;
    };
    actions?: any;
    store?: any;
    Wrap?: any;
    initialize?: (props: any) => IThenable;
    /**
     * 最终生成的Provider包含的 着的组件
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    Redux?: any;
    instance?: React.Component;
}
export default function define_module(Component: any): IModule;
export declare let $mountable: typeof define_module;
export declare let __module__: typeof define_module;
