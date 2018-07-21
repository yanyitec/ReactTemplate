import * as React from 'lib/react/react';
import * as PropTypes from 'lib/react/prop-types';
export interface ILoadableState {
    /**
     * 内容类型 :
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype: string;
    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?: any;
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
    mod_state?: any;
    /**
     * 远程类型加载完成后会调用这个函数
     *
     * @memberof IContentState
     */
    loaded?: (ctype: any, value: any) => any;
    super_store?: any;
    type?: string;
    tick?: number;
}
export interface IPopAction {
    url: string;
    data?: any;
    fireOnLoaded?: boolean;
}
export declare class Loadable extends React.Component {
    refs: any;
    props: any;
    setState: any;
    forceUpdate: any;
    state: any;
    context: any;
    cnode: HTMLElement;
    tick: number;
    loadedUrl?: string;
    rszTimer?: any;
    _w: number;
    _h: number;
    constructor(props: any);
    render(): any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    renderModule(): void;
    renderIframe(): void;
    renderPage(): void;
}
export interface IModuleArguments {
    /**
     * IN 默认的状态值
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    state?: any;
    /**
     * IN 消息处理函数
     *  它会跟action_handlers合并成最终的reducer
     *
     * @memberof IModuleArguments
     */
    reducer?: (state: any, action: any) => any;
    /**
     * IN 消息处理器
     * 它会跟reducer合并成最终的reducer
     *
     * @memberof IModuleArguments
     */
    action_handlers?: {
        [index: string]: (state: any, action: any) => any;
    };
    /**
     * 上级/模块创建者的 store
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    superStore?: any;
    /**
     * IN/OUT
     *  模块与模块之间的通信对象
     * 用于在模块跟模块之间传递某些值
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    apiProvider?: (store: any) => {
        [index: string]: Function;
    };
    /**
     * IN / OUT 状态到属性的映射，
     * 如果不写，就是state全部进入到props去
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    mapStateToProps?: any;
    /**
     * 把action工厂函数作为事件处理程序，注入到props中
     * 如果不填，框架会根据action_handlers自动生成一个
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    mapDispatchToProps?: any;
    /**
     * 要挂载的元素
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    element?: any;
    /**
     * IN 如果设定了该参数
     * mount 会异步挂载,异步函数会调用这个函数
     *
     * @memberof IModuleArguments
     */
    mount_async?: (opts: IMountOpts) => IThenable;
    onCreating?: (creation: IModuleCreation) => void;
    onMounting?: (store: any) => void;
}
export interface IMountOpts {
    props: any;
    element: any;
    superStore?: any;
    transport?: any;
    args: IModuleArguments;
}
export interface IModule {
    createInstance(state: any, superStore?: any): React.Component;
    mount(stateOrComponent: any, element: any, superStore?: any): IThenable;
    $reducer?: (state: IModState, action: any) => IModState;
    $api?: {
        [index: string]: Function;
    };
    $Wrap?: any;
    contextTypes?: {
        store: PropTypes.object;
    };
}
interface IPopState extends ILoadableState {
    /**
     * creating 准备加载
     * loaded 已经完成
     * closing 正在关闭
     * closed
     *
     * @type {string}
     * @memberof IPopState
     */
    status: string;
    /**
     *  弹出的类型
     * layer dialog auto
     * 默认auto
     * @type {string}
     * @memberof IPopState
     */
    popType?: string;
    /**
     * 内部使用，dialog函数等会使用
     *
     * @type {IDeferred}
     * @memberof IPopState
     */
    thenable?: IDeferred;
    /**
     * 内部使用，调用then的时机
     * closed/loaded
     *
     * @type {string}
     * @memberof IPopState
     */
    thenType?: string;
    /**
     *  on close
     *
     * @type {(IDeferred|Function)}
     * @memberof IPopState
     */
    onclose?: IDeferred | Function;
    /**
     *  on load
     *
     * @type {(IDeferred|Function)}
     * @memberof IPopState
     */
    onload?: IDeferred | Function;
    store?: any;
    id?: string;
}
export interface IModState {
    pop?: IPopState;
    waiting?: boolean;
}
export interface IModuleCreation {
    $super_store?: any;
    $state?: any;
    $reducer?: (state: IModState, action: any) => IModState;
    $api?: {
        [index: string]: Function;
    };
    $store?: any;
    $Wrap?: any;
    /**
     * 最终生成的Provider包含的 着的组件
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    Redux?: any;
    instance?: React.Component;
}
export default function define_module(Component: any, moduleArguments?: IModuleArguments): IModule;
export declare let $mountable: typeof define_module;
export declare let __module__: typeof define_module;
export {};
