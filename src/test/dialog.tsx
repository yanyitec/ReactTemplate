import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as PropTypes from 'lib/react/prop-types';
import {$mountable} from 'lib/module';

export class My extends React.Component{
    props:any;
    state:any;
    setState:Function;
    context:any;
    transport:any;
    //要使用context上下文
    static contextTypes = {
        store: PropTypes.object,
    };
    constructor(props){
        super(props);
        this.transport = props.$transport ||{};
        this.state = {value:props.importValue};
        
    }
    onChange=(evt)=>{
        this.setState({
            value:this.transport.exports = evt.target.value
        });
    }
    onMaster=(evt)=>{
        //每个控件里面都可以用context获取到store
        //this.context.store.dispatch({type:'my.alert',text:"我是dialog.tsx发出的信息"});
        this.context.store.super_store.dispatch({type:'my.alert',text:"我是dialog.tsx发出的信息"});
    }
    onApp=(evt)=>{
        this.context.store.root().dispatch({type:'menu.toggleCollapsed'});
    }
    render(){
        if(this.context.store)this.context.store.getModalResult = ()=>{
            return this.state.value;
        }

        return <div>
            <h1>我是可以用在模态框中的页面</h1>
            <div>这个文本是外面test/my传入的时间字符串:{this.props.text}</div>
            <input type="text" value={this.state.value} onChange={this.onChange} /><br />
            <a onClick={this.onMaster}>调用My页面的方法</a><br />
            <a onClick={this.onApp}>调用App页面的方法</a><br />
        </div>
    }
    
}
export default $mountable(My);
