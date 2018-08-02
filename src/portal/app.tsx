
import {__module__,Loadable, IModuleCreation, IModuleDefination, IModState} from 'lib/module';
import  React, { Component } from 'lib/react/react';
import { Menu, Icon,Button,Dropdown,Breadcrumb,Input,Checkbox  } from 'lib/antd/antd';

import AuthView,{ ICredence, IAuthState, IAuthData }  from 'portal/auth';
import authValidate from 'portal/auth.validation';
import MainMenuView,{IMainMenuState,IMenuItem, IMainMenuAction} from 'portal/menu';
import config from 'conf/config';
import { viewport, attach } from '../lib/utils';

declare var Deferred : any;
declare var Promise : any;
declare var define:any;

export interface IAppState{
    __$is_workarea__?:boolean|string;
    theme?:string;
    access_token?:string;
    logo_hidden?:boolean;
    auth?:IAuthState;
    menu?:IMainMenuState;
    workarea?:any;
    user?:any;
    nav?:any;
    customActions?:any[];
}
export class AppView extends React.Component{
    refs:any;
    props:any;
    forceUpdate:any;
    state:any;
    context:any;
    setState:any;

    render(){
        let appState :IAppState = this.props;
        let authView = appState.auth.visible===true? <AuthView {...this.props} />:null;
        //if(authView || !appState.access_token) return authView;
        let menu :IMainMenuState = appState.menu;
        let user : any = appState.user.principal;
        let workarea:any = appState.workarea;
        let vp = viewport();

        let contentMode = menu.mode;
        if(menu.collapsed || menu.mode==='min') contentMode = 'collapsed';

        let header :any=null;
        if(user){
            header = <div id='layout-header'>
                {appState.logo_hidden?null:<span id='layout-logo'><img src={`themes/${appState.theme}/images/logo.png`} /></span>}
                <span id='layout-menu-toggle' onClick={this.props["menu.toggleCollapsed"]} onMouseOver={this.props["menu.show"]} onMouseOut={this.props["menu.hide"]}><Icon type="appstore" /></span>
                {
                    vp=='xs'?<NavXSView nav={appState.nav} menu={menu} onNavClick={this.props["nav.click"]}/>:null
                }
                {
                    vp=='xs' || vp=='sm'?buildMinQuicks(user,appState.customActions,this.props):buildNormalQuicks(user,appState.customActions,this.props)
                }
            </div>
        }
        

        return <div  id='layout' >
        { authView }
        { header }
        {menu && menu.roots ?<MainMenuView id='layout-menu-main' {...menu} className={contentMode}
                onMenuClick={this.props["menu.click"]} 
                onMenuToggleFold={this.props["menu.toggleFold"]} 
                onMouseOver ={this.props["menu.show"]}
                onMouseOut={this.props["menu.hide"]}
        />:null}
        <div id='layout-content' className={contentMode}>
            
            <div id='layout-body'>
                { vp!='xs'?<div id='layout-nav'><NavView nav={this.props.nav} menu={menu} onNavClick={this.props["nav.click"]} simple={vp=='sm'} /></div>:null }
                { workarea ?<Loadable {...workarea}  id="layout-workarea" is_workarea={true} />:null }
            </div>
        </div>
        
        
        </div>;
    }
    
    
    static actions : {[name:string]:(state:IAppState,action:any)=>any} = {
        "auth.visible":function(state:IAppState,action){
            return {auth:{visible:true,message:action.message},$mask:null};
        },
        "auth.text_changed":function(state:IAppState,action){
            let text = action.event.target.value;
            let name = action.event.target.name;
            let credence = {};credence[name] = text;
            let validStates = {};validStates[name] = authValidate(name,text);;
            return {auth:{credence:credence,validStates:validStates}};
        },
        "auth.check_changed":function(state:IAppState,action){
            let cked = action.event.target.checked;
            let name = action.event.target.name;
            let credence = {};credence[name] = cked;
            //let validStates = {};validStates[name] = authValidate(name,text);;
            return {auth:{credence:credence}};
        },

        "auth.submit":function(state:IAppState,action:any){
            let credence = state.auth.credence;
            let valid = this.$validate(credence,authValidate,{},true);
            if(valid) return {auth:{message:valid}};
            try{
                if(state.auth.credence.RememberMe){
                    localStorage.setItem("credence",JSON.stringify(credence));
                }else {
                    localStorage.setItem("credence",null);
                }
            }catch(ex){
                console.warn("本地存储credenc失败");
            }
            //if(valid){
            //    action.payload = new Promise((resolve)=>{
            //        valid.then(()=>resolve({type:"auth.visible"}));
            //    });
            //    return state;
            //}
            
            let api = this;
            let auth_url = config.auth.url;
            action.payload=new Promise((resolve)=>{
                api.$post(auth_url,credence).then((authData,data)=>{
                    if(authData && authData.AccessToken){
                        resolve({type:"auth.success",authData:authData});
                    }else {
                        resolve({type:"auth.visible",message:authData?authData.message:null});
                    }
                },(e)=>{
                    console.warn("auth failed",e);
                    resolve({type:"auth.visible"});
                });
            });
            return {auth:{visible:false,message:null},$mask:{content:"登陆中...",__REPLACEALL__:true}};
        },
        "auth.success":function(state:IAppState,action:any){
            let authData:IAuthData = action.authData;
            let credence = state.auth.credence;
            credence.AccessToken =authData.AccessToken;
            try{
                if(state.auth.credence.RememberMe){
                    localStorage.setItem("credence",JSON.stringify(credence));
                }
            }catch(ex){
                console.warn("本地存储credenc失败");
            }
            let newState :IAppState = handle_resize(state);

            let store = this.context.store;
            if(store.__resolve){
                let resolve = store.__resolve;
                setTimeout(()=>resolve(authData),0);
            }
            store.__resolve = store.__reject = null;
            let nodes :{[id:string]:IMenuItem}={};
            let roots :IMenuItem[]=[];

            buildMenuModel(authData.Principal.Permissions,nodes,roots);
            for(let i in authData.Principal.Roles){
                var role = authData.Principal.Roles[i];
                buildMenuModel(role.Permissions,nodes,roots);
            }
            newState.__$is_workarea__="root";
            newState.access_token = authData.AccessToken;
            newState.auth= {visible:false};
            newState.user ={principal: authData.Principal};
            newState.menu.roots = roots;
            newState.menu.nodes = nodes;
            newState.nav ={data:null};
            (newState as IModState).$mask=null;
            return newState;
        },
        "menu.toggleFold":(state:IAppState,action)=>{
            let mode = state.menu.mode==='fold'?'normal':'fold';
            return {
              menu:{mode:mode,hidden:false,beforeMode :mode}
            }
          },
        "menu.toggleCollapsed":(state:IAppState,action)=>{
            return {
                menu:{ collapsed:!state.menu.collapsed,hidden:!state.menu.collapsed }
            }
        },
        "menu.show":(state:IAppState,action)=>{
            if(state.menu.mode==='min' || !state.menu.collapsed) return state;
            if(state.menu.waitForHidden){
                clearTimeout(state.menu.waitForHidden);
            }
            
            return {menu:{hidden:false,waitForHidden:0}};
        },
        "menu.hide":(state:IAppState,action)=>{
            if(state.menu.mode==='min' || !state.menu.collapsed) return state;
            if(state.menu.waitForHidden && action.hideImmediate){
                clearTimeout(state.menu.waitForHidden);
                return {menu:{hidden:true,waitForHidden:0}}
            }
            let waitForHiden = setTimeout(()=>{
                deferred.resolve({type:"menu.hide",hideImmediate:true});
            },100);
            let deferred = new Deferred();
            action.payload = deferred;
            return {menu:{waitForHidden:waitForHiden}};
        },
        
        "menu.click":function(state,action){
            let node = action;
            let url = node.Url;
            if(!url) return state;
            
            return AppView.actions['app.navigate'].call(this,state,{
                type:"app.navigate",
                url:url,
                forceRefresh:true,
                super_store:appStore,
                ctype:'module'
            });
        },
        "app.resize":(state:IAppState,action)=>{
            
            return handle_resize(state);
            
          },
        "app.navigate":function(state:IAppState,action){
            let workarea ={...action};
            workarea.__REPLACEALL__ = true;
            workarea.super_store = appStore;
            workarea.ctype = 'module';
            workarea.tick = new Date().valueOf();
            let nav = state.menu.nodes[action._menuId||action.Url || action.url];
            //action.superStore = appStore;
            return {
                menu:{hidden:state.menu.mode=='min'?true:state.menu.hidden},
                workarea:workarea,
                nav:{data:nav}
            };
        },
        "nav.click":function(state,action){
            let navData = action.event;
            return AppView.actions["menu.click"].call(this,state,navData);
        },
    };

