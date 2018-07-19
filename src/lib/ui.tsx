
declare var require:Function;
import * as axios from 'lib/axios';
import React,{Component} from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as PropTypes from 'lib/react/prop-types';
import { createStore,applyMiddleware } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';
import { mergeDiff } from 'lib/utils';
import antd,{Icon,Tooltip,Checkbox,Alert,Button,Collapse} from 'lib/antd/antd';


export let $app:any;
export let __setApp = (app)=>{$app=app;};
//事件
let div:HTMLElement = document.createElement("div") as HTMLElement;
let _attach : (elem,evt,handler)=>void;
let _detech : (elem,evt,handler)=>void;
if((div as any).attachEvent){
    _attach = (elem,evt,handler)=>elem.attachEvent('on' + evt,handler);
    _detech = (elem,evt,handler)=>elem.detechEvent('on' + evt,handler);
}else {
    _attach = (elem,evt,handler)=>elem.addEventListener( evt,handler,false);
    _detech = (elem,evt,handler)=>elem.removeEventListener( evt,handler,false);
}
export let attach = _attach;
export let detech = _detech;

export let getCookie:(name:string)=>string =  function (name:string)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else return null;
}

export let setCookie:(name:string,value?:any,time?:string)=>any =  function (name:string,value?:any,time?:string)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + (exp as any).toGMTString();
}
export function delCookie(name:string)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+(exp as any).toGMTString();
}
function getsec(str)
{
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")return str1*1000;
    else if (str2=="h")return str1*60*60*1000;
    else if (str2=="d")return str1*24*60*60*1000;
}

//获取盒模型
export let getBox  = function(elem?:any){
    if(!elem){
        let w= window.innerWidth || document.documentElement.clientWidth;
        let h= window.innerHeight || document.documentElement.clientHeight;
        return {x:0,y:0,width:w,height:h};
    }
    let x=0,y=0;
    let w = elem.clientWidth,h=elem.clientHeight;
    while(elem){
        x+=elem.offsetLeft;
        y+=elem.offsetTop;
        if(elem===document.body)break;
        elem = elem.offsetParent;
    }
    return {x:x,y:y,width:w,height:h};
}

//媒体查询
let viewportChangeHandlers:Array<(type)=>void>=[];
let viewports = {
    "lg":1200,
    "md":992,
    "sm":768
};
export interface IViewport{
    w:number;
    h:number;
    name:string;
}
export let viewport =  function(onChange?:((type)=>void)|boolean):string| IViewport{
    if(onChange && typeof onChange ==='function') {
        viewportChangeHandlers.push(onChange);
    }
    if((onChange as boolean)===true) return view_port;
    return view_port.name;
    
}
let view_port;
let viewportResizeHandler = ()=>{
    let w= window.innerWidth || document.documentElement.clientWidth;
    let h= Math.max(document.body.clientHeight,Math.max(window.innerHeight ,document.documentElement.clientHeight));
    //console.log("rsz",window.innerHeight,document.documentElement.clientHeight,document.body.clientHeight,h);
    let vt;
    for(let t in viewports){
        if(w>=viewports[t]) {
            vt=t;break;
        }
    }
    vt={w:w,h:h,name:vt||'xs'};
    
    if(!view_port || view_port.name!=vt.name){
        view_port = vt;
        for(let i=0,j=viewportChangeHandlers.length;i<j;i++){
            let handler = viewportChangeHandlers.shift();
            let rs = handler.call(window,vt);
            if(rs!=='#remove') viewportChangeHandlers.push(handler);
        }
    }else view_port = vt;
};
attach(window,'resize',viewportResizeHandler);
viewportResizeHandler();

