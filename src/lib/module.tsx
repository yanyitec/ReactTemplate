
import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { createStore } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';
import { mergeDiff, viewport } from 'lib/utils';
import * as PropTypes from 'lib/react/prop-types';
import * as axios from 'lib/axios';
import {Modal} from 'lib/antd/antd';

declare var require:Function;
declare var Promise : any;
declare var Deferred:any;


export interface ILoadableState{
    
    /**
     * 内容类型 : 
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype:string;

    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?:any;

    /**
     *远程类型的url
     *
     * @type {string}
     * @memberof IContentState
     */
    url?:string;

    /**
     * 当远程为module时,里面模块的初始状态
     *
     * @type {*}
     * @memberof IContentState
     */
    mod_state?:any;
    
    /**
     * 远程类型加载完成后会调用这个函数
     *
     * @memberof IContentState
     */
    loaded?:(ctype,value)=>any;
    super_store?:any;
    //forceRefresh?:string;
    //作为action 使用
    type?:string;
    //menu 点击要刷新，即使是url一样也要刷新，但render并不总刷新
    tick?:number;
}

export interface IPopAction{
    url:string;
    data?:any;
    fireOnLoaded?:boolean;
}

export class Loadable extends React.Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;

    //componentDidMount:any;
    

    cnode:HTMLElement;
    tick:number;
    loadedUrl?:string;
    rszTimer?:any;
    _w:number;
    _h:number;

    constructor(props){
        super(props);
    }

    render(){
        let ctype = this.props.ctype;
        let vnode;
        if(ctype==='v-node' || ctype==='text'){
            if(this.props.loaded) this.props.loaded.call(this.cnode,ctype,this.props.content);
            return <div>{this.props.content || null}</div>;
        } 
        vnode = <div ref={(node) => this.cnode = node}></div>;
        if(ctype==='html')  {
            this.componentDidMount = this.componentDidUpdate = ()=>{
                this.cnode.innerHTML = this.props.content;
                if(this.props.loaded) this.props.loaded.call(this.cnode,'html',this.cnode);
            }
            return vnode;
        }
        if(ctype==='dom') {
            this.componentDidMount = this.componentDidUpdate = ()=>{
                this.cnode.innerHTML ="";this.cnode.appendChild(this.props.content);
                if(this.props.loaded) this.props.loaded.call(this.cnode,'dom',this.props.content);
            };
            return vnode;
        }
        
        if(ctype==='iframe'){
            this.componentDidMount = this.componentDidUpdate = this.renderIframe;
            return vnode;
        }
        if(ctype==='module'){
            this.componentDidMount = this.componentDidUpdate = this.renderModule;
            return vnode;
        }
        return vnode;
    }
    componentDidMount(){
        
    }
    componentDidUpdate(){
        
    }
    renderModule(){
        if(this.loadedUrl && this.loadedUrl==this.props.url && this.props.tick == this.tick){
            return;
        }
        this.tick = this.props.tick;
        require(this.loadedUrl=this.props.url).then((mod)=>{
            if(mod.createInstance && mod.mount){
                let mod_element = document.createElement('div');
                this.cnode.innerHTML = "";
                this.cnode.appendChild(mod_element);
                mod.mount(this.props.mod_state,mod_element,this.props.super_store).then((store)=>{
                    store.$modname = this.props.url;
                    if(this.props.loaded) this.props.loaded.call(this.cnode,'module',store);
                });
            }
            
            
        });
    }
    
    
    renderIframe(){
        if(this.loadedUrl && this.loadedUrl==this.props.url && this.props.tick == this.tick){
            return;
        }
        this.tick = this.props.tick;
        this.cnode.innerHTML = "<iframe></iframe>";
        let iframe = this.cnode.firstChild as HTMLIFrameElement;
        iframe.onload = ()=>{
            if(this.props.loaded) this.props.loaded.call(iframe,'iframe',iframe);
        };
        let url = this.loadedUrl = this.props.url;
        if(url.indexOf('?')<0) url += '?';
        else url += '&';
        iframe.src= url += '_nocache='+Math.random();
        let fill = ()=>{
            if(this._w!=this.cnode.offsetWidth)iframe.width =(this._w = this.cnode.offsetWidth)+'px';
            if(this._h !=this.cnode.offsetHeight )iframe.height =(this._h = this.cnode.offsetHeight)+'px';
        };
        if(this.rszTimer) clearInterval(this.rszTimer);
        this.rszTimer = setInterval(fill,100);
        fill();
    }
    renderPage(){
        if(this.loadedUrl && this.loadedUrl==this.props.url && !this.props.forceRefresh){
            return;
        }
        axios.get(this.props.url).then((response)=>{
            this.cnode.innerHTML=response.data;
            if(this.props.loaded) this.props.loaded.call(this.cnode,'iframe',this.cnode);
        });
    }
}



