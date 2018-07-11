
import  React, { Component } from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import { Menu, Icon, Button,Modal   } from 'lib/antd/antd';


import {Loadable} from 'ui';
declare var Deferred : any;
declare var Promise : any;
declare var define:any;

const SubMenu = Menu.SubMenu;



let json = [
  {
    Id:"1",
    Name:"弹出模态框",
    Icon:"mail",
    url:"javascript:dialog"
  },
  {
    Id:"2",
    Name:"加载test/my模块",
    url:"test/my",
    Icon:"mail"
  },
  {
    Id:"3",
    Name:"c",
    Icon:"mail",
    ChildNodes:[
      {
        Id:"5",
        Name:"3",
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


export default class App extends Component{
  setState:Function;
  props:any;
  modalPromise:IPromise;
  constructor(props){
    super(props);
    define("app",this);
  }
  state = {
    layout_collapsed: false,
    modal_visible:false,
    modal_title:"",
    modal_content:"一个模态框",
    workspace_module:undefined
  }
  
  _toggleLayoutCollapsed = () => {
    this.setState({
      collapsed: !this.state.layout_collapsed,
    });
  }

  _onMenuClick=(node)=>{
    if(node.url.indexOf("javascript:")>=0){
      let actionName = node.url.substr("javascript:".length);
      let action = (this as any)[actionName];
      if(typeof action==='function') action.call(this,node);
    }else {
      this.setState({
        workspace_module:node.url
      });
    }
  }
    
   _buildMenuName=(node) => {
    if(node.url){
      return <span onClick={()=>this._onMenuClick(node)}>{node.Name}</span>
    }else{
      return <span>{node.Name}</span>;
    }
  }
  _buildMenu=(data)=>{
    let result = [];
    for(let i =0,j=data.length;i<j;i++){
      let node = data[i];
      let name = this._buildMenuName(node);
      if(node.ChildNodes && node.ChildNodes.length){
        let subs = this._buildMenu(node.ChildNodes);
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
  dialog = (opts) => {
    if(this.modalPromise)return (Promise as any).reject(undefined);
    opts||(opts={});
    let content = opts.content;
    
    if(opts.url){
      let contentOpts = opts.contentOpts || {};
      contentOpts.$dialogOpts = opts;
      contentOpts.key = this.genId();
      content = <Loadable module={opts.url} parameters={...contentOpts} key={contentOpts.key} />
    }
    this.setState({
      modal_visible: true,
      modal_title : opts.title||"",
      modal_content: content||""
    });
    let promise = this.modalPromise = new Deferred();
    promise.opts = opts;
    return promise;
  }
  
  _onModalOk = () => {
    this.setState({
      modal_visible: false,
      confirmLoading: false,
    });
    let result;
    if((this.modalPromise as any).opts && (this.modalPromise as any).opts.$getDialogResult){
      result = (this.modalPromise as any).opts.$getDialogResult();
    }
    (this.modalPromise as any).resolve({status:"ok",result:result});
    this.modalPromise=undefined;
  }
  
  _onModalCancel = () => {
    this.setState({
      modal_visible: false,
    });
    (this.modalPromise as any).resolve({status:"cancel"});
    this.modalPromise=undefined;
  }

  genId = ()=>{
    let idSeed=1;
    let time = new Date().valueOf().toString();
    this.genId = ()=>{
        if(idSeed>2100000000){ 
            idSeed=1;time = new Date().valueOf().toString();
        }
        return  idSeed.toString() + '_' + time;
    };
    return this.genId();
}

  render(){
    let loadable;
    if(this.state.workspace_module){
      loadable = <Loadable className='content' module={this.state.workspace_module} loadingText="正在加载..." />;
    }
    //const  = this.props;
        let logo;
        if(true){
          logo = <Button type="primary" onClick={this._toggleLayoutCollapsed} >
          <Icon type={this.state.layout_collapsed ? 'menu-unfold' : 'menu-fold'} />
          </Button>;
        }
        let menuNodes= this._buildMenu(json);
        const menu = <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.props.layout_collapsed}
      >
        {menuNodes}
      </Menu>;
        return <div  className={this.state.layout_collapsed?"layout layout-collapsed":"layout"}>
            <div className='sider'><div className={this.state.layout_collapsed?"collapsed":""}>{logo}{menu}</div></div>
            <div className='header'>header</div>
            <div className="content">{loadable}
            </div>
            
            <Modal title={this.state.modal_title}
              visible={this.state.modal_visible}
              onOk={this._onModalOk}
              confirmLoading={false}
              onCancel={this._onModalCancel}
            >
              <div>{this.state.modal_content}</div>
            </Modal>
        </div>
        //return 
    }
}

(App as any).renderTo = (amountElement:HTMLElement,props:any,container?:any)=>{
  (props||(props={})).$container = container;
  ReactDOM.render(React.createElement(App,props,null),amountElement);
}



