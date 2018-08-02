
import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { createStore } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';
import { mergeDiff, viewport } from 'lib/utils';
import * as PropTypes from 'lib/react/prop-types';
import * as axios from 'lib/axios';
import {Modal,Icon} from 'lib/antd/antd';


declare var require:any;
declare var Promise : any;
declare var Deferred:any;
export interface IReactComponent{
    (props:any):any;
    refs?:any;
    props?:any;
    forceUpdate?:any;
    state?:any;
    context?:any;
    setState?:any;
}



export interface ILoadableState{
    id?:string;
    className?:string;
    style?:any;
    width?:any;
    height?:any;
    /**
     * 内容类型 : 必填
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,Component,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype?:string;

    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?:any;
    Component?:Function;

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
    parameters?:any;
    
    /**
     * 内容有变化后，会调用该函数
     *
     * @memberof IContentState
     */
    onContentChange?:(value,ctype)=>any;

    /**
     * iframe 完成检查。
     * 设定了这个值后， iframe是否完成要符合该reg检查
     *
     * @type {string}
     * @memberof ILoadableState
     */
    iframe_finish_url_regex ?:string;
    super_store?:any;
    //forceRefresh?:string;
    //作为action 使用
    type?:string;
    //menu 点击要刷新，即使是url一样也要刷新，但render并不总刷新
    tick?:number;
    is_workarea?:boolean;
}



export class Loadable extends React.Component{
    refs:any;
    props:ILoadableState;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;

    cnode:HTMLElement;
    tick:number;
    loaded_url?:string;
    loaded_content?:any;
    rszTimer?:any;
    _w:number;
    _h:number;

    constructor(props:ILoadableState){
        super(props);
    }

    ctype(){
        let ctype = this.props.ctype;
        if(ctype!==undefined)return ctype;
        let content = this.props.content;
        if(content!==undefined){
            if(content._reactInternalInstance) return 'v-node'; 
            if(content.tagName!==undefined && content.nodeType!==undefined) return 'dom';
            if(typeof content==='string') return 'html';
            return 'text';
        }
        let url = this.props.url;
        if(url){
            if(/(.html?$)|(.html?\?)/.test(url)) return 'iframe';
            if(/.js$/.test(url)) return 'module';
        }
        
    }

