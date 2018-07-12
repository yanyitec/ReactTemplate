
declare var require:Function;
import * as axios from 'lib/axios';
import React,{Component} from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { createStore } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';

export let mergemo=(old,newModel)=>{
    for(let n in old) {
      if(newModel[n]===undefined) newModel[n] = old[n];
    }
    return newModel;
  };
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
        let controller = mountArguments.controller;
        const store =mountArguments.store = transport.store = transport.store || createStore((model,action)=>{
            let handler = controller[action.type];
            return handler?handler(model,action):model;
        },initModel);
        let mapStateToProps= mountArguments.mapStateToProps;
        if(mapStateToProps===null){
            mapStateToProps =(state)=>{return {...state}};
        }
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
        const {id,className,text,vnode} = this.props;
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