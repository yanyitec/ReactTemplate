
import  React, { Component } from 'lib/react/react';
import {  Icon, Button,Tooltip,Checkbox,Alert   } from 'lib/antd/antd';
import * as axios from 'lib/axios';
import {getCookie,setCookie,Center} from 'lib/ui';


export interface IAuthInfo{
    Username?:string;
    Password?:string;
    RememberMe?:boolean;
    AccessToken?:string;
}
export interface IAuthPermission{
    Id:string;
    Name?:string,
    SystemId?:string;
    Url?:string;
    Icon?:string;
    ControllerName?:string;
    ActionName?:string;
    ParentId?:string;
}
export interface IAuthData{
    AccessToken:string;
    Info:IAuthInfo;
    Permissions:IAuthPermission[];
    Profile:any;
    User:any;
    
}

export interface IAuthState {
    enable:boolean;
    data?:IAuthInfo;
    auth_type?:string;
    url?:string;
    auth_dataType?:string;
    authview_resolve?:Function;
}

export interface IAuthNotice {
    onAuthSuccess?:Function;
}

export interface IAuthInternalState extends IAuthInfo{
    nameInputing?:boolean|string;
    pswdInputing?:boolean|string;
    errorMessages?:string[];
    processing?:boolean;
    
}




const AUTH_COOKIE_NAME = 'AUTH';
  
export default class Auth extends Component{
    refs:any;
    props:IAuthState & IAuthNotice;
    setState:any;
    forceUpdate:any;
    state:IAuthInternalState;
    context:any;
    timer:any;
    iframe:HTMLIFrameElement;
    view_resolve:Function;
    constructor(props:IAuthState & IAuthNotice){
        super(props);
        if(!props.enable) return;
        this.view_resolve = props.authview_resolve;
        let authInfo = props.data;
        if(authInfo===undefined){
            let authJson = getCookie(AUTH_COOKIE_NAME);
            if(authJson){
                try{
                    authInfo = JSON.parse(authJson);
                }catch(ex){

                }
            }
        }
        authInfo || (authInfo = {Username:'',Password:'',RememberMe:true});
  
        this.state = {
          processing:true,
          nameInputing:authInfo.Username,
          pswdInputing:authInfo.Password,
          Username:authInfo.Username,
          Password:authInfo.Password,
          RememberMe:authInfo.RememberMe
        };
        
  
        if(authInfo.AccessToken || (authInfo.RememberMe && authInfo.Username && authInfo.Password)){
          this.doAuth();
          return;
        } else {
            this.state.processing = false;
        }
    }
    doAuth(){
      let authInfo = {
        Username:this.state.Username,
        Password:this.state.Password,
        RememberMe:this.state.RememberMe,
        AccessToken:this.state.AccessToken
      };
      let opts = {
        url:this.props.url,
        method:'post',
        dataType:this.props.auth_dataType,
        data:authInfo
      };
      let ins=axios.get(this.props.url).then((response)=>{
        if(this.view_resolve) {
            let view_resolve = this.view_resolve;
            this.view_resolve = undefined;
            view_resolve(this);
        }
        if(response.User.Username!==this.state.Username || response.User.Password !==this.state.Password){
            this.setState({processing:false,errorMessages:["用户名密码不正确"]});
            return;
        }
        let authInfo = response.Auth = {
            Username:this.state.Username,
            Password:this.state.Password,
            RememberMe : this.state.RememberMe,
            AccessToken: response.AccessToken
        };
        setCookie(AUTH_COOKIE_NAME,JSON.stringify(authInfo),"m20");
        this.setState({enable:false});
        if(this.props.onAuthSuccess){
            this.props.onAuthSuccess(response);
        }
      },(err)=>{
        this.setState({
          errorMessages:["登录失败"],
          processing:false
        });
        //if(this.props.auth_reject && rejectable) this.props.auth_reject(err);
      });
    }
      
    
    
    checkInputs(){
        let error=[];
        if(!this.state.Username){
            error.push(<div  key={error.length}>请填写用户名</div>);
        }
        if(!this.state.Password){
            error.push(<div key={error.length}>请填写密码</div>);
        }
        return error;
    }
    nameChange=(e)=>{
      this.setState({Username:e.target.value.replace(/(^\s+)|(\s+$)/,"")});
    }
    pswdChange=(e)=>{
      this.setState({Password:e.target.value});
    }
    rememberMeChange=(e)=>{
      this.setState({RememberMe:e.target.checked});
    }
  