export interface IMountArguments{
    model?:any,
    mapStateToProps?:any;
    mapDispatchToProps?:any;
    action_handlers?:{[index:string]:(state:any,action:any)=>any};
    store?:any;
    onCreating?:(mountArguments:IMountArguments)=>void;
    superStore?:any;
    transport?:any;
    targetElement?:any;
    Redux?:any;
    apiProvider?:(store)=>{[index:string]:Function};
}
export interface IOnCreateInstanceEvent{
    Component?:any;
    props?:any;
    $superStore?:any;
    model?:any;
    mapStateToProps?:any;
    mapDispatchToProps?:any;
    controller?:{};
}

export let $mountable = (Component:any,mountArguments?:IMountArguments)=>{
    mountArguments ||(mountArguments={});
    
    (Component as any).$mount = (props:any,targetElement:HTMLElement,superStore,transport?:any)=>{
        (props||(props={}));
        transport ||(transport={'__transport__':"$mount("+Component.toString()+")"});
        mountArguments.transport = transport;
        mountArguments.transport.superStore = transport.superStore = superStore;

        let initModel;
        if(typeof mountArguments.model==='function') initModel = mountArguments.model(props,transport);
        else initModel = mountArguments.model;
        initModel = mergeDiff(props,initModel);
        let action_handlers = mountArguments.action_handlers;
        let reducers = action_handlers?(model,action)=>{
            let handler = action_handlers[action.type];
            let newModel;
            if(handler){
                newModel =handler.call(store,model,action);
                if(action.payload && typeof action.payload.then==='function'){
                    action.payload.then(   (result)=>{ store.dispatch(result); } );
                }
                let nextState= mergeDiff(model,newModel);
                if(nextState.__REPLACEALL__) nextState.__REPLACEALL__ =undefined;
                return nextState;
            } 
            console.warn('disatch a unknown action',action);
            return model;
        }:(state,action)=>state;

        const store =mountArguments.store = transport.store = transport.store || createStore(reducers,initModel);
        //store.superStore = superStore;
        let mapStateToProps= mountArguments.mapStateToProps;
        if(!mapStateToProps){
            mapStateToProps =(state)=>{return {$store:store,$transport:transport,$superStore:superStore,...state}};
        }else {
            let map = mapStateToProps;
            mapStateToProps = (state)=>{
                let newState = map(state);
                return {$store:store,$transport:transport,$superStore:superStore,...newState}
            };
        }
        store.superStore = superStore;
        store.transport = transport;
        store.modname = transport.module;
        store.root = function(){
            let p = store;
            while(p){
                if(!p.superStore) return p;
                else p = p.superStore;
            }
        }
        let mapDispatchToProps = mountArguments.mapDispatchToProps ;  
        if(action_handlers){
            if(!mapDispatchToProps){
                mapDispatchToProps = (dispatch)=>(dispatch)=>{
                    let dispatchers = {};
                    for(let actionName in action_handlers){
                        dispatchers[actionName] = ((actionName,actionHandler,dispatch)=>{
                        return (evtData,extra)=>dispatch({type:actionName,data:evtData,extra:extra});
                        })(actionName,action_handlers[actionName],dispatch);
                    }
                    return dispatchers;
                };
            }else{
                let map = mapDispatchToProps;
                throw new Error("Not implement.");
            }
        }  
        
        if(typeof mountArguments.apiProvider==='function'){
            let api = mountArguments.apiProvider(store);
            for(let n in api){
                if(store[n]===undefined){
                    store[n] = api[n];
                }else {

                }
            }
        }
        
        let Redux = mountArguments.Redux = connect(mapStateToProps,mapDispatchToProps)(Component);
        mountArguments.targetElement = targetElement;
        if(mountArguments.onCreating) mountArguments.onCreating(mountArguments);
        ReactDOM.render(
            <Provider store={store}>
                <Redux />
            </Provider>,
            targetElement
        );
    }
    return Component;
}

