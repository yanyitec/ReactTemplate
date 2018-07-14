
import  React, { Component } from 'lib/react/react';
import { Menu, Icon, Modal  } from 'lib/antd/antd';
import {  connect } from 'lib/redux/react-redux';
import * as _Auth from 'lib/Auth';
import * as axios from 'lib/axios';
import {cloneObject} from 'lib/utils';
//import * as config from 'conf/config';

import {mergemo,getCookie,$mountable,CascadingView, ContentView, IMountArguments, Center} from 'lib/ui';


declare var Deferred : any;
declare var Promise : any;
declare var define:any;


const SubMenu = Menu.SubMenu;
let Auth:Component = _Auth as Component;

interface IMenuItem{
  Id:string;
  Name?:string;
  Icon?:string;
  Url?:string;
  Children?:IMenuItem[];
}


interface IMenuModel{
  data:any[],
  defaultSelectedKeys:boolean,
  defaultOpenKeys:boolean,
  collapsed:boolean
}
interface IDialogModel{
  visible:boolean,opts:{title:string,content:any,url:string,width:any,height:any}
}
interface IWorkAreaModel{
  pages:any[]
}

interface IAppModel{
  menu:IMenuModel;
  dialog:IDialogModel;
  workarea:IWorkAreaModel;
  user:any;
}

class MainMenuView extends Component{
  props:any;
  constructor(props){
    super(props);
  }
  render(){
    const { onClick} = this.props;
    const {data,defaultSelectedKeys,defaultOpenKeys,collapsed} = this.props;
    
    return <Menu
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        {this._buildMenu(data,onClick)}
    </Menu>;
  }

  _buildMenuName=(node,menuClickHandler) => {
    if(node.Url){
      return <span onClick={()=>menuClickHandler(node)}>{node.Name}</span>
    }else{
      return <span>{node.Name}</span>;
    }
  }
  _buildMenu=(children,menuClickHandler)=>{
    let result = [];
    for(let i =0,j=children.length;i<j;i++){
      let node = children[i];
      let name = this._buildMenuName(node,menuClickHandler);
      if(node.Children && node.Children.length){
        let subs = this._buildMenu(node.Children,menuClickHandler);
        result.push(<SubMenu key={node.Id} title={<span><Icon type={node.Icon|| "email"} />{name}</span>}>
        {subs}
        </SubMenu>);
      }else{ 
        result.push(<Menu.Item key={node.Id}>
          <Icon type={node.Icon|| "email"} />
          {name}
        </Menu.Item>);
      }
    }
    return result;
  }
}
let MainMenu = connect((model:IAppModel)=>{return model.menu},(dispatch)=>{
  return {
    onClick:(node)=>dispatch({type:"menu.click",node:node})
  }
})(MainMenuView);

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

let Dialog = connect((model:IAppModel)=>{return model.dialog},(dispatch)=>{
  return {
    onOk:()=>dispatch({type:"dialog.ok"}),
    onCancel:()=>dispatch({type:"dialog.cancel"})
  }
})(DialogView);




let WorkArea = connect((model:IAppModel)=>model.workarea,(dispatch)=>{
  return {};
})(CascadingView);


export class AppView extends Component{
  props:any;
  render(){
    const {menu,dialog,auth,onAuthSuccess} = this.props;
    const dialogView = dialog.visible?<Dialog />:null;
    if(auth.enable) return <Auth {...auth} onAuthSuccess={onAuthSuccess}></Auth>;
    return <div  className={menu.collapsed?"layout layout-collapsed":"layout"}>
        <div className="sider">
          <MainMenu></MainMenu>
        </div>
        <div className='header'>header</div>
        <div className="content">
          <WorkArea id="workarea" />
        </div>
        {dialogView}
    </div>
  }
}

let App = connect((state)=>{return {...state}},(dispatch)=>{
  return {
    onAuthSuccess:(data)=>dispatch({type:"auth.success",data:data}),
    onCancel:()=>dispatch({type:"dialog.cancel"})
  }
})(AppView);



let controller ={
  
  "menu.click":(model,action)=>{
    let node = action.node;
    let url = node.Url;
    if(!url) return model;
    if(url.indexOf("[dispatch]:")>=0){
      let actionJson = url.substr("[dispatch]:".length);
      let action = JSON.parse(actionJson);
      let handler = controller[action.type];
      if(handler) return handler.call(this,model,action);
      return model;
    }
    return controller.navigate.call(this,model,{
      type:"navigate",
      module:url
    });
    return model;
  },
  "dialog":(model,action)=>{
    action.visible = true;
    if(!action.deferred) action.deferred = new Deferred();
    action.transport = {'__transport__':'dialog'};
    return mergemo(model,{
      dialog:action
    });
  },
  "dialog.ok":(model,action)=>{
    model.dialog.deferred.resolve({status:"ok",result:model.dialog.transport.exports});
    return mergemo(model,{
      dialog:{visible:false,deferred:null,$transport:null}
    });
  },
  "dialog.cancel":(model,action)=>{
    model.dialog.deferred.resolve({status:"cancel"});
    return mergemo(model,{
      dialog:{visible:false,deferred:null}
    });
  },
  "navigate":(model,action)=>{
    action.transport={"__transport__":"app.navigate"};
    action.superStore = appStore;
    return {...model,workarea:{pages:[action]}};
  },
  "auth":(model, action)=>{
    return {auth:{enable:true}};
  },
  
  "auth.success":(model,action)=>{
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
let defaultModel = {}
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