export interface IModuleArguments{
    /**
     * IN 默认的状态值
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    state?:any,

    /**
     * IN 消息处理函数
     *  它会跟action_handlers合并成最终的reducer
     *
     * @memberof IModuleArguments
     */
    reducer?:(state:any,action:any)=>any;


    /**
     * IN 消息处理器
     * 它会跟reducer合并成最终的reducer
     * 
     * @memberof IModuleArguments
     */
    action_handlers?:{[index:string]:(state:any,action:any)=>any};

    /**
     * 上级/模块创建者的 store
     * 
     * @type {*}
     * @memberof IModuleArguments
     */
    superStore?:any;


    /**
     * IN/OUT
     *  模块与模块之间的通信对象
     * 用于在模块跟模块之间传递某些值
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    //transport?:any;

    apiProvider?:(store)=>{[index:string]:Function};

    
    /**
     * IN / OUT 状态到属性的映射，
     * 如果不写，就是state全部进入到props去
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    mapStateToProps?:any;

    /**
     * 把action工厂函数作为事件处理程序，注入到props中
     * 如果不填，框架会根据action_handlers自动生成一个
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    mapDispatchToProps?:any;    

    /**
     * 要挂载的元素
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    element?:any;

    /**
     * IN 如果设定了该参数
     * mount 会异步挂载,异步函数会调用这个函数
     * 
     * @memberof IModuleArguments
     */
    mount_async?:(opts:IMountOpts)=>IThenable;
    
    onCreating?:(creation:IModuleCreation)=>void;
    onMounting?:(store:any)=>void;
}

export interface IMountOpts{
    props:any;element:any;superStore?:any;transport?:any;
    args:IModuleArguments;
    
}
export interface IModule{
    //创建模块实例
    createInstance(state:any,superStore?:any): React.Component;
    mount(stateOrComponent:any,element:any,superStore?:any):IThenable;
    $reducer?:(state:IModState,action:any)=>IModState;
    $api?:{[index:string]:Function};
    $Wrap?:any;
    contextTypes?:{ store: PropTypes.object};

}

interface IPopState extends ILoadableState{

    /**
     * creating 准备加载
     * loaded 已经完成
     * closing 正在关闭
     * closed
     *
     * @type {string}
     * @memberof IPopState
     */
    status:string;
    /**
     *  弹出的类型 
     * layer dialog auto
     * 默认auto
     * @type {string}
     * @memberof IPopState
     */
    popType?:string;

    /**
     * 内部使用，dialog函数等会使用
     *
     * @type {IDeferred}
     * @memberof IPopState
     */
    thenable?:IDeferred;

    /**
     * 内部使用，调用then的时机
     * closed/loaded
     *
     * @type {string}
     * @memberof IPopState
     */
    thenType?:string;

    /**
     *  on close
     *
     * @type {(IDeferred|Function)}
     * @memberof IPopState
     */
    onclose?:IDeferred|Function;

    /**
     *  on load
     *
     * @type {(IDeferred|Function)}
     * @memberof IPopState
     */
    onload?:IDeferred|Function;
    store?:any;
    id?:string;
    
}
export interface IModState{
    pop?:IPopState;
    waiting?:boolean;
}

export interface IModuleCreation{
    $super_store?:any;
    $state?:any;
    $reducer?:(state:IModState,action:any)=>IModState;
    $api?:{[index:string]:Function};
    $store?:any;
    $Wrap?:any;
    
    /**
     * 最终生成的Provider包含的 着的组件
     *
     * @type {*}
     * @memberof IModuleArguments
     */
    Redux?:any;
    instance?:React.Component;
}

