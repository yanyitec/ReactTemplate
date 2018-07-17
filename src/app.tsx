
import  React, { Component } from 'lib/react/react';
import { Menu, Icon, Modal,Button,Dropdown  } from 'lib/antd/antd';
import {  connect } from 'lib/redux/react-redux';

import * as axios from 'lib/axios';
import {cloneObject} from 'lib/utils';
import {viewType,attach} from 'lib/ui';
import Mainmenu,{IMainMenuState,IMenuItem} from 'portal/menu';
import Auth,{IAuthState} from 'portal/auth';

//import * as config from 'conf/config';

import {mergemo,getCookie,$mountable,CascadingView, ContentView, IMountArguments, Center} from 'lib/ui';

declare var Deferred : any;
declare var Promise : any;
declare var define:any;

interface IAppState{
  auth:IAuthState;
  menu:IMainMenuState;
  dialog:any;
  workarea:any;
  user:any;
  viewType:string;
}




let MainMenu = connect((model:IAppState)=>{return model.menu},(dispatch)=>{
  return {
    onItemClick:(item)=>dispatch({type:"menu.click",item:item}),
    onToggleIcon:()=>dispatch({type:'menu.toggleFold'})
  }
})(Mainmenu);

export class DialogView extends Component{
  props:any;
  
  render(){
    const {title,width,height,onOk,onCancel} = this.props; 
    let contentView = React.createElement(ContentView,this.props,null);
    return <Modal title={title}
      visible={true}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={false}
    >
      {contentView}
    </Modal>
  }
}

let Dialog = connect((model:IAppState)=>{return model.dialog},(dispatch)=>{
  return {
    onOk:()=>dispatch({type:"dialog.ok"}),
    onCancel:()=>dispatch({type:"dialog.cancel"})
  }
})(DialogView);




let WorkArea = connect((model:IAppState)=>model.workarea,(dispatch)=>{
  return {};
})(CascadingView);

function buildNormalQuicks(user,customActions){
  let userDiv,customDiv;
  if(user && user.data){
    let userMenuItems = [
      <Menu.Item key="10000"><Icon type="idcard" /> 重登陆</Menu.Item>,
      <Menu.Item key="20000"><Icon type="key" /> 修改密码</Menu.Item>,
      <Menu.Item key="30000"><Icon type="profile" /> 个性化</Menu.Item>,
      <Menu.Item key="40000"><Icon type="logout" /> 退出</Menu.Item>,
    ];
    let userMenu = <Menu>{userMenuItems}</Menu>;
    userDiv  = <div className='user'><Button.Group >
      <Button  type='dashed'><Icon type="user" /><a>{user.data.DisplayName||user.data.Username || ' '}</a></Button>
      <Dropdown overlay={userMenu} placement="bottomRight">
        <Button>
        <Icon type="setting" />
        </Button>
      </Dropdown>
      <Button><Icon type="poweroff" /></Button>
    </Button.Group></div>;

  }
  
  
  if(customActions && customActions.length){
    let customActionItems=[];
    for(let i =customActions.length-1,j=0;i>=0;i--){
      let actionInfo = customActions[i];
      customActionItems.unshift(<Button type={actionInfo.type || 'primary'} onClick={actionInfo.onClick}><Icon type={actionInfo.icon} /> {actionInfo.text}</Button>);
    }
    customDiv = <div className='actions'><Button.Group >{customActionItems}</Button.Group></div>;
  }

  return <div id='layout-quicks'>
    {userDiv}
    {customDiv}
  </div>
}

function buildMinQuicks(user,customActions){
  let customActionItems,customDiv;
  if(user && user.data){
    customActionItems = [
      <Menu.Item key="10000"><Icon type="idcard" /> 重登陆</Menu.Item>,
      <Menu.Item key="20000"><Icon type="key" /> 修改密码</Menu.Item>,
      <Menu.Item key="30000"><Icon type="profile" /> 个性化</Menu.Item>,
      <Menu.Item key="40000"><Icon type="logout" /> 退出</Menu.Item>,
    ];
  }
  
  
  if(customActions && customActions.length){
    let idprefix = (customActions.idprefix|| Math.random().toString())+"_";
    if(customActions && customActions.length) customActionItems.unshift(<Menu.Divider />);
    for(let i =customActions.length-1,j=0;i>=0;i--){
      let actionInfo = customActions[i];
      customActionItems.unshift(<Menu.Item key={idprefix + i}><Icon type={actionInfo.icon } /> {actionInfo.text }</Menu.Item>);
    }
    
  }

  let customMenu = <Menu>{customActionItems}</Menu>;
  return <div id='layout-quicks'>
    <Dropdown overlay={customMenu} placement="bottomRight">
      <Button size='small' theme='dark'>
        <Icon type="ellipsis" />
      </Button>
    </Dropdown>
  </div>;
}


