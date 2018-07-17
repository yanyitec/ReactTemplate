
import  React, { Component } from 'lib/react/react';
import { Menu, Icon, Modal,Button,Dropdown,Breadcrumb  } from 'lib/antd/antd';
import {  connect } from 'lib/redux/react-redux';

import * as axios from 'lib/axios';
import {cloneObject} from 'lib/utils';
import {viewType,attach} from 'lib/ui';
import MainMenuView,{IMainMenuState,IMenuItem, IMainMenuAction} from 'portal/menu';
import Auth,{IAuthState} from 'portal/auth';

//import * as config from 'conf/config';

import {mergemo,getCookie,$mountable,CascadingView, ContentView, IMountArguments, Center} from 'lib/ui';

declare var Deferred : any;
declare var Promise : any;
declare var define:any;

interface INavState{
  disable?:boolean;
  simple?:boolean;
  data?:IMenuItem;
  
}
interface INavAction{
  onNavClick:(data)=>any;
}

interface IAppState{
  auth?:IAuthState;
  menu?:IMainMenuState;
  nav?:INavState;
  dialog?:any;
  workarea?:any;
  user?:any;
  viewType?:string;
  [index:string]:any;
}
interface IAppAction extends IMainMenuAction,INavAction{
    onAuthSuccess:(data)=>any;
    onMenuToggleMin:()=>any;    
}

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

function NavView(appProps:IAppState & INavAction & {simple:boolean}){
  let props = appProps.nav;
  let nodes = appProps.menu.data;
  if(!props || !nodes ) return null;
  let node = props.data;
  let onNavClick = appProps.onNavClick;
  let simple = props.simple;
  let buildCrumbItem = function(node:IMenuItem){
    if(simple){
      return <Breadcrumb.Item key={node.Id} onClick={()=>onNavClick(node)}>
        {node.Icon?<Icon type={node.Icon} />:null}
         {node.Name}
      </Breadcrumb.Item>;
    }
    let items = [];
    let p = node && node.ParentId?nodes[node.ParentId]:undefined;
    if(p && p.Children){
      for(let i =0,j=p.Children.length;i<j;i++){
        ((nd,index)=>{
          if(nd.Id===node.Id)return;
          items.push(<Menu.Item key={nd.Id} onClick={()=>onNavClick(nd)}>
          {nd.Icon?<Icon type={nd.Icon} />:null}
          <span>{nd.Name}</span>
        </Menu.Item>);
        })(p.Children[i],i);
      }
    }
    let menu = items.length==0?null:<Menu>{items}</Menu>;
    return <Breadcrumb.Item key={node.Id} onClick={()=>onNavClick(node)}>
      <Dropdown overlay={menu} placement="bottomLeft">
        <span>
          {node.Icon?<Icon type={node.Icon} />:null}
          {node.Name} 
        </span>
      </Dropdown>
    </Breadcrumb.Item>
  };//end buildDropdown;
  let items = [];
  let nd = node;
  while(nd){
    items.unshift(buildCrumbItem(nd));
    nd = nodes[nd.ParentId];
  }
  items.unshift(<Breadcrumb.Item key="$KEY_HOME" onClick={()=>onNavClick({Id:"Home",Name:"首页"})}>
     <Icon type='home' />
     首页
    </Breadcrumb.Item>);

  return <Breadcrumb>{items}</Breadcrumb>;
}
function NavXSView(appProps:IAppState & INavAction){
  let props = appProps.nav;
  let nodes = appProps.menu.data;
  if(!props || !nodes || !props.data) return null;
  let node = props.data;
  let onNavClick = appProps.onNavClick;
  let items = [];
  let nd = node;
  while(nd){
    ((nd)=>{
      items.push(<Menu.Item onClick={()=>onNavClick(nd)}>
      {nd.Icon?<Icon type={nd.Icon} />:null}
      {nd.Name}
    </Menu.Item>);
    })(nd);
    nd = nodes[nd.ParentId];
  }

  items.unshift(<Menu.Item onClick={()=>onNavClick({Id:"Home",Name:"首页"})}>
     <Icon type='home' />
     首页
    </Menu.Item>);
  
  let menu = <Menu>{items}</Menu>;
  return <Dropdown overlay={menu} placement="bottomCenter">
  <span>
    {node.Icon?<Icon type={node.Icon} />:null}
    {node.Name} 
  </span>
</Dropdown>
}
  

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
    const {menu,dialog,auth,workarea,nav,user,customActions,viewType} = this.props;
 
    let layoutLogo;
    if(viewType==='xs'){
      layoutLogo = <div id='layout-logo'>
        <a className={menu.mode==='min'?'toggle collapsed':'toggle'} onClick={this.props["menu.toggleMin"]}><Icon type={menu.mode=='min'?"menu-unfold":"menu-fold"} /></a>
      </div>;
    }else {
      layoutLogo = <div id='layout-logo'>
        <a className={menu.mode==='min'?'toggle collapsed':'toggle'} onClick={this.props["menu.toggleMin"]} 
          onMouseOver={menu.mode==='min'?this.props["menu.show"]:null}
          onMouseOut={menu.mode==='min'?this.props["menu.hide"]:null}
        >
          <Icon type={menu.mode=='min'?"caret-down":"caret-up"} />
        </a>
        <div className='logo-image'><img src='images/logo.png' onClick={this.props["menu.toggleMin"]} /></div>
      </div>;
    }   

    return <div  id='layout' className ={'layout-' + viewType}>
      <div id='layout-header'>
        {layoutLogo}
        {viewType=='xs'?<NavXSView nav={nav} menu={menu} onNavClick={this.props["nav.click"]}/>:null}
        {viewType=='xs' || viewType=='sm'?buildMinQuicks(user,customActions):buildNormalQuicks(user,customActions)}
        
      </div>
      <div id='layout-content' className={"menu-" + menu.mode}>
        <div id='layout-sider'>
          <MainMenuView id='main-menu' {...menu} className={menu.hidden?'hidden':''} 
            onMenuClick={this.props["menu.click"]} 
            onMenuToggleFold={this.props["menu.toggleFold"]} 
            onMouseOver ={menu.mode==='min'?this.props["menu.show"]:null}
            onMouseOut={menu.mode==='min'?this.props["menu.hide"]:null}
          />
        </div>
        <div id='layout-body'>
          { viewType!='xs'?<div id='layout-nav'><NavView nav={nav} menu={menu} onNavClick={this.props["nav.click"]} simple={viewType=='sm'} /></div>:null }
          <div id='layout-workarea'><CascadingView id="workarea" {...workarea} /></div>
        </div>
      </div>
      {dialog.enable===true?<Dialog />:null}
      {auth.enable===true?<Auth {...auth} onAuthSuccess={this.props["auth.success"]}></Auth>:null}
    </div>;
  }
}