export function eachChildren(node,handler:(node:any,index:number,parent:any,deep?:number)=>string|boolean,deep?:number){
    let children = node.props.children;
    if(!children) return;
    if(!deep) deep=1;
    if(children.length!==undefined){
        let nextDeep = deep +1;
        for(let i =0,j=children.length;i<j;i++){
            let child = children[i];
            let rs = handler(child,i,node,deep);
            if(rs===false || rs==='break') return;
            if(rs==='continue') continue;
            eachChildren(children[i],handler,nextDeep);
        }
    }else {
        let rs = handler(children,0,node,deep);
        if(rs===false || rs==='break' || rs==='continue') return;
        eachChildren(children,handler,deep+1);
    }
}

export function registerComponent(name,component){
    if(antd[name]) throw new Error(`aleady has a component named ${name}`);
    antd[name] = component;
}

export class HtmlElementView extends Component{  
    content:any;
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    render(){
        const {id,className} = this.props;
        if(this.props.vnode){
            return <div className={(className||"") + ' html-element' } id={id||""} ref="html-element">{this.props.vnode}</div>
        } 
        if(this.props.text!==undefined){
            return <div className={(className||"") + ' html-element' } id={id||""} ref="html-element">{this.props.text}</div>
        } 
        return <div className={(className||"") + ' html-element' } id={id||""} ref="html-element"></div>
    }
    componentDidMount(){
        this._fillContent();
    }
    componentDidUpdate(){
        this._fillContent();
    }
    _fillContent(){
        if(this.props.vnode) return;
        let element = this.refs["html-element"];
        const {html,dom} = this.props;
        if(html && this.content!==html) this.content = element.innerHTML = html;
        else if(dom && this.content !==dom){
            element.innerHTML="";
            element.appendChild(dom);
            this.content = dom;
        }
    }
}

export class LoadableView extends Component{
    isUnmount:boolean;
    url:string;
    module:any;

    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    static contextTypes = {
        store: PropTypes.object,
    };

