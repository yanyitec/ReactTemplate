
declare var require:Function;

import React,{Component} from 'lib/react/react';
import {attach,detech,getBox,viewport} from 'lib/utils';
import antd,{Icon,Tooltip,Checkbox,Alert,Button,Collapse} from 'lib/antd/antd';

export function eachChildren(node,handler:(node:any,index:number,parent:any,deep?:number)=>string|boolean,deep?:number){
    if(!node || !node.props) return;
    let children = node.props.children;
    if(!children) return;
    if(!deep) deep=1;
    if(children.length!==undefined && typeof children.push==='function'){
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

export interface IFieldState{
    disabled?:boolean;
    name?:string;
    validStates?:any;
    validate?:Function;
    info?:string;
    label?:string;
    className?:string;
    required?:string|string;
    xs?:boolean;
    sm?:boolean;
}
export class Field extends Component{
    refs:any;
    props:any;
    setState:any;
    forceUpdate:any;
    state:any;
    context:any;
    css:string;

    render(){
        
        let state :IFieldState = this.props;
        if(state.disabled===true) return null;
        
        
        //let inputType = field.inputType || state.inputType || 'Input';
        let name = state.name;
        let cls = this.css;
        if(cls===undefined){
            cls = '';
            if(this.props.className) cls += ' ' + this.props.className;
            //cls += ' ' + inputType;
            cls += ' ' + name;
            cls += ' field';
            this.css = cls;
        }
        let validStates = state.validStates ||{};
        let validateText = validStates[name];
        let validateIndicator;
        if(validateText===true) {
            cls += " validate-success";
            validateIndicator = <label  className='field-valid'><Icon type="check" /></label>;
        }else if(validateText) {
            cls += ' validate-error';
            validateIndicator = <label className='field-valid'><Tooltip title={validateText}><Icon type="close" /></Tooltip></label>;
        }
        else if(this.props.info){

            validateIndicator = <label  className='field-valid'><Tooltip title={this.props.info}><Icon type="info-circle-o" /></Tooltip></label>;
        }else {
            validateIndicator = <label  className='field-valid'><i>&nbsp;</i></label>;
        }
        //let input = antd[inputType];
        let label = <label className='field-label'>
            {state.label|| name}
            {state.required?<span className='required'>*</span>:null}
        </label>;
        //field.className = "field-input";
        
        return <div className={cls}>
            {label}
            <span className='field-input'>{this.props.children}</span>
            {validateIndicator}
        </div>;
    }
}

interface IFieldsetState{
    validStates?:any;
    validRules?:any;
    alloweds?:{[name:string]:boolean};
    visibles?:{[name:string]:boolean};
    collapsed?:boolean;
    useCollapse?:boolean;
}



export class Fieldset extends Component{
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
        let hasHidden = false;
        let canCollapse = false;
        let vp:string = viewport() as string;
        let alloweds = state.alloweds;
        let visibles = state.visibles;
        let collapsed = state.collapsed;
        let fieldcount=0;
        let validStates = state.validStates || {};
        let validRules = state.validRules || {};

        eachChildren(this,(child,index,parent,deep)=>{
            if(deep>3 || !child) return false;
            if(child.type!==Field){
                fieldcount++;
                return;
            }
            let cprops:IFieldState = child.props;
            if(!cprops.validStates) cprops.validStates = validStates;
            let name = cprops.name;
            if(alloweds && !alloweds[name]) {
                cprops.disabled=true;
            }
            if((visibles && !visibles[name]) || ((cprops as any)[vp]===false)) {
                if(collapsed!==true && !this.state.expended){
                    hasHidden= true;
                    cprops.disabled=true;
                }else{
                    canCollapse=true;
                    fieldcount+=1;
                }
                
            }
            if(!cprops.validate){
                
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