    render(){
        let ctype = this.ctype();
        if(!ctype) {console.warn("无法确定ctype,不显示任何东西",this.props);return null;}
        let props  = this.props;
        let vnode;
        if(props.Component){
            if(this.loaded_content!=props.Component){
                if(props.onContentChange) setTimeout(()=>props.onContentChange.call(this.cnode,this.loaded_content,ctype),0); 
                
            }
            let MyComponent :IReactComponent= this.props.Component as IReactComponent;
            return <MyComponent {...this.props.parameters} ref={(node)=>this.loaded_content=node}/>
        }
        if(ctype==='v-node' || ctype==='text'){
            let content = props.content||"";
            if(this.loaded_content!=content){
                if(this.props.onContentChange) setTimeout(()=>props.onContentChange.call(this.cnode,this.props.content,ctype),0); 
                this.loaded_content= content;
            }
            return <div>{content}</div>;
        } 
        if(ctype==='html')  {
            let content = props.content||"";
            if(this.loaded_content!=content){
                if(this.props.onContentChange) setTimeout(()=>props.onContentChange.call(this.cnode,this.props.content,ctype),0); 
                this.loaded_content=content;
            }
            return <div id={props.id ||null} className={props.className||null} style={props.style||null} dangerouslySetInnerHTML={{__html:props.content}}></div>
        }
        vnode = <div id={props.id ||null} className={props.className||null} style={props.style||null} ref={(node) => this.cnode = node} ></div>;
        
        if(ctype==='dom') {
            this.componentDidMount = this.componentDidUpdate = ()=>{
                let content = this.props.content;
                if(this.cnode.firstChild!=content){
                    this.cnode.innerHTML ="";this.cnode.appendChild(this.props.content);
                    if(this.props.onContentChange) this.props.onContentChange.call(this.cnode,this.props.content,ctype);
                }
                
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
        if(this.loaded_url && this.loaded_url==this.props.url && this.props.tick == this.tick){
            return;
        }
        this.tick = this.props.tick;
        require(this.loaded_url=this.props.url).then((mod)=>{
            let mod_element = document.createElement('div');
            this.cnode.innerHTML = "";
            this.cnode.appendChild(mod_element);
            let parameters = this.props.parameters || {};
            if(this.props.is_workarea) parameters.__$is_workarea__=true;
            if(mod.createInstance && mod.mount){
                mod.mount(parameters,mod_element,this.props.super_store).then((store)=>{
                    store.$modname = this.props.url;
                    this.loaded_content = store;
                    if(this.props.onContentChange) this.props.onContentChange.call(this.cnode,store,'store');
                });
            }else if(typeof mod ==='function'){
                this.loaded_content = new mod(parameters,mod_element);
                ReactDOM.render(this.loaded_content,mod_element,this.props.parameters);
                if(this.props.onContentChange) this.props.onContentChange.call(this.cnode,this.loaded_content,'react');
            }
        });
    }
    
    
    renderIframe(){
        if(this.loaded_url && this.loaded_url==this.props.url && this.props.tick == this.tick){
            return;
        }
        this.tick = this.props.tick;
        let style = "border:0;padding:0;margin:0;";
        let width = this.props.width;
        if(width) style += "width:" + width + ";";
        else style += "width:100%;";
        let height = (this.props as any).height;
        if(height) style+="height:" + height;

        //if(this.props.width)
        let html = "<iframe style='"+style+"' border='0' "+(height?"height='"+height+"'":"") +(width?" width='"+width+"'":" width='100%'")+"></iframe>";
        this.cnode.innerHTML = html;
        let iframe = this.cnode.firstChild as HTMLIFrameElement;
        iframe.onload = ()=>{
            if(this.props.onContentChange) this.props.onContentChange.call(iframe,iframe,"iframe");
        };
        let url = this.loaded_url = this.props.url;
        if(url.indexOf('?')<0) url += '?';
        else url += '&';
        iframe.src= url += '_nocache='+Math.random();
        let fill = ()=>{
            if(this._w!=this.cnode.clientWidth)iframe.width =(this._w = this.cnode.clientWidth)+'px';
            if(this._h !=this.cnode.clientWidth )iframe.height =(this._h = this.cnode.clientHeight)+'px';
        };
        //if(this.rszTimer) clearInterval(this.rszTimer);
        //this.rszTimer = setInterval(fill,100);
        //fill();
    }
    renderPage(){
        if(this.loaded_url && this.loaded_url==this.props.url && this.props.tick == this.tick){
            return;
        }
        axios.get(this.props.url).then((response)=>{
            this.cnode.innerHTML=response.data;
            if(this.props.onContentChange) this.props.onContentChange.call(this.cnode,response.data,'html');
        });
    }
}



export interface IModuleDefination{
    /**
     * 默认的状态值
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    state?:any,

    /**
     * IN 消息处理函数
     *  它会跟action_handlers合并成最终的reducer
     *
     * @memberof IModuleDefination
     */
    reducer?:(state:any,action:any)=>any;


    /**
     * IN 消息处理器
     * 它会跟reducer合并成最终的reducer
     * 
     * @memberof IModuleDefination
     */
    actions?:{[index:string]:(state:any,action:any)=>any};

   


    /**
     * IN/OUT
     *  
     * 定义一些api
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    //transport?:any;

    api?:(store)=>{[index:string]:Function};

    
    /**
     * IN / OUT 状态到属性的映射，
     * 如果不写，就是state全部进入到props去
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    mapStateToProps?:any;

    /**
     * 把action工厂函数作为事件处理程序，注入到props中
     * 如果不填，框架会根据action_handlers自动生成一个
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    mapDispatchToProps?:any;    

    
    //onCreating?:(creation:IModuleCreation)=>void;
    initialize?:(props:any)=>IThenable|any;
    
}

export interface IMountOpts{
    props:any;element:any;superStore?:any;transport?:any;
    args:IModuleDefination;
    
}
export interface IModule{
    //创建模块实例
    createInstance(state:any,superStore?:any): React.Component;
    mount(stateOrComponent:any,element:any,superStore?:any):IThenable;
}
export interface IReduxModule extends IModule{
    (props:any):any;
    $reducer?:(state:IModState,action:any)=>IModState;
    $api?:{[index:string]:Function};
    $Wrap?:any;
    contextTypes?:{ store: PropTypes.object};
}


export interface IModuleInstance{
    $store():any;
    $moduleState(path:string|object,value?:any):any;
    $closing?:(handler:Function)=>any;
    $app?:()=>any;
    $root?:()=>any;
    $navigate?:(url:string,ctype?:any,parameters?:any)=>IThenable;
    $waiting?:(text:string)=>void;
    $modal?:(opts:IModalAction)=>IThenable;
    $dialog?:(opts:IModalAction)=>IThenable;
    $messageBox?:(text?:string,caption?:string,icon?:string)=>IThenable;
    $confirm?:(text?:string,caption?:string,icon?:string)=>IThenable;
    $get?:(url:string,data?:any,waiting?:string)=>IThenable;
    $post?:(url:string,data?:any,waiting?:string)=>IThenable;
    $validate?:(validStates:any,langs?:any,state?:any)=>IThenable;
}

export interface IModalAction {
    type?:string;
    id?:string;
    title?:string;
    nav_name?:string;
    className?:string;
    width?:any;
    height?:any;
    /**
     * 内容类型 : 必填
     * 远程类型 : module,iframe,page
     * 本地类型 : v-node,Component,dom,html,text
     * @type {string}
     * @memberof IContentState
     */
    ctype?:string;

    /**
     * 内容
     * 类型为本地类型时，该值必须有
     * @type {*}
     * @memberof IContentState
     */
    content?:any;
    Component?:Function;

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
    parameters?:any;
    
    /**
     * 内容有变化后，会调用该函数
     *
     * @memberof IContentState
     */
    onContentChange?:(value,ctype)=>any;

    /**
     * iframe 完成检查。
     * 设定了这个值后， iframe是否完成要符合该reg检查
     *
     * @type {string}
     * @memberof ILoadableState
     */
    iframe_finish_url_regex ?:string;
    
    /**
     *  弹出的类型 
     * layer dialog auto
     * 默认auto
     * @type {string}
     * @memberof IModalState
     */
    modalType?:string;
    /**
     *  on close
     *
     * @type {(IDeferred|Function)}
     * @memberof IModalState
     */
    onclose?:IDeferred|Function;

    /**
     *  on load
     *  content_change
     * @type {(IDeferred|Function)}
     * @memberof IModalState
     */
    onload?:IDeferred|Function;

    callbackOnLoad?:boolean;
}

export interface IModalState extends IModalAction{

    /**
     * creating 准备加载
     * loaded 已经完成
     * closing 正在关闭
     * closed
     *
     * @type {string}
     * @memberof IModalState
     */
    status?:string;
    

    /**
     * 内部使用，dialog函数等会使用
     *
     * @type {IDeferred}
     * @memberof IModalState
     */
    thenable?:IDeferred;

    /**
     * 内部使用，调用then的时机
     * closed/loaded
     *
     * @type {string}
     * @memberof IModalState
     */
    thenType?:string;

    
    store?:any;
    
    
}
export interface IMaskState{
    type:string;
    caption?:string;
    message:string;
    //是否独占，不会显示其他的元素
    exclusive?:boolean;
    onclose?:Function;
}
export interface IModState{
    $modal?:IModalState;
    $mask?:IMaskState;
    __$is_workarea__?:boolean|string;
}

export interface IModuleCreation{
    super_store?:any;
    state?:any;
    reducer?:(state:IModState,action:any)=>IModState;
    api?:{[index:string]:Function};
    actions?:any;
    store?:any;
    Wrap?:any;
    initialize?:(props:any)=>IThenable;
    /**
     * 最终生成的Provider包含的 着的组件
     *
     * @type {*}
     * @memberof IModuleDefination
     */
    Redux?:any;
    instance?:React.Component;
}

export default function define_module(Component:any):IModule{
    let moduleArguments : IModuleDefination = Component;
    
    let createInstance= (props:any,creation?:IModuleCreation):React.Component =>{
        creation ||(creation = {});
        //creation.super_store = superStore;
        (props||(props={}));

        // 状态
        let state;
        if(typeof moduleArguments.state==='function') state = moduleArguments.state(props);
        else state = moduleArguments.state;
        //props优先
        state = mergeDiff(state,props);
        creation.state = state;
        
        creation.reducer = Component.$reducer || (Component.$reducer = createReducer(creation,moduleArguments));
        
        // 状态管理 store
        const store =creation.store =  createStore(creation.reducer,creation.state);
        store.super_store = creation.super_store;
        store.is_inDialog = creation.state.$inDialog;
        store.initialize = moduleArguments.initialize;
        let p = store;
        while(p){
            if(!p.super_store) break;
            else p = p.super_store;
        }
        store.root = p;

        injectApi(Component,creation);

        let Wrap = Module.$Wrap || (Module.$Wrap = createWrapComponent(Component));

        let Redux = creation.Redux = createRedux(Wrap,moduleArguments,creation);
          
        let instance = creation.instance = <Provider store={store}>
            <Redux />
        </Provider>;
        creation.instance = instance;
        //if(moduleArguments.onCreating) moduleArguments.onCreating(creation);
        return instance;
    };
    let Module :IReduxModule = Component as IReduxModule;
    // 默认都在context上挂上store
    Module.contextTypes={ store: PropTypes.object};
    // 接口
    // 默认都在context上挂上store
    Module.createInstance = createInstance;
    Module.mount = (props:any,element:any,superStore?:any)=>{
        return new Promise((resolve,reject)=>{
            let creation :IModuleCreation= {super_store:superStore};
            let component = createInstance(props,creation);
            ReactDOM.render(component,element,()=>{
                resolve(creation.store);
            });
        });        
    };
    return Module;
}



function createReducer(creation:IModuleCreation,moduleArguments:IModuleDefination){ 
    // 行为/事件处理 reducers
    let reducer;

    let action_handlers =creation.actions ={... moduleArguments.actions} ||{};
    action_handlers["$module.init"] = (state,action)=>{
        if(!action.state){
            return {$mask:null};
        }
        action.state.$mask=null;
        return action.state;
    }
    /*action_handlers["$module.setState"]=(state,action)=>{
        let newState = action.state;
        if(newState!==undefined)return newState;
        if(action.path){
            let accessor = objectAccessor(action.path);
            newState = accessor.setValue({},action.value);
        }
        return newState;
    }*/
    
    action_handlers['$modal.show']=(state:IModState,modalAction:IModalAction)=>{
        if(state.$modal && state.$modal.status!=='close') {
            throw new Error("already pop out a layer.");
        }
        let modalState :IModalState = modalAction as IModalState;
        let loadableState:ILoadableState = modalAction as ILoadableState;
        modalState.status = 'creating';
        (modalState as any).__REPLACEALL__ =true;
        loadableState.super_store = creation.store;
        //加载完成
        modalAction.onContentChange = function(result,type){
            creation.store.dispatch({type:'$modal.load',load_content:result,ctype:type});
            
            //通知app更新导航条
            if(modalState.nav_name){
                creation.store.root().dispatch({type:'nav.push',text:modalState.nav_name,info:result});
            }
            if(modalState.onload){
                if(typeof (modalState.onload as any).resolve==='function') (modalState.onload as IDeferred).resolve(result);
                else (modalState.onload as Function)(result);
            }
            //action.payload.resolve(result);
        }
        return {$modal:modalState};
    };
    action_handlers['$mask.show']=function(state,action){
        action.__REPLACEALL__=true;
        action.type = action.icon;
        return {$mask:action};
    }
    action_handlers['$mask.hide']=function(state:IModState,action){
        if(state.$mask.onclose) state.$mask.onclose(state);
        return {$mask:null};
    }
    action_handlers['$modal.load']=function(state,action){
        return {
            $mask:null,
            $modal:{
                status:'load',
                load_content:action.load_content,
                ctype:action.ctype,
                store:action.ctype=='module'? action.load_content:null
            }
        };
    };
    action_handlers['$modal.close']=function(state,action){
        let popState:IModalState = state.$modal;
        let popStore = popState.store;
        let result = {status:action.status,state:popStore?popStore.getState():popState};
        if(popStore && popStore.__close_handlers){
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
                else if(typeof onclose ==='function') onclose(result);
                creation.store.root.dispatch({type:'nav.pop',id:id});
            },0);
            
        }
        return {$modal:null};
    }
    