export default function define_module(Component:any,moduleArguments?:IModuleArguments):IModule{
    moduleArguments ||(moduleArguments={});
    
    let createInstance= (props:any,superStore?:any,creation?:IModuleCreation):React.Component =>{
        creation ||(creation = {});
        creation.$super_store = superStore;
        (props||(props={}));

        // 状态
        let state;
        if(typeof moduleArguments.state==='function') state = moduleArguments.state(props);
        else state = moduleArguments.state;
        //props优先
        state = mergeDiff(state,props);
        if(!state.$mod) state.$mod={};
        creation.$state = state;
        
        creation.$reducer = Component.$reducer || (Component.$reducer = createReducer(creation,moduleArguments));
        
        // 状态管理 store
        let store = creation.$store = createMyStore(Component,creation,moduleArguments);

        let Wrap = Module.$Wrap || (Module.$Wrap = createWrapComponent(Component));

        let Redux = creation.Redux = createRedux(Wrap,moduleArguments);
          
        let instance = creation.instance = <Provider store={store}>
            <Redux />
        </Provider>;
        creation.instance = instance;
        if(moduleArguments.onCreating) moduleArguments.onCreating(creation);
        return instance;
    };
    let Module :IModule = Component as IModule;
    // 默认都在context上挂上store
    Module.contextTypes={ store: PropTypes.object};
    // 接口
    // 默认都在context上挂上store
    Module.createInstance = createInstance;
    Module.mount = (props:any,element:any,superStore?:any)=>{
        return new Promise((resolve,reject)=>{
            if(moduleArguments.mount_async){
                moduleArguments.mount_async({
                    args:moduleArguments,
                    props:props,
                    element:element,
                    superStore:superStore
                    //transport:transport
                }).then((opts:IMountOpts)=>{
                    if(!opts || !opts.element || !opts.args)return;
                    let creation :IModuleCreation= {};
                    let component = createInstance(opts.props,opts.superStore,creation);
                    ReactDOM.render(component,element,()=>{
                        resolve(creation.$store);
                    });
                },(opts:IMountOpts)=>{
                    if(!opts || !opts.element || !opts.args)return;
                    let creation :IModuleCreation= {};
                    let component = createInstance(opts.props,opts.superStore,creation);
                    ReactDOM.render(component,element,()=>{
                        resolve(creation.$store);
                    });
                });
            }else {
                let creation :IModuleCreation= {};
                let component = createInstance(props,superStore,creation);
                ReactDOM.render(component,element,()=>{
                    resolve(creation.$store);
                });
            }
        });        
    };
    return Module;
}