    render(){
        let contentElement;
        let id = this.props.id;
        let iframeUrl = this.props.iframeUrl;
        let className = this.props.className;
        const self:any = this;
        if(iframeUrl){
            let onload = ()=>{
                self._removeLoading(self.refs["html-element"],self.refs["loadable-content"],self.refs["loading"],self.props.onload);
            };
            contentElement = <iframe src={iframeUrl} onLoad={onload} className="loadable-content"></iframe>;
        }else {
            contentElement = <div className="loadable-content" ref="loadable-content"></div>
        }
        //if(!this.props.module || !this.props.contentUrl) return null;
        return <div className={(className||"") + ' loadable' } id={id||""} ref="html-element">
            {contentElement}
            <div className='loading' ref="loading">
                <div className='loading-mask'></div>
                <div className='loading-text'>{this.props.loadingText || "加载中..."}</div>
            </div>
            
        </div>;
    }
    componentDidMount(){
        this._fillContent();
    }
    componentDidUpdate(){
        this._fillContent();
    }
    componentWillUnmount(){
        this.isUnmount = true;
    }
    _removeLoading=(loadableElement,contentElement,loadingElmement,transport,onload)=>{
        
        if(loadingElmement.parentNode)loadingElmement.parentNode.removeChild(loadingElmement);
        if(onload) onload.call(loadableElement);
    }
    _renderTo = (loadableElement,contentElement,loadingElement,content,props,transport,onload)=>{
        if(this.isUnmount) return;
        if(!content) {
            contentElement.innerHTML = "";
            this._removeLoading(loadableElement,contentElement,loadingElement,transport,onload);
            
            return;
        }
        if(typeof content.then==='function'){
            content.then((val)=>{
                this._renderTo(loadableElement,contentElement,loadingElement,val,props,transport,onload);
            },()=>{
                this.url = undefined;this.module=undefined;
            });
            return;
        }
        if(content.$mount){

            let result = content.$mount(props,contentElement,this.props.superStore || this.context.store|| this.props.$store,transport);
            if(result && typeof result.then==='function'){
                return this._renderTo(loadableElement,contentElement,loadingElement,result,props,transport,onload);
            }
            return this._removeLoading(loadableElement,contentElement,loadingElement,transport,onload);
        }
        if(typeof content ==='function'){
            let result = content(props,contentElement);
            if(result && typeof result.then==='function'){
                return this._renderTo(loadableElement,contentElement,loadingElement,result,props,transport,onload);
            }

            return this._removeLoading(loadableElement,contentElement,loadingElement,transport,onload);
        }
        contentElement.innerHTML = content;
        return this._removeLoading(loadableElement,contentElement,loadingElement,transport,onload);
    }
    _fillContent(){
        let loadableElement = this.refs["html-element"];
        let contentElement = this.refs["loadable-content"];
        let loadingElement = this.refs["loading"];
        let module = this.props.module;
        let contentUrl = this.props.contentUrl;
        if(!module && !contentUrl){
            if(loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            return;
        }
        //let props = this.props;
        let transport = this.props.$transport || {__transport__:"Loadable"};
        //transport.$superStore = this.props.$superStore;
        transport.module= module;
    
        let onload = this.props.onload;
        if(module){
            if(typeof module=="string") {
                if(module===this.url) return;
                this.url = module;
                module= require(module);
                
            }
        }
        if(contentUrl){
            if(contentUrl===this.url) return;
            this.url = contentUrl;
            module = axios.get(contentUrl);
            
        }
        this.module = module;
        if(!module.then) {
            console.warn("Loadable's module property should be a url or module");
            this.url = undefined;
            this.module = undefined;
            return;
        }
        return this._renderTo(loadableElement,contentElement,loadingElement,module,{...this.props},transport,onload);
        
    }
}

export class ContentView extends Component{
    props:any;
    render(){
        const {iframeUrl,module,vnode,html,text,contentUrl,dom} = this.props;
        if(module || iframeUrl || contentUrl) 
            return <LoadableView {...this.props} />;
        if(vnode || html || text || dom){
            return <HtmlElementView {...this.props} />;
        }
        return null;
    }
}
export class Center extends React.Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    render(){
        return <div ref='elem' {...this.props}>
        {this.props.children}
        </div>
    }
    componentDidUpdate(){
        let ctr = this.refs["elem"];
        ctr.__rsz();
    }
    componentDidMount(){
        let target = this.props.target;
        if(target)target = document.getElementById(target);else target = "";
        let ctr = this.refs["elem"];
        ctr.style.position="absolute";
        ctr.style.cssText = "position:absolute;margin:0;z-index:999;";
        //document.body.appendChild(ctr);
        let rsz = ctr.__rsz = ()=>{
            let pPos = getBox(ctr.offsetParent);
            let {x,y,width,height} = getBox(target);
            x = x-pPos.x;y = y-pPos.y;
            let adjust = parseInt(this.props.adjust) || 0;
            let vType = viewport();
            if(vType==='xs') adjust=0;
            let top = y + (height - ctr.clientHeight)/2 + adjust ;
            if(this.props.mintop){
                let min =parseInt(this.props.mintop);
                if(vType==='xs') min = 0;
                if(top< min) top = min;
            }
            if(top<50 && vType!=='xs') top=50;
            ctr.style.left = x + (width - ctr.clientWidth)/2 + "px";
            ctr.style.top = top + "px";
        };
        setTimeout(rsz,0);
        attach(window,'resize',rsz);
    }
    componentWillUnmount(){
        let ctr = this.refs["elem"];
        detech(window,'resize',ctr.__rsz);
    }
}



export class CascadingView extends React.Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
   
    constructor(props){
        super(props);
    }
    render(){
        const {pages} = this.props;
        let pageViews = [];
        for(let i =0,j=pages.length;i<j;i++){
            let page = pages[i];
            page.key =i;
            pageViews.push(React.createElement(ContentView,page,null));
        }
        return <div className="cascading" id={this.props.id||""}>{pageViews}</div>;

    }
}
export interface IField{
    //名称
    name?:string;
    text?:string;
    //类型
    inputType?:string;
    //css
    css?:string;
    
