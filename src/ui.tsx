
declare var require:Function;
import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';

export class Loadable extends React.Component{
    private module:IPromise|string;
    private parameters:any;
    private clientId;
    private domElement:HTMLDivElement;
    state:any;
    setState:any;
    refs:any;
    props:any;
    constructor(props:any){
        super(props);
        
        this.state ={loadingText:props["loadingText"||"正在加载..."],isLoading:true};
    }
    render(){
        let clientId = this.props.id;
        if(!clientId) clientId = "loadable_" + genId();
        let module = this.module = this.props.module;
        let parameters =this.parameters = this.props.parameters;
        
        let mask;
        if(this.state.isLoading){
            mask=<div className='loadable-mask'>
            <div className='loadable-bg'></div>
            <div className='loadable-notice'>{this.state.loadingText}</div>
        </div>;
        }
        return <div className='loadable-container' id={clientId} ref="loadable-container">
            <div className='loadable-content' ref="loadable-content"></div>
            {mask}
        </div>;
    }
    componentDidMount() {
        console.log("componentDidMount");
        let promise:IPromise;
        let domElement=this.domElement = this.refs["loadable-content"] as HTMLElement;
        if(!domElement)return;
        if(!this.module)return;
        if(typeof this.module ==='string'){
            promise = require(this.module);
        }else {
            promise = this.module as IPromise;
        }
        promise.done((value)=>{
            if(!value){
                return;
            }
            //let domElement=this.domElement = document.getElementById(this.clientId) as HTMLDivElement;
            if(!domElement)return;
            if(typeof value==="string"){
                domElement.innerHTML = value;
                return this.setState({isLoading:false});
            }
            let renderTo = value.renderTo;
            if(typeof renderTo==='function'){
                let renderResult = renderTo(domElement,this.parameters,domElement);
                if(renderResult && renderResult.then){
                    renderResult.then(()=>{
                        this.setState({isLoading:false});
                    });
                    return;
                }
                
            } 
            this.setState({isLoading:false});
        });
    }
  
    componentWillUnmount() {
  
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