    let customReducer = moduleArguments.reducer;
    if(customReducer){
        reducer = (oldState,action)=>{
            let newState = customReducer.call(creation.store,oldState,action);
            if(!newState || newState === oldState){
                let handler = action_handlers[action.type];
                if(handler){
                    newState = handler.call(creation.store,oldState,action);
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
                newState = handler.call(creation.store,oldState,action);
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
            action.payload.then(   (result)=>{ if(result) creation.store.dispatch(result); } );
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


function injectApi(Component:IModuleDefination,creation:IModuleCreation){
    const store =creation.store;
    store.context = {store:store};
    let apiContainer:IModuleInstance = (Component as Function).prototype;
    if(!(Component as any).__api_injected){
        (Component as any).__api_injected = true;
        if(Component.api){
            for(let n in Component.api){
                apiContainer[n] = Component.api[n];
            }
        }
        /*
        apiContainer.$moduleState = function(path,value){
            if(path===undefined) return this.context.store.getState();
            if(typeof path==='string'){
                if(value===undefined) {
                    let state =  this.context.store.getState();
                    let accessor = objectAccessor(path);
                    return accessor.getValue(state);
                }else {
                    this.context.store.dispatch({
                        type:"$module.setState",
                        path:path,
                        value:value
                    });
                }
            }else{
                this.context.store.dispatch({
                    type:"$module.setState",
                    state:path
                });
            }
        }*/
        

        apiContainer.$closing =function(handler:Function){
            let store = this.context.store;
            if(!store.__close_handlers)store.__close_handlers=[];
            store.__close_handlers.push(handler);
            return ()=>{
                for(let i=0,j=store.__close_handlers.length;i<j;i++) {
                    let h = store.__close_handlers.shift();
                    if(h!==handler) store.__close_handlers.push(h);
                }
            };
        }
        apiContainer.$store = function(){ return this.context.store;}
        apiContainer.$waiting = function(msg:string|boolean,state?:any):void{
            let self = this;
            if(state) state.$mask = {content:msg};
            else setTimeout(()=>self.context.store.dispatch({type:"$mask.show",content:msg}),0);
        }

        apiContainer.$app = apiContainer.$root = function(){
            let p = this.context.store;
            while(p){
                if(!p.super_store) break;
                else p = p.super_store;
            }
            this.$root =this.$app = ()=>p;
        }
        
        apiContainer.$navigate = function(url:string,ctype?:any,parameters?:any){
            if(parameters===undefined){ parameters = ctype; ctype=undefined;}
            return this.$app().navigate(url,ctype,parameters);
            
        }
        apiContainer.$modal=function(action:IModalAction):IThenable{
            return new Promise((resolve,reject)=>{
                action.type = "$modal.show";
                action.modalType = null;
                if(action.callbackOnLoad) action.onload= resolve;
                else action.onclose = resolve;
                setTimeout(()=>this.context.store.dispatch(action),0);
                
            });
        }
        apiContainer.$dialog=function(action:IModalAction):IThenable{
            return new Promise((resolve,reject)=>{
                action.type = "$modal.show";
                action.modalType = "dialog";
                if(action.callbackOnLoad) action.onload= resolve;
                else action.onclose = resolve;
                setTimeout(()=>this.context.store.dispatch(action),0);
                
            });
        }

        apiContainer.$messageBox=function(text?:string,caption?:string,icon?:string):IThenable{
            if(icon===undefined){
                icon = caption;caption=null;
            }
            return new Promise((resolve,reject)=>{
                let action = {
                    type:"$mask.show",
                    caption:caption,
                    message:text,
                    icon:icon,
                    onclose:resolve
                };
                setTimeout(()=>store.dispatch(action),0);
                
            });
        }
        apiContainer.$confirm=function(text?:string,caption?:string,icon?:string):IThenable{
            return new Promise((resolve,reject)=>{
                let action:any = {};
                action.type = "$modal.show";
                action.modalType = "dialog";
                action.ctype = "html";
                action.content =text;
                if(action.callbackOnLoad) action.onload= resolve;
                else action.onclose = resolve;
                setTimeout(()=>this.context.store.dispatch(action),0);
                
            });
        }

        apiContainer.$validate = function(data:any,validator:Function,lngs?:any,returnHtml?:boolean){
            let validStates = validator(data);
            lngs ||(lngs={});
            let html = "<ul>";
            let c = 0;
            for(let n in validStates){
                let vrs = validStates[n];
                if(vrs!==true) {
                    html += `<li><label>${lngs[n]||n}</label><span>${vrs}</span></li>`;
                    c++;
                }
            }
            html += "</ul>";
            if(c){
                if(returnHtml===true) return html;
                return this.$messageBox(html,lngs["validation"]||"验证","error");
                
            }
            return null;
        }

        apiContainer.$get = function(url:string,data?:any,waiting?:string):IThenable{
            if(waiting) this.waiting(waiting);
            let me = this;
            return new Promise((resolve,reject)=>{
                let urls = require.resolveUrl(url);
                doAjax(me,"get",url,urls,[],data,waiting,resolve,reject);
            });
        }
        apiContainer.$post = function(url:string,data?:any,waiting?:string):IThenable{
            if(waiting) this.waiting(waiting);
            let me = this;
            return new Promise((resolve,reject)=>{
                let urls = require.resolveUrl(url);
                doAjax(me,"post",url,urls,[],data,waiting,resolve,reject);
            });
        }
    }
    if(Component.api){
        for(let n in Component.api){
            store[n] = Component.api[n];
        }
    }
    let apiKeys = ["$waiting","$app","$root","$navigate","$modal","$get","$post","$messageBox","$confirm","$dialog","$validate"];
    for(let i in apiKeys){
        let key = apiKeys[i];
        store[key] = apiContainer[key];
    }
}

function doAjax(me,method,rawUrl,urls,visited,data,waiting,resolve,reject){
    let url = urls.shift();
    if(!url){
        console.error("ajax失败，无法访问urls",visited);
        resolve({message:"ajax失败，无法访问urls",urls:visited});
        return;
    }
    let fn = axios[method];
    fn.call(axios,url,data).then((result)=>{
        if(result.statusCode===401){
            me.$root().auth().then(()=>{
                me['$' +method].call(me,rawUrl,data,waiting);
            });
            return;
        }
        if(waiting)this.waiting(false);
        handleAjaxResult(me,result,resolve,reject);
    },(e)=>{
        visited.push(url);
        doAjax(me,method,rawUrl,urls,visited,data,waiting,resolve,reject);
    });
}
function handleAjaxResult(me,result,resolve,reject){
    if(!result.data){
        console.warn("返回的数据格式不正确，缺乏data字段");
        me.$messageBox("服务器错误:" + result.message,"warning");
        reject(result);
        return;
    }
    let remoteData = result.data;
    if(remoteData.StatusText==='error'){
        //let errorMessage = remoteData.Message
        me.$messageBox(remoteData.Message || "服务器返回一个错误，请联系管理员","error").done(()=>reject(remoteData));
        return;
    }
    let complete =()=>{
        if(remoteData.ClientAction){
            me.context.store.dispatch(remoteData.ClientAction,remoteData.Data);
        }else {
            let viewData = remoteData.ViewData;
            if(viewData) resolve("#useApply",[remoteData.Data,remoteData.ViewData]);
            else resolve(remoteData.Data);
        }
    };
    if(remoteData.Message){
        me.$messageBox(remoteData.Message ,"success").done(complete);
    }else complete();
}

function createRedux(ModComponent:IModule,moduleArguments:IModuleDefination,creation:IModuleCreation){
    
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
    let action_handlers = creation.actions;
    if(action_handlers){
        if(!mapDispatchToProps){
            mapDispatchToProps =(dispatch)=>{
                let dispatchers = {};
                for(let actionName in action_handlers){
                    dispatchers[actionName] = ((actionName,dispatch)=>{
                        return (evtData)=>{
                            if(evtData.preventDefault) {
                                return dispatch({type:actionName,event:evtData});
                            }
                            let action;
                            try{
                                evtData.type= actionName;action=evtData;
                            }catch(ex){
                                action = {...evtData,type : actionName};
                            }
                            dispatch(action);
                        };
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
        props:IModState;
        context:any;
        modElement;
        waitingFrontElement;
        waitingElement;
        waiting_timer:any;
        tick_count:number;
        disposed:boolean;
        x:number;y:number;

        static contextTypes = {  store: PropTypes.object ,page: PropTypes.object };

        constructor(props){
            super(props);
        }

        render(){
            let state = this.props;
            let store =this.context.store;
            
            let waiting;
            let maskState:IMaskState = state.$mask;
            if(store.initialize){
                maskState = {type:null,message:null,exclusive :true};
            }
            if(maskState){
                
                let maskCss;
                let popMessage;
            
                if(maskState.type){
                    let mtype = maskState.type||'info';
                    maskCss = "mask " + mtype;
                    let lngs = {'warning':"警告",'success':"成功",'error':'错误',"info":"信息"};
                    let icon;
                    switch(mtype){
                        case "error": icon  =<Icon type="close-circle-o" />;break;
                        case "info": icon = <Icon type="info-circle-o" />;break;
                        case "success": icon = <Icon type="check-circle-o" />;break;
                        case "warning":icon = <Icon type="warning" />;break;
                        default :icon = <Icon type="info-circle-o" />;
                    }
                    let cls=`pop-message-box`;
                    let onclick = ()=>{
                        this.context.store.dispatch({type:"$mask.hide"});
                    };
                    popMessage = <div className={cls}>
                        <div className='pop-message-header'>
                            <div className='pop-message-icon'>{icon}</div>
                            <div className='pop-message-caption'>{maskState.caption||lngs[mtype]}</div>
                        </div>
                        <div className='pop-message-body'>
                            <div className='pop-message-content' dangerouslySetInnerHTML={{__html:maskState.message}}></div>
                        </div>
                        <div className='pop-message-footer'><Icon type="close" onClick={onclick} /></div>
                    </div>
                }else {
                    maskCss ="mask waiting";
                    popMessage = <div className='pop-message'>{maskState.message? maskState.message :"加载中..."}</div>;
                }
                waiting = <div className={maskCss} ref={(node)=>this.waitingElement=node} style={{position:'absolute'}}>
                    <div className='mask-back'></div>
                    <div className='mask-front' ref={(node)=>this.waitingFrontElement=node} style={{position:'absolute'}}>
                        {popMessage}
                    </div>
                </div>;
                
            }else {
                if(this.waiting_timer) {clearInterval(this.waiting_timer);this.waiting_timer=0;}
            }

            if(store.initialize){
                let init = this.context.store.initialize;
                store.initialize = null;
                var rs = init.call(store,{...state});
                if(rs){
                    if(typeof rs.then==='function'){
                        rs.then((newState)=>{
                            store.dispatch({type:"$module.init",state:newState});
                        },(e)=>{
                            store.dispatch({type:"$mask.show",icon:"error",message:e});
                        });
                    }else{
                        state = mergeDiff(state,rs);
                    }
                }else {
                    maskState = this.props.$mask;
                }
                
            }
            if(maskState && maskState.exclusive){
                return <div className='module' ref={(node)=>this.modElement=node} style={{position:"relative"}}>
                {waiting}
            </div>
            }
            let modalState = state.$modal,main_hidden=false;
            let modal;
            if(modalState && modalState.status!=='close'){
                let modalType = modalState.modalType;
                
                if(modalType==='dialog'){
                    modal = this.popDialog(modalState);
                }else if(modalType==='layer'){
                    main_hidden = true;
                    modal = this.popLayer(modalState);
                }else {
                    let vp = viewport();
                    if(vp==='xs'){ modal = this.popLayer(modalState);main_hidden=true;}
                    else modal = this.popDialog(modalState);
                }
                //state.pop['module.']
            }
            let componentInstance = <Component {...state} />;
            store.page = this.context.page = componentInstance;

            return <div className='module' ref={(node)=>this.modElement=node} style={{position:"relative"}}>
                {waiting}
                <div className='module-component' style={{display:main_hidden?"none":''}}>
                {componentInstance}
                </div>
                {modal}
            </div>
        }

        popDialog(popState){
            popState.$inDialog=true;
            let contentView = React.createElement(Loadable,popState,null);

            return <Modal title={popState.title}
                visible={true}
                onOk={
                    ()=>{
                        this.props["$modal.close"]({status:'ok'});
                    }
                }
                onCancel={()=>this.props["$modal.close"]({status:'cancel'})}
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
                        return;
                    }
                }
                this.waitingElement.style.width = this.modElement.offsetWidth + "px";
                
                let x :any= (this.waitingElement.offsetWidth - this.waitingFrontElement.clientWidth)/2; 
                if(!this.x  || Math.abs(this.x-x)>3) {
                    this.x = x;
                }
                let y;
                if(this.props.__$is_workarea__){
                    let h = Math.max(document.documentElement.clientHeight,document.body.clientHeight);
                    y = (h- this.waitingFrontElement.clientHeight) /2;
                    y += Math.max(document.body.scrollTop,document.documentElement.scrollTop);
                    if(this.props.__$is_workarea__=='root'){
                        this.waitingElement.style.height = h + 'px';
                    }else{
                        this.waitingElement.style.height = this.modElement.offsetHeight + 'px';
                        let header = document.getElementById("layout-header");
                        if(header)y -= document.getElementById("layout-header").clientHeight;
                    }
                    
                    
                }else{
                    this.waitingElement.style.height = this.modElement.offsetHeight + 'px';
                    y = (this.waitingElement.offsetHeight - this.waitingFrontElement.clientHeight)/2;
                }
                if(!this.y  || Math.abs(this.y-y)>3) {
                    this.y = y;
                }
                this.waitingFrontElement.style.left = this.x + "px";
                this.waitingFrontElement.style.top = this.y + "px";
            };
            this.waiting_timer  = setInterval(cover,100);
            cover();

        }

        componentWillUnmount(){
            if(this.waiting_timer) {clearInterval(this.waiting_timer); this.waiting_timer=0;}
            if(this.disposed) return;
            let store = this.context.store;
            store.dispatch({type:'$module.closing'});
            if(store.super_store) store.super_store.dispatch({type:'$modal.closing'});
            this.disposed=true;
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