let action_handlers:{[actionName:string]:(state:IAppState,action)=>any} ={
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
    let mode = state.menu.mode==='fold'?'normal':'fold';
    return {
      menu:{mode:mode,hidden:false,beforeMode :mode}
    }
  },
  "menu.toggleMin":(state:IAppState,action)=>{
    let beforeMode = state.menu.beforeMode;
    if(beforeMode===undefined) beforeMode = state.menu.mode || 'normal';
    
    return {
      menu:{mode:state.menu.mode==='min'?beforeMode:'min',beforeMode:beforeMode,hidden:state.menu.mode==='min'?false:true }
    }
  },
  "menu.show":(state:IAppState,action)=>{
    if(state.menu.waitForHidden){
      clearTimeout(state.menu.waitForHidden);
    }
    console.log('menu.show');
    return {menu:{hidden:false,waitForHidden:0}};
  },
  "menu.hide":(state:IAppState,action)=>{
    if(state.menu.waitForHidden && action.hideImmediate){
      clearTimeout(state.menu.waitForHidden);
      return {menu:{hidden:true,waitForHidden:0}}
    }
    let waitForHiden = setTimeout(()=>{
      deferred.resolve({type:"menu.hide",hideImmediate:true});
    },200);
    let deferred = new Deferred();
    action.payload = deferred;
    return {menu:{waitForHidden:waitForHiden}};
  },

  "menu.click":(state,action)=>{
    let node = action.node;
    let url = node.Url;
    if(!url) return state;
    if(url.indexOf("[dispatch]:")>=0){
      let actionJson = url.substr("[dispatch]:".length);
      let action = JSON.parse(actionJson);
      let handler = action_handlers[action.type];
      if(handler) return handler.call(this,state,action);
      return state;
    }
    return action_handlers.navigate.call(this,state,{
      type:"navigate",
      module:url
    });
    return state;
  },
  "nav.click":(state,action)=>{

  },
  "dialog.show":(state,action)=>{
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
  "auth.auth":(state, action)=>{
    return {auth:{enable:true}};
  },
  
  "auth.success":(state,action)=>{
    let{roots, nodes} = buildMenuModel(action.data);
    return {
      menu:{
        data:nodes,
        roots:roots
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
      //node.Parent = pnode;
      pnode.Children.push(node);
    }else {
      roots.push(node);
    }
    
  }
  return {roots:roots,nodes:menus};
}
function buildMenuItem(perm,item?:IMenuItem){
  item ||(item={Id:perm.Id});
  item.ParentId = perm.ParentId;
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
  },
  auth:{
    enable:true
  }
}
let appStore;
let App= $mountable(AppView,{
  model :defaultModel,
  onCreating:(reduxParams:IMountArguments)=>{
    appStore = api.store = reduxParams.store
  },
  action_handlers:action_handlers
});
let $mount = App.$mount;
App.$mount =(props:any,targetElement:HTMLElement,superStore,transport?:any)=>{
  return new Promise((resolve,reject)=>{
    let authConfig = props.auth= cloneObject(config.auth);
    authConfig.authview_resolve = resolve;
    authConfig.enable = true;
    $mount(props,targetElement);
  });
  
}
export default App;