export class AppView extends Component{
  props:any;
  render(){
    const {menu,dialog,auth,user,customActions,viewType
      ,onAuthSuccess,onMenuToggleMin} = this.props;
 
    let layoutLogo;
    if(viewType==='xs'){
      layoutLogo = <div id='layout-logo'>
        <a className={menu.mode==='min'?'toggle collapsed':'toggle'} onClick={onMenuToggleMin}><Icon type={menu.mode=='min'?"menu-unfold":"menu-fold"} /></a>
      </div>;
    }else {
      layoutLogo = <div id='layout-logo'>
        <a className={menu.mode==='min'?'toggle collapsed':'toggle'} onClick={onMenuToggleMin}><Icon type={menu.mode=='min'?"caret-down":"caret-up"} /></a>
        <div className='logo-image'><img src='images/logo.png' onClick={onMenuToggleMin} /></div>
      </div>;
    }   

    return <div  id='layout' className ={'layout-' + viewType}>
      <div id='layout-header'>
        {layoutLogo}
        {viewType=='xs' || viewType=='sm'?buildMinQuicks(user,customActions):buildNormalQuicks(user,customActions)}
        
      </div>
      <div id='layout-content' className={"menu-" + menu.mode}>
        <div id='layout-sider'><MainMenu id='main-menu' className={menu.hidden?'hidden':''}></MainMenu></div>
        <div id='layout-body'>
          <div id='layout-navs'></div>
          <div id='layout-workarea'><WorkArea id="workarea" /></div>
        </div>
      </div>
      {dialog.enable===true?<Dialog />:null}
      {auth.enable===true?<Auth {...auth} onAuthSuccess={onAuthSuccess}></Auth>:null}
    </div>;
  }
}

let App = connect((state)=>{return {...state}},(dispatch)=>{
  return {
    onAuthSuccess:(data)=>dispatch({type:"auth.success",data:data}),
    onMenuToggleMin:()=>dispatch({type:"menu.toggleMin"}) 
  }
})(AppView);