function createReducer(creation:IModuleCreation,moduleArguments:IModuleArguments){ 
    // 行为/事件处理 reducers
    let reducer;

    let action_handlers = moduleArguments.action_handlers ||{};
    
    action_handlers['pop.create']=(state,loadableAction)=>{
        if(state.$mod.pop && state.$mod.pop.status!=='close') {
            throw new Error("already pop out a layer.");
        }
        loadableAction.status = 'creating';
        loadableAction.__REPLACEALL__ =true;
        loadableAction.super_store = creation.$store;
        //加载完成
        loadableAction.loaded = function(type,result){
            creation.$store.dispatch({type:'pop.load',load_content:result,ctype:type});
            
            //通知app更新导航条
            if(loadableAction.nav_text){
                creation.$store.root().dispatch({type:'nav.push',text:loadableAction.nav_text,info:result});
            }
            if(loadableAction.onload){
                if(typeof loadableAction.loaded.resolve==='function') loadableAction.onload.resolve(result);
                else loadableAction.onload(result);
            }
            //action.payload.resolve(result);
        }
        return {$mod:{pop:loadableAction,waiting:true}};
    };
    action_handlers['pop.load']=function(state,action){
        return {$mod:{waiting:false,pop:{
            status:'load',
            load_content:action.load_content,
            ctype:action.ctype,
            store:action.ctype=='module'? action.load_content:null
        }}}
    }
    action_handlers['pop.close']=function(state,action){
        let popState:IPopState = state.$mod.pop;
        let popStore = popState.store;
        let status = action.data;
        let result = {status:status,store:popStore};
        if(popStore.__close_handlers){
            for(let i = 0,j= popStore.__close_handlers.length;i<j;i++){
                let handler = popStore.__close_handlers.shift();
                handler.call(popStore,result);
            }
        }
        let onclose:any = popState.onclose;
        let id = popState.id;
        if(onclose){
            setTimeout(()=>{
                if(typeof onclose.resolve==='function') onclose.resolve(result);
                else if(typeof onclose ==='function')onclose(result);
                creation.$store.root().dispatch({type:'nav.pop',id:id});
            },0);
            
        }
        return {$mod:{pop:null}};
    }
    
    let customReducer = moduleArguments.reducer;
    if(customReducer){
        reducer = (oldState,action)=>{
            let newState = customReducer.call(creation.$store,oldState,action);
            if(!newState || newState === oldState){
                let handler = action_handlers[action.type];
                if(handler){
                    newState = handler.call(creation.$store,oldState,action);
                }else{
                    console.warn('disatch a unknown action. state will keep the same.',action);
                    newState = oldState;
                } 
            }
            return afterReducer(oldState,newState,action);
        };
    }else {
        reducer = (oldState,action)=>{
            let newState;
            let handler = action_handlers[action.type];
            if(handler){
                newState = handler.call(creation.$store,oldState,action);
            }else{
                console.warn('disatch a unknown action. state will keep the same.',action);
                newState = oldState;
            } 
            return afterReducer(oldState,newState,action);
        };
    }
    let afterReducer = (oldState,newState,action)=>{
        if(!newState) {
        console.error('reducer must return a state.',action);
        new Error('reducer must return a state.');
        } 
        if(action.payload && typeof action.payload.then==='function'){
            action.payload.then(   (result)=>{ if(result) creation.$store.dispatch(result); } );
        }
        if(newState.__REPLACEALL__){
            newState.__REPLACEALL__=undefined;
            return newState;   
        }
        newState= oldState!=newState ?mergeDiff(oldState,newState):oldState;
        if(newState.__REPLACEALL__) newState.__REPLACEALL__ =undefined;
        return newState;
    };
    return reducer;
}

function createMyStore(Component:IModuleCreation,creation:IModuleCreation,moduleArguments:IModuleArguments){
    const store =creation.$store =  createStore(creation.$reducer,creation.$state);
    store.super_store = creation.$super_store;
    store.$inDialog = creation.$state.$inDialog;
    store.__close_handlers;
    store.closing =function(handler:Function){
        if(!store.__close_handlers)store.__close_handlers=[];
        store.__close_handlers.push(handler);
        return ()=>{
            for(let i=0,j=store.__close_handlers.length;i<j;i++) {
                let h = store.__close_handlers.shift();
                if(h!==handler) store.__close_handlers.push(h);
            }
        }
    }
    
    store.root = function(){
        let p = store;
        while(p){
            if(!p.super_store) return p;
            else p = p.super_store;
        }
    }
    store.pop=function(param:IPopAction):IThenable{
        return new Promise((resolve,reject)=>{
            let action :any = {
                type:'pop.create',
                mod_state:param.data,
                url:param.url,
                ctype:'module'
            };
            if(param.fireOnLoaded) action.onload= resolve;
            else action.onclose = resolve;
            setTimeout(()=>store.dispatch(action),0);
            
        });
    }
    let api = Component.$api;
    if(!api){
        if(typeof moduleArguments.apiProvider==='function') api = Component.$api = moduleArguments.apiProvider(store);
    }
    if(api){
        for(let n in api){
            if(store[n]===undefined){
                store[n] = api[n];
            }else {
                console.warn('already has the same name member in store '+ n);
            }
        }
    }
    return store;
}

function createRedux(ModComponent:IModule,moduleArguments:IModuleArguments){
    
    // 状态到属性的映射 注入状态到属性中去 mapStateToProps
    let mapStateToProps= moduleArguments.mapStateToProps;
    if(!mapStateToProps){
        mapStateToProps =function(state)
        {
            return state;
        };
    }
    
    // 消息分发映射 注入消息工厂函数 到属性中去 
    let mapDispatchToProps = moduleArguments.mapDispatchToProps ;  
    let action_handlers = moduleArguments.action_handlers;
    if(action_handlers){
        if(!mapDispatchToProps){
            mapDispatchToProps =(dispatch)=>{
                let dispatchers = {};
                for(let actionName in action_handlers){
                    dispatchers[actionName] = ((actionName,dispatch)=>{
                        return (evtData,extra)=>dispatch({type:actionName,data:evtData,extra:extra});
                    })(actionName,dispatch);
                }
                return dispatchers;
            };
        }else{
            let map = mapDispatchToProps;
            throw new Error("Not implement.");
        }
    }  
    return connect(mapStateToProps,mapDispatchToProps)(ModComponent);
}

