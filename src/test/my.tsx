import * as React from 'lib/react/react';

import {$mountable} from 'lib/module';
import {$app} from 'portal/app';

export class My extends React.Component{
    props:any;
    
    render(){
        let handler = ()=>{
            return this.props["modal1.show"];
        };
        return <div>
            <h1>Test/My</h1>
            
            <a onClick={this.props["modal1.show"]}>点击我调用app的模态框</a> 
            <div>{this.props.returnFromModal}</div>
            <br />
            <a onClick={this.props["my.invokeSuper"]}>调用外面框架的内容</a>
            <br />
            <a onClick={(e)=>this.props["modal2.show"]("test/dialog2")}>点击我调用app的模态框 ,打开另外一个页面</a>
            <br />
            <a onClick={this.props["my.jump"]}>点击我跳转到form</a>
        </div>
    }
    
}
export default $mountable(My,{
    action_handlers:{
        "my.alert":(state, action)=>{
            alert("test/my 页面调用了alert方法:" + action.text);
            return state;
        },
        "modal2.show":function(state, action){
            
        },
        "modal1.show":function(state,action){
            let now = new Date();
            let t = now.getMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            let param = {
                title:"里面出来的模态框",
                url : 'test/dialog',
                data: {text:t}
            }
            action.payload = this.pop(param).then((result)=>{
                console.log(result);
                //把result 变成一个action
                let action = {
                    type:'my.changeText',
                    status:result.status,
                    data:result.store.getModalResult()
                };
                //框架会dispach这个action
                return action;
            });
            //这里可以添加一些 showmask 的代码
            return state;
        },
        "my.changeText":(state,action)=>{
            //alert(action.status + "->" + action.data);
            return {
                returnFromModal:'点击的按键是:'+action.status+",对话框里的数据是:" +action.data
            };
        },
        //要让this指向store，必须用function而不能用()=>
        "my.invokeSuper":function(state,action){
            this.super_store.dispatch({type:'menu.toggleFold'});
            return state;
        },
        "my.jump" :function(state,action ){
            this.root().navigate('test/form',{Id:'my.jump-idx'});
            return state;
        }
    }
});