import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as app from 'app';
import { $mountable } from 'lib/ui';

export default class My extends React.Component{
    onLoadModal=(url?:string)=>{
        (app as any).dialog({title:"里面出来的模态框",module:url||"test/dialog"}).then((state)=>{
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
$mountable(My);