    info?:string;
}
export interface IFieldState{
    disabled?:boolean;
    field:IField;
    name?:string;
    text?:string;
    className?:string;
    valid?:string;
    inputType?:string;
    required?:string|string;
    xs?:boolean;
    sm?:boolean;
}
export class FieldView extends Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    cls:string;

    render(){
        
        let state :IFieldState = this.props;
        if(state.disabled===true) return null;
        let field:IField =state.field ||{};
        
        let inputType = field.inputType || state.inputType || 'Input';
        let name = field.name || state.name;
        let cls = field.css;
        if(cls===undefined){
            cls = '';
            if(this.props.className) cls += ' ' + this.props.className;
            cls += ' ' + inputType;
            cls += ' ' + name;
            cls += ' field';
            field.css = cls;
        }
        if(state.valid) cls += ' ' + state.valid;
        let input = antd[inputType];
        let label;
        if(field.info){
            label = <Tooltip title={field.info}><label className='field-label'>
            {field.text || state.text || name}
            {state.required?<span className='required'>*</span>:null}
        </label></Tooltip>
        }else {
            label = <label className='field-label'>
            {field.text || this.props.text || name}
            {state.required?<span className='required'>*</span>:null}
        </label>;
        }
        //field.className = "field-input";
        
        return <div className={cls}>
            {label}
            <span className='field-input'>{React.createElement(input,field)}</span>
        </div>;
    }
}

interface IFieldsetState{
    fields:{[name:string]:IFieldState};
    allowedFieldnames?:{[name:string]:boolean};
    visibleFieldnames?:{[name:string]:boolean};
    showAllAllowedFields?:boolean;
    useCollapse?:boolean;
}

export class FieldsetView extends Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    cls:string;
    constructor(props){
        super(props);
        this.state = {
            expended:false
        };
    }
    onToggle=()=>{
        this.setState({expended:!this.state.expended});
    }
    render(){
        let state :IFieldsetState = this.props;
        let fields :{[name:string]:IFieldState} = state.fields || {};
        let hasHidden = false;
        let canCollapse = false;
        let vp:string = viewport() as string;
        let alloweds = state.allowedFieldnames;
        let visibles = state.visibleFieldnames;
        let showAll = state.showAllAllowedFields;
        let fieldcount=0;

        eachChildren(this,(child,index,parent,deep)=>{
            if(deep>3) return false;
            if(child.type!==FieldView)return;
            let cprops:IFieldState = child.props;
            let name = cprops.name;
            let field = fields[name];
            if(!field) {fieldcount+=1; return; }
            cprops.field = field;
            if(alloweds && !alloweds[name]) {
                cprops.disabled=true;
            }
            if((visibles && !visibles[name]) || ((cprops as any)[vp]===false)) {
                if(showAll!==true && !this.state.expended){
                    hasHidden= true;
                    cprops.disabled=true;
                }else{
                    canCollapse=true;
                    fieldcount+=1;
                }
                
            }

            return null;
        });

        if(fieldcount===0 && !hasHidden) return null;
        let addition=null;
        if(hasHidden){
            addition = <div key='fieldset-goggle' className='fieldset-goggle' onClick={this.onToggle}><Icon type="down" /></div>
        }else if(canCollapse){
            addition = <div  key='fieldset-goggle'  className='fieldset-goggle' onClick={this.onToggle}><Icon type="up" /></div>
        }
       
        return <div className='grid'>
            {this.props.children}
            {addition}
        </div>
    }
}

let genId = ()=>{
    let idSeed=1;
    let time = new Date().valueOf().toString();
    genId = ()=>{
        if(idSeed>2100000000){ 
            idSeed=1;time = new Date().valueOf().toString();
        }
        return  idSeed.toString() + '_' + time;
    };
    return genId();
}