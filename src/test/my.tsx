import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as app from 'app';
import { stat } from 'fs';

export default class My extends React.Component{
    onLoadModal=(url?:string)=>{
        (app as any).dialog({title:"里面出来的模态框",url:url||"test/dialog"}).then((state)=>{
            alert(state.status + "->" + state.result);
        });
    }
    render(){
        return <div>
            <h1>Hello1</h1>
            <a onClick={()=>this.onLoadModal()}>点击我调用app的模态框</a> <br />
            <a onClick={()=>this.onLoadModal("test/dialog2")}>点击我调用app的模态框 ,打开另外一个页面</a>
        </div>
    }
    
}
(My as any).renderTo = (amountElement:HTMLElement,props:any,container?:any)=>{
    (props||(props={})).$container = container;
    ReactDOM.render(React.createElement(My,props,null),amountElement);
}