    static state:any={
        __$is_workarea__:"root",
        theme:"light-blue",
        auth:{
            credence:{},
            validStates:{}
        },
        user:{},
        menu:{},
        nav:null
    
        
    };
    static initialize=function(props:IAppState):IThenable{
        let store = appStore = this.context.store;
        let credence :ICredence;

        try{
            let json = localStorage.getItem("credence");
            if(json){
                credence = JSON.parse(json);
                props.auth.credence = credence;
            } 
        }catch(ex){
            console.warn("本地获取credence失败",ex);
        }

        attach(window,'resize',()=>{ store.dispatch({type:"app.resize"}); });

        return new Promise((resolve,reject)=>{
            store.auth().then(resolve,reject);
        });
    };

    static api = {
        "auth":function():IThenable{
            let store = this.context.store;
            let auth_url = config.auth.url;
            return new Promise((resolve,reject)=>{
                let state:IAppState = store.getState();
                store.__resolve = resolve;
                store.__reject= reject;
                if(!state.auth.credence.Username||state.auth.credence.Password){
                    store.dispatch({type:"auth.visible"});
                    return;
                }
                this.$post(auth_url,state.auth.credence).then((authData:IAuthData)=>{
                    if(authData && authData.AccessToken){
                        store.dispatch({type:"auth.success",authData:authData});
                    }else {
                        store.dispatch({type:"auth.visible"});
                    }
                },(e)=>{
                    console.warn("auth failed",e);
                    store.dispatch({type:"auth.visible"});
                });
            }); 
        },
        "navigate":function(url,data?:any):IThenable{
            let action = {
                type:"app.navigate",
                state:data,
                url:url,
                ctype:"module"
            };
            this.context.store.dispatch(action);
            return null;
        }
    };
}
let appStore:any;