    nameFocusin=()=>{
        this.setState({nameInputing:true});
    }
    nameFocusout=(e)=>{
      let name = e.target.value.replace(/(^\s+)|(\s+$)/,'');
      this.setState({nameInputing: name!=''});
    }
  
    pswdFocusin=()=>{
        this.setState({pswdInputing:true});
    }
    pswdFocusout=(e)=>{
        this.setState({pswdInputing:e.target.value!=''});
    }
    
    formSubmit=(e)=>{
        let errors = this.checkInputs();
        if(errors.length){
            this.setState({errorMessages:errors});
            e.preventDefault();
            return;
        }
        let auth_type = this.props.auth_type;
        this.setState({processing:true});
        if(auth_type==='iframe-local' || auth_type==='iframe'){
            return;
        }
        this.doAuth();
        e.preventDefault();
    }
  
    render(){
        if(!this.props.enable) return null;
        let auth_type = this.props.auth_type;
        if(auth_type==='iframe'){
            return <iframe name="auth_iframe" id="auth_iframe" src={this.props.url} ref="auth-iframe"></iframe>;
        }
        let inputForm = <form action='' id='auth-form' onSubmit={this.formSubmit} method="post" target="hidden_auth_iframe">
            <h1><Icon type="lock" /> 登录</h1>
            <div className={this.state.nameInputing?'data-field inputing':'data-field'}>
                <label className='data-label' htmlFor="signin-Username">用户名</label>
                <span className='data-input'>
                    <Icon type="user" />
                    <input type="text" name="Username"  id="signin-Username" value={this.state.Username} 
                    onFocus={this.nameFocusin} onBlur={this.nameFocusout} onChange={this.nameChange}
                    />
                </span>
                <Tooltip placement="right" title={'请填写用户名'}>
                    <Icon type="question-circle" />
                </Tooltip>
            </div>
            <div className={this.state.pswdInputing?'data-field inputing':'data-field'}>
                <label className='data-label' htmlFor="signin-Password">密码</label>
                <span className='data-input'>
                    <Icon type="key" />
                    <input type="password" name="Password" id="signin-Password" value={this.state.Password}
                    onFocus={this.pswdFocusin} onBlur={this.pswdFocusout} onChange={this.pswdChange}
                    />
                </span>
                <Tooltip placement="right" title={'请输入密码'}>
                    <Icon type="question-circle" />
                </Tooltip>
            </div>
            <div className='data-field noLabel'> 
                <Checkbox onChange={this.rememberMeChange} checked={this.state.RememberMe}>记住我</Checkbox>
            </div>
            <div className='data-actions'>
                <Button text="登陆" type="primary" htmlType="submit">
                登陆<Icon type="unlock" />
                </Button>
                {
                this.state.errorMessages && this.state.errorMessages.length?<div className='error'><Alert
                    message={this.state.errorMessages}
                    type="error"
                    showIcon
                    closable
                /></div>:null
                }
            </div>
        </form>;
        let loadingForm = <div id='auth-processing'>
            <img src="images/loading.gif" />
            <div>正在登陆..</div>
        </div>;
      
        if(auth_type==='local-iframe'){
            if(this.state.processing){
            return <div id='autharea'>
                <img src="images/auth-bg.jpg" className='bg'/>
                <Center id='auth-content'  adjust='-100px'>{loadingForm}</Center>
                <iframe src={this.props.url} name='hidden_auth_iframe' id='auth-iframe' style='display:none;' ref="auth-iframe"></iframe>
            </div>
            }else {
            return <div id='autharea'>
                <img src="images/auth-bg.jpg" className='bg'/>
                <Center id='auth-content'  adjust='-100px'>{inputForm}</Center>
                <iframe src={this.props.url} style='display:none;' name='hidden_auth_iframe' id='auth-iframe' ref="auth-iframe"></iframe>
            </div>
            }
        }else {
            if(this.state.processing){
            return <div id='autharea'>
                <img src="images/auth-bg.jpg" className='bg'/>
                <Center id='auth-content'  adjust='-100px'>{loadingForm}</Center>
            </div>
            }else {
            return <div id='autharea'>
                <img src="images/auth-bg.jpg" className='bg'/>
                <Center id='auth-content' adjust='-100px'>{inputForm}</Center>
            </div>
            }
        }
    }
    componentDidMount(){
        let auth_type = this.props.auth_type;
        if(this.view_resolve) {
            let view_resolve = this.view_resolve;
            this.view_resolve = undefined;
            //this.props.authview_resolve =undefined;
            view_resolve(this);
        }
    }
    
}
  