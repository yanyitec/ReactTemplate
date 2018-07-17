
import  React, { Component } from 'lib/react/react';
import { Menu, Icon, Modal  } from 'lib/antd/antd';
import {viewType} from 'lib/ui';

export interface IMenuItem{
    Id:string;
    Name?:string;
    Icon?:string;
    Url?:string;
    Children?:IMenuItem[];
}
  
  
export interface IMainMenuState{
    data:IMenuItem[];
    defaultSelectedKeys:string[];
    defaultOpenKeys:string[];
    mode:string; // icon = 只显示图标,min = 最小化 ,normal
    beforeMode:string; //min 之前的Mode
    hidden:boolean;
    className?:string;
    timer:number;
}
export interface IMainMenuNotice{
    onItemClick:Function;
    onToggleIcon:Function;
}

  const SubMenu = Menu.SubMenu;
  export default class MainMenuView extends Component{
    props:IMainMenuState & IMainMenuNotice;
    collapsed:boolean;
    state: any;
    setState:Function;
    
    constructor(props:IMainMenuState & IMainMenuNotice){
      super(props);
    }
    
    render(){
        const {data,defaultSelectedKeys,defaultOpenKeys,mode,hidden,className
            ,onItemClick,onToggleIcon
        } = this.props;
        let className1 = className || "";
        if(hidden) className1 += ' hidden';
        if(mode==='fold') className1 += ' fold';
        let vt = viewType();
      
        return <div id={(this.props as  any).id||""} className ={hidden?'hidden':''}>
            {   mode==='min' || mode=='horizontal' || vt==='xs'?null: 
                <div className='toggle-menu' onClick={onToggleIcon as any}>
                    <Icon  type={mode==='fold'?'menu-unfold':'menu-fold'}/>
                </div>
            }
            <Menu className='menus'
                defaultSelectedKeys={defaultSelectedKeys}
                defaultOpenKeys={defaultOpenKeys}
                mode='inline'
                theme="dark"
                inlineCollapsed={mode=='fold'?true:false}
            >
                {this._buildMenu(data,onItemClick)}
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