let createWrapComponent = function(Component):any{
    return class WrapComponent extends React.Component{
        props:any;
        context:any;
        modElement;
        waitingFrontElement;
        waitingElement;
        waiting_timer:any;
        tick_count:number;

        static contextTypes = {
            store: PropTypes.object,
        };

        render(){
            let state = this.props.$mod;
            let waiting;
            if(state.isWaiting){
                waiting = <div className='waiting' ref={(node)=>this.waitingElement=node} style={{position:'absolute'}}>
                    <div className='waiting-back'></div>
                    <div className='waiting-front' ref={(node)=>this.waitingFrontElement=node} style={{position:'absolute'}}><div className='waiting-message'>{state.waiting_message}</div></div>
                </div>;
                
            }else {
                if(this.waiting_timer) {clearInterval(this.waiting_timer);this.waiting_timer=0;}
            }
            let pop,main_hidden=false;
            if(state.pop && state.pop.status!=='close'){
                if(state.pop.popType==='dialog'){
                    pop = this.popDialog(state.pop);
                }else if(state.pop.popType==='layer'){
                    main_hidden = true;
                    pop = this.popLayer(state.pop);
                }else {
                    let vp = viewport();
                    if(vp==='xs'){ pop = this.popLayer(state.pop);main_hidden=true;}
                    else pop = this.popDialog(state.pop);
                }
                //state.pop['module.']
            }

            return <div className='module' ref={(node)=>this.modElement=node}>
                {waiting}
                <div className='module-component' style={{display:main_hidden?"none":''}}>
                <Component {...this.props} />
                </div>
                
                {pop}
            </div>
        }

        popDialog(popState){
            popState.$inDialog=true;
            let contentView = React.createElement(Loadable,popState,null);

            return <Modal title={this.props.title}
                visible={true}
                onOk={()=>this.props["pop.close"]('ok')}
                onCancel={()=>this.props["pop.close"]('cancel')}
                confirmLoading={false}
            >
                {contentView}
            </Modal>
        }

        popLayer(popState){
            return React.createElement(Loadable,popState,null);
        }

        componentDidMount(){ this.checkWaiting(); }

        componentDidUpdate(){this.checkWaiting(); }

        checkWaiting(){
            if(this.waiting_timer) clearInterval(this.waiting_timer);
            if(!this.waitingElement || !this.waitingFrontElement || !this.modElement) return;
            
            let cover = ()=>{
                if(++this.tick_count===200){
                    this.tick_count=0;
                    let p = this.modElement;
                    while(p){
                        if(p===document.body){
                            break;
                        }
                    }
                    if(!p){
                        clearInterval(this.waiting_timer);
                    }
                }
                this.waitingElement.style.width = this.modElement.offsetWidth + "px";
                this.waitingElement.style.height = this.modElement.offsetHeight + 'px';
                let x = (this.modElement.offsetWidth - this.waitingElement.clientWidth)/2;
                let y = (this.modElement.offsetHeight - this.waitingElement.clientHeight)/2;
                this.waitingFrontElement.left = x + "px";
                this.waitingFrontElement.top = y + "px";
            };
            this.waiting_timer  = setInterval(cover,100);
            cover();

        }

        componentWillUnmount(){
            alert('destory');
            if(this.waiting_timer) clearInterval(this.waiting_timer);
            let store = this.context.store;
            store.dispatch({type:'module.closing'});
            if(store.super_store) store.super_store.dispatch({type:'pop.closing'});
        }
    };
}





export let $mountable = define_module;
export let __module__ = define_module;

(define_module as any).__module__ 
=  (define_module as any).$module 
= (define_module as any).$mountable 
= define_module;

(define_module as any).Loadable = Loadable;