function buildMenuModel(perms,nodes:{[id:string]:IMenuItem}, roots:IMenuItem[]){
    
    for(let i =0,j=perms.length;i<j;i++){
        let perm = perms[i];
        let node = nodes[perm.Id]=buildMenuItem(perm,nodes[perm.Id]);
        if(!perm.IsMenu)continue;
        if(perm.ParentId){
            let pnode:IMenuItem = nodes[perm.ParentId] || (nodes[perm.ParentId]={Id:perm.ParentId,_menuId:perm.ParentId});
            if(!pnode.Children)pnode.Children=[];
            //node.Parent = pnode;
            pnode.Children.push(node);
        }else {
            roots.push(node);
        }
        nodes[node.Url] = nodes[node.Id] = node;
      
    }
    
}

let handle_resize =(state:IAppState):any=>{
    let vp = viewport();
      
      if(vp==='xs'){
        return {
          viewport:vp,
          logo_hidden:true,
          menu:{mode:'min',beforeMode : state.menu.beforeMode || state.menu.mode,hidden:true,collapsed:true}
        };
      }else if(vp==='sm'){
        return {
          viewport:vp,
          logo_hidden:false,
          menu:{
            mode:'fold'
          }
        };
      }else {
        return {
          viewport:vp,
          logo_hidden:false,
          menu:{
            mode: state.menu.beforeMode || 'normal'
          }
        };
      }
  }
function buildMenuItem(perm,item?:IMenuItem){
    item ||(item={Id:perm.Id,_menuId:perm.Id});
    item.ParentId = perm.ParentId;
    item.Name = perm.Name;
    item.Icon = perm.Icon || "mail";
    if(perm.Url) item.Url = perm.Url;
    else if(perm.ControllerName && perm.ActionName){
        item.Url = perm.ControllerName + '/' + perm.ActionName;
    }
    return item;
}


function buildNormalQuicks(user,customActions,props:any){
    let userDiv,customDiv;
    if(user){
      let userMenuItems = [
        <Menu.Item key="10000" onClick={props["auth.visible"]}><Icon type="idcard" /> 重登陆</Menu.Item>,
        <Menu.Item key="20000"><Icon type="key" /> 修改密码</Menu.Item>,
        <Menu.Item key="30000"><Icon type="profile" /> 个性化</Menu.Item>,
        <Menu.Item key="40000"><Icon type="logout" /> 退出</Menu.Item>,
      ];
      let userMenu = <Menu>{userMenuItems}</Menu>;
      userDiv  = <div className='user'><Button.Group >
        <Button  type='dashed'><Icon type="user" /><a>{user.DisplayName||user.Username || ' '}</a></Button>
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
  
function buildMinQuicks(user,customActions,props:any){
    let customActionItems,customDiv;
    if(user){
      customActionItems = [
        <Menu.Item key="10000"><Icon type="idcard"  onClick={props["auth.visible"]} /> 重登陆</Menu.Item>,
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

interface INavAction{
    onNavClick:(data)=>any;
  }

function NavView(appProps:IAppState & INavAction  & {simple:boolean}){
    let props = appProps.nav;
    let nodes = appProps.menu.nodes;
    if(!props || !nodes ) return null;
    let node = props.data;
    let onNavClick = appProps["onNavClick"];
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
      var dropdown = <Dropdown overlay={menu} placement="bottomLeft">
      <span>
        {node.Icon?<Icon type={node.Icon} />:null}
        {node.Name} 
      </span>
    </Dropdown>;
      return <Breadcrumb.Item key={node.Id} onClick={()=>onNavClick(node)}>
        <span>
        {node.Icon?<Icon type={node.Icon} />:null}
        {node.Name} 
      </span>
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
    let nodes = appProps.menu.nodes;
    if(!props || !nodes || !props.data) return null;
    let node = props.data;
    let onNavClick = appProps["onNavClick"];
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


export default __module__(AppView);