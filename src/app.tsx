
import  React, { Component } from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { Menu, Icon, Button,Modal   } from 'lib/antd/antd';
import { createStore } from 'lib/redux/redux';
import { Provider, connect } from 'lib/redux/react-redux';

import {mergemo,$mountable,CascadingView, ContentView, IMountArguments, SigninView} from 'ui';

declare var Deferred : any;
declare var Promise : any;
declare var define:any;

const SubMenu = Menu.SubMenu;



let json = [
  {
    Id:"1",
    Name:"弹出模态框",
    Icon:"mail",
    url:'[dispatch]:{"type":"dialog","text":"hello react."}'
  },
  {
    Id:"2",
    Name:"加载test/my模块",
    Url:"test/my",
    Icon:"mail"
  },
  {
    Id:"22",
    Name:"加载test/dialog模块",
    Url:"test/dialog",
    Icon:"mail"
  },
  {
    Id:"3",
    Name:"c",
    Icon:"mail",
    ChildNodes:[
      {
        Id:"5",
        Name:"dialog2",
        Url:"test/dialog2",
        Icon:"mail"
      },
      {
        Id:"6",
        Name:"6",
        Icon:"mail"
      }
    ]
  },
  {
    Id:"4",
    Name:"d",
    Icon:"mail"
  }
];

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
    const { onClick,model} = this.props;
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
      if(node.ChildNodes && node.ChildNodes.length){
        let subs = this._buildMenu(node.ChildNodes,menuClickHandler);
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

let Signin = connect((model:IAppModel)=>{return model.user},(dispatch)=>{
  return {
    onSigninSuccess:(userInfo)=>{dispatch({user:userInfo,type:'user.signinSuccess'});}
  }
})(SigninView);


let WorkArea = connect((model:IAppModel)=>model.workarea,(dispatch)=>{
  return {};
})(CascadingView);



export class AppView extends Component{
  props:any;
  render(){
    const {menu,dialog,user,menu_collapsed} = this.props;
    const dialogView = dialog.visible?<Dialog />:null;
    if(!user || !user.Id) return <Signin />;
    return <div  className={menu_collapsed?"layout layout-collapsed":"layout"}>
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
    onOk:()=>dispatch({type:"dialog.ok"}),
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
  "user.signinSuccess":(model,action)=>{
    return {...model,user:action.user}
  }
};
const initModel ={
  menu:{
    data:json
  },
  dialog:{width:100},
  workarea:{
    pages:[]
  },
  user:{}
};

const api ={
  dialog:(opts)=>{
    let deferred = new Deferred();
    let action ={type:"dialog", deferred:deferred,...opts};
    appStore.dispatch(action);
    return deferred.promise();
  },
  getStore:()=>appStore
};
define("app",api);
let appStore;
let MOD= $mountable(AppView,{
  model :initModel,
  mapStateToProps:null,
  onCreating:(reduxParams:IMountArguments)=>{
    appStore = reduxParams.store
  },
  mapDispatchToProps:(dispatch)=>{
    return {
      onOk:()=>dispatch({type:"dialog.ok"}),
      onCancel:()=>dispatch({type:"dialog.cancel"})
    }
  },
  controller:controller
});
export default MOD;












