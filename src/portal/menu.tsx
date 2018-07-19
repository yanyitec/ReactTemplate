
import  React, { Component } from 'lib/react/react';
import { Menu, Icon, Modal  } from 'lib/antd/antd';
import {viewport, IViewport} from 'lib/ui';

export interface IMenuItem{
    Id:string;
    Name?:string;
    Icon?:string;
    Url?:string;
    ParentId?:string;
    Children?:IMenuItem[];
}
  
  
export interface IMainMenuState{
    id?:string;
    data?:{[index:string]:IMenuItem};
    roots?:IMenuItem[];
    defaultSelectedKeys?:string[];
    defaultOpenKeys?:string[];
    mode?:string; // icon = 只显示图标,min = 最小化 ,normal
    collapsed?:boolean; //toggle 之前的Mode
    foldable?:boolean;
    hidden?:boolean;
    beforeMode?:string;
    className?:string;
    theme_type?:string;
    waitForHidden?:number;
}
export interface IMainMenuAction{
    onMenuClick:Function;
    onMenuToggleFold:Function;
    onMouseOver:Function,
    onMouseOut:Function
}

  const SubMenu = Menu.SubMenu;
  export default class MainMenuView extends Component{
    props:IMainMenuState & IMainMenuAction;
    collapsed:boolean;
    state: any;
    setState:any;
    forceUpdate:any;
    context:any;
    refs:any;
    
    constructor(props:IMainMenuState & IMainMenuAction){
      super(props);
    }
    
    render(){
        let state :IMainMenuState & IMainMenuAction=  this.props;
        let header = document.getElementById('layout-header');
        if(!header) return null;
        let collapsed = state.collapsed;
        let hidden = state.hidden;
        if(state.mode==='min'){
          if(collapsed===undefined) collapsed = true;
          if(hidden===undefined) hidden=true;
        } 
        //let data= roots;
        //let className1 = state.className || "";
        //if(collapsed) className1 += ' collapsed';
        //if(state.mode==='fold') className1 += ' fold';
        let vt = viewport(true) as IViewport;
        let h = vt.h - header.clientHeight;
        
        

        let menuMode = collapsed && state.mode!=='min'?'vertical': 'inline';
        
        if(state.mode==='min') menuMode='inline';
        else if(collapsed) menuMode = 'vertical';
        else if(state.mode==='horizontal') menuMode = 'horizontal';
        
        let foldable =  menuMode!='vertical' && !collapsed && state.mode!='min';

      
        return <div id={(this.props as  any).id||""}  className={this.props.className}
          style={{display: hidden?'none':'block',height:(state.mode=='normal'|| state.mode=='fold') && !state.collapsed?h+"px":'auto'}} 
          >
            {   foldable?
                <div className='fold-menu' onClick={state.onMenuToggleFold as any}>
                    <Icon  type={state.mode==='fold'?'menu-unfold':'menu-fold'}/>
                </div>:null
            }
            <Menu className='menus'
                defaultSelectedKeys={state.defaultSelectedKeys}
                defaultOpenKeys={state.defaultOpenKeys}
                mode={menuMode}
                onMouseOver = {state.onMouseOver}
                onMouseOut = {state.onMouseOut}
                theme={state.theme_type}
                inlineCollapsed={state.mode=='fold' && menuMode!='vertical'?true:false}
            >
                {this._buildMenu(state.roots,state.onMenuClick)}
            </Menu>
        </div>;
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
            <Icon type={node.Icon|| "mail"} />
            {name}
          </Menu.Item>);
        }
      }
      return result;
    }
  }