let controller ={
  "resize":(state:IAppState,action)=>{
    if(rszDelayTick){
      clearTimeout(rszDelayTick);rszDelayTick=0;
    }
    let vtype = viewType();
    let menuMode = state.menu.mode || 'normal';
    let beforeMode = state.menu.beforeMode;
    if(vtype==='xs'){
      beforeMode = 'normal';
      menuMode = 'min';
    }
    if(!beforeMode) beforeMode='normal';
    return {
      viewType:vtype,
      menu:{mode:menuMode,beforeMode :beforeMode}
    };
  },
  "menu.toggleFold":(state:IAppState,action)=>{
    return {
      menu:{mode:state.menu.mode==='fold'?'normal':'fold'}
    }
  },
  "menu.toggleMin":(state:IAppState,action)=>{
    let beforeMode = state.menu.beforeMode;
    if(beforeMode===undefined) beforeMode = state.menu.mode || 'normal';
    
    return {
      menu:{mode:state.menu.mode==='min'?beforeMode:'min',beforeMode:beforeMode }
    }
  },
  

  "menu.click":(state,action)=>{
    let node = action.node;
    let url = node.Url;
    if(!url) return state;
    if(url.indexOf("[dispatch]:")>=0){
      let actionJson = url.substr("[dispatch]:".length);
      let action = JSON.parse(actionJson);
      let handler = controller[action.type];
      if(handler) return handler.call(this,state,action);
      return state;
    }
    return controller.navigate.call(this,state,{
      type:"navigate",
      module:url
    });
    return state;
  },
  "dialog":(state,action)=>{
    action.visible = true;
    if(!action.deferred) action.deferred = new Deferred();
    action.transport = {'__transport__':'dialog'};
    return mergemo(state,{
      dialog:action
    });
  },
  "dialog.ok":(state,action)=>{
    state.dialog.deferred.resolve({status:"ok",result:state.dialog.transport.exports});
    return mergemo(state,{
      dialog:{visible:false,deferred:null,$transport:null}
    });
  },
  "dialog.cancel":(state,action)=>{
    state.dialog.deferred.resolve({status:"cancel"});
    return mergemo(state,{
      dialog:{visible:false,deferred:null}
    });
  },
  "navigate":(state,action)=>{
    action.transport={"__transport__":"app.navigate"};
    action.superStore = appStore;
    return {...state,workarea:{pages:[action]}};
  },
  "auth":(state, action)=>{
    return {auth:{enable:true}};
  },
  
  "auth.success":(state,action)=>{
    let menus = buildMenuModel(action.data);
    return {
      menu:{
        data:menus
      },
      user:{data:action.data.User},
      auth:{data:action.data.Auth,enable:false}
    };
  }
};
function buildMenuModel(authData){
  let menus :{[id:string]:IMenuItem}={};
  let perms = authData.Permissions;
  let roots :IMenuItem[]=[];
  for(let i =0,j=perms.length;i<j;i++){
    let perm = perms[i];
    let node = menus[perm.Id]=buildMenuItem(perm,menus[perm.Id]);
    if(perm.ParentId){
      let pnode:IMenuItem = menus[perm.ParentId] || (menus[perm.ParentId]={Id:perm.ParentId});
      if(!pnode.Children)pnode.Children=[];
      pnode.Children.push(node);
    }else {
      roots.push(node);
    }
    
  }
  return roots;
}
function buildMenuItem(perm,item?:IMenuItem){
  item ||(item={Id:perm.Id});
  item.Name = perm.Name;
  item.Icon = perm.Icon || "mail";
  if(perm.Url) item.Url = perm.Url;
  else if(perm.ControllerName){
    perm.Url = perm.ControllerName + '/' + (perm.ActionName||"");
  }
  return item;
}

let rszDelayTick;
attach(window,"resize",()=>{
  if(appStore) {
    if(rszDelayTick) clearTimeout(rszDelayTick);
    rszDelayTick = setTimeout(() => {
      appStore.dispatch({type:'resize'});
    }, 200);
  }
})

axios.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest','X-Requested-DataType':'json','X-Response-DataType':'json'};
axios.interceptors.response.use((response) =>{
  if(response.status==='401'){
    setTimeout(()=>{appStore.dispach({type:'user.signin'})},0);
    throw response;
  }
  return response.data;
},(err)=>{
  console.error(err);
  alert(err);
});
const api ={
  dialog:(opts)=>{
    let deferred = new Deferred();
    let action ={type:"dialog", deferred:deferred,...opts};
    appStore.dispatch(action);
    return deferred.promise();
  },
  GET:(url,data) :IThenable=>{
    return axios.get(url,data);
  },
  POST : (url,data):IThenable=>{
    return axios.post(url,data);
  },
  store:null
}; 
define("app",api);
let view_type = viewType();
let defaultModel = {
  viewType:view_type,
  menu:{
    mode:view_type=='xs'?'min':'normal',
    beforeMode:'normal'
  }
}
let appStore;
let MOD= $mountable(App,{
  model :defaultModel,
  mapStateToProps:null,
  onCreating:(reduxParams:IMountArguments)=>{
    appStore = api.store = reduxParams.store
  },
  mapDispatchToProps:(dispatch)=>{
    return {
      onOk:()=>dispatch({type:"dialog.ok"}),
      onCancel:()=>dispatch({type:"dialog.cancel"})
    }
  },
  controller:controller
});
let $mount = MOD.$mount;
MOD.$mount =(props:any,targetElement:HTMLElement,superStore,transport?:any)=>{
  return new Promise((resolve,reject)=>{
    let authConfig = props.auth= cloneObject(config.auth);
    authConfig.authview_resolve = resolve;
    authConfig.enable = true;
    $mount(props,targetElement);
  });
  
}
export default MOD;












