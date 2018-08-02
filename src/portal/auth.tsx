
import  React,{Component} from 'lib/react/react';
import {  Form,Icon, Button,Tooltip,Checkbox,Input   } from 'lib/antd/antd';
import * as axios from 'lib/axios';
import {Center} from 'lib/ui';
import {getCookie,setCookie,attach, detech} from 'lib/utils';
import {__module__,Loadable, IModuleCreation, IModuleDefination, IReactComponent} from 'lib/module';
import {Field,Fieldset} from 'lib/ui';


declare let Promise :any;

export interface ICredence{
    Username:string;
    Password:string;
    RememberMe:boolean;
    AccessToken?:string;
}
export interface IPrincipal{
    Id:string;
    Username:string;
    Permissions:any;
    Roles:any;
}
export interface IAuthData{
    AccessToken:string;
    Principal:IPrincipal;
    Profile:any;
}

export interface IAuthState {
    visible:boolean;
    message?:string;
    validStates?:any;
    auth_type?:string;
    url?:string;
    credence?:ICredence;
    [key:string]:any;
}

export default class AuthView extends Component{
    refs:any;
    props:any;
    forceUpdate:any;
    state:any;
    context:any;
    setState:any;
    bg:any;
    elem:any;
    form:any;
    isAttached:boolean;

    constructor(props){
        super(props);
    }
    render(){
        let state:IAuthState = this.props.auth;
        return <div ref={(node)=>this.elem= node} id='auth-area' style={{position:"fixed",top:0,left:0,width:'100%'}}>
            <div ref={(node)=>this.bg=node} className='auth-bg'></div>
            <form className='grid auth-form' ref={(node)=>this.form=node} style={{position:"fixed"}}>
                <h1><Icon type="lock" /> 用户登陆</h1>

                <div className='col-d1'>
                    <Field label={<Icon type="user" />} name="Username" validStates={this.props.validStates}>
                        <Input name="Username" value={state.credence.Username} placeholder="用户名" onChange={this.props["auth.text_changed"]} />
                    </Field>
                </div>
                <div className='col-d1'>
                    <Field label={<Icon type="key" />} name="Password"  validStates={this.props.validStates}>
                        <Input name="Password" type="password" value={state.credence.Password} placeholder="密码" onChange={this.props["auth.text_changed"]} />
                    </Field>
                </div>
                <div className='col-d1 rememberMe'>
                    <Field label="" >
                        <Checkbox name="RememberMe" checked={state.credence.RememberMe?true:false} onChange={this.props["auth.check_changed"]} /> 记住我 <Icon type="tag-o" />
                    </Field>
                </div>
                <div className='col-d1 actions'>
                    <Button  onClick={this.props["auth.submit"]}><Icon type="unlock" /> 登陆 </Button>
                </div>
                <div className='col-d1'>
                    {state.message?<div className='error-message' dangerouslySetInnerHTML={{__html:state.message}}></div>:null } 
                </div>
                    
            </form>
            
        </div>
    }

    componentDidMount(){
        if(!this.isAttached){
            attach(window,'resize',this.keepCenter);
            this.isAttached=true;
        }
        this.keepCenter();
       
    }
    componentDidUpdate(){
        if(!this.isAttached){
            attach(window,'resize',this.keepCenter);
            this.isAttached=true;
        }
        this.keepCenter();
    }
    componentWillUnmount(){
        if(this.isAttached){
            detech(window,'resize',this.keepCenter);
            this.isAttached=false;
        }
    }
    keepCenter= ():void =>{
        let elem = this.elem;
        while(elem){
            if(elem.parentNode==document.body) break;
            elem = elem.parentNode;
        }
        if(!elem){
            if(this.isAttached) detech(window,"resize",this.keepCenter);
        }
        let w = Math.max(document.documentElement.clientWidth,document.body.clientWidth);
        let h = Math.max(document.documentElement.clientHeight,document.body.clientHeight);
        this.elem.style.height = h + "px";
        this.form.style.left = (w - this.form.clientWidth) /2 + "px";
        this.form.style.top = (h - this.form.clientHeight) /2 + "px";
    }
    
}

