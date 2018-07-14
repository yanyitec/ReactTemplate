
declare var require:Function;
import * as axios from 'lib/axios';
import React,{Component} from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { createStore } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';
import { mergeDiff } from 'lib/utils';
import {Icon,Tooltip,Checkbox,Alert,Button} from 'lib/antd/antd';


export let mergemo=(old,newModel)=>{
    for(let n in old) {
      if(newModel[n]===undefined) newModel[n] = old[n];
    }
    return newModel;
  };

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

export function getCookie(name:string)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else return null;
}

export function setCookie(name:string,value?:any,time?:string)
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
export let getBox = function(elem?:any){
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
let viewTypeChangeHandlers:Array<(type)=>void>=[];
let viewTypes = {
    "lg":1200,
    "md":992,
    "sm":768
};
export let viewType = function(onChange?:(type)=>void):string{
    if(onChange && typeof onChange ==='function') {
        viewTypeChangeHandlers.push(onChange);
    }
    let w= window.innerWidth || document.documentElement.clientWidth;
    for(let t in viewTypes){
        if(w>=viewTypes[t]) return t;
    }
    return 'xs';
}


export interface IMountArguments{
    model?:any,
    mapStateToProps?:any;
    mapDispatchToProps?:any;
    controller?:{};
    store?:any;
    onCreating?:(mountArguments:IMountArguments)=>void;
    superStore?:any;
    transport?:any;
    targetElement?:any;
    Redux?:any;
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
    if(!mountArguments.controller){
        (Component as any).$mount = (props:any,targetElement:HTMLElement,superStore?:any,transport?:any)=>{
            (props||(props={}));
            transport ||(transport={'__transport__':"$mount("+Component.toString()+")"});
            mountArguments.transport = props.transport = transport;
            mountArguments.transport.superStore = props.superStore = transport.superStore = superStore;
            if(mountArguments.onCreating) mountArguments.onCreating(mountArguments);
            ReactDOM.render(React.createElement(Component,props,null),targetElement);
        }
        return Component;
    }
    (Component as any).$mount = (props:any,targetElement:HTMLElement,superStore,transport?:any)=>{
        (props||(props={}));
        transport ||(transport={'__transport__':"$mount("+Component.toString()+")"});
        mountArguments.transport = props.transport = transport;
        mountArguments.transport.superStore = props.superStore = transport.superStore = superStore;

        let initModel;
        if(typeof mountArguments.model==='function') initModel = mountArguments.model(props,transport);
        else initModel = mountArguments.model;
        initModel = mergeDiff(props,initModel);
        let controller = mountArguments.controller;
        let reducers = {};

        const store =mountArguments.store = transport.store = transport.store || createStore((model,action)=>{
            let handler = controller[action.type];
            let newModel;
            if(handler){
                newModel =handler(model,action);
                return mergeDiff(model,newModel);
            } return model;
        },initModel);
        let mapStateToProps= mountArguments.mapStateToProps;
        if(mapStateToProps===null){
            mapStateToProps =(state)=>{return {...state}};
        }
        store.superStore = superStore;
        store.transport = transport;
        let mapDispatchToProps = mountArguments.mapDispatchToProps;
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
            let result = content.$mount(props,contentElement,transport.superStore,transport);
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
        let props = this.props.props;
        let transport = this.props.transport;
    
        let onload = this.props.onload;
        if(module){
            if(typeof module=="string") {
                if(module===this.url) return;
                module= require(module);
                this.url = module;
            }
        }
        if(contentUrl){
            if(contentUrl===this.url) return;
            module = axios.get(contentUrl);
            this.url = contentUrl;
        }
        this.module = module;
        if(!module.then) {
            console.warn("Loadable's module property should be a url or module");
            this.url = undefined;
            this.module = undefined;
            return;
        }
        return this._renderTo(loadableElement,contentElement,loadingElement,module,props,transport,onload);
        
    }
}

export class ContentView extends Component{
    props:any;
    render(){
        const {iframeUrl,module,vnode,html,text,contentUrl,dom,id,className,props,superStore,transport} = this.props;
        if(module || iframeUrl || contentUrl) 
            return <LoadableView transport={transport} superStore={superStore} module={module||""} iframeUrl={iframeUrl||""} contentUrl={contentUrl||""} id={id||""} className={className||""} props={props}/>;
        if(vnode || html || text || dom){
            return <HtmlElementView vnode={vnode||""} html ={html||""} text={text||""} dom={dom||""} />;
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
            let vType = viewType();
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
    props:any;
   
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
        return <div className="cascading" id={this.props.id}>{pageViews}</div>;

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