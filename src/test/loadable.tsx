import * as React from 'lib/react/react';

import {$mountable,Loadable, __module__} from 'lib/module';
class OtherComponent extends React.Component{
    props:any;
    constructor(props:any){
        super(props);
    }
    render(){
        let props = this.props;
        return <div>我是 OtherComponent组件.render产生的内容，<p /> 传递了一个 other值给我:{props.other}</div>;
    }
    
}

class TestLoadable extends React.Component{
    props:any;
    $dialog:any;
    $waiting:any;
    $messageBox:any;
    render(){
        let onContentChange = (e,t)=>{alert("内容有变更"+t);console.log(e);};
        let testLoadableNode = <div>
            我是TestLoadable里面定义的一个组件实例,传递了一个text 给我;
        </div>;
        return <div>
            <h1>Loadable组件单元测试页面</h1>
            <div>当前时间:{new Date().valueOf()}</div>
            <button onClick={()=>{this.$waiting("hello")}}>show 一个waiting</button>
            <button onClick={()=>{this.$messageBox("写点什么,<br />换行实施打发打发<br />","标题","error").then(()=>alert("盒子关闭了"));}}>show 一个messageBox</button>
            <button onClick={()=>{this.$dialog({ctype:'html',content:"hello"}).then((rs)=>alert(rs.status))}}>show 一个dialog</button>
            <fieldset>
                <legend>加载iframe</legend>
                <div>
                    <div>html/htm后缀会自动识别为iframe。指定ctype属性可以强制用iframe</div>
                    <button onClick={this.props["changeIframeUrl"]}>变更url</button>
                    <div>url:{this.props.iframe_url}</div>
                    <div >
                    <Loadable url={this.props.iframe_url} parameters={{text:"s"} } height="80px" onContentChange={onContentChange} />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>加载本地Component</legend>
                <div>
                    <Loadable ctype="Component" Component ={OtherComponent} parameters={{other:"hello"}} />
                </div>
            </fieldset>

            <fieldset>
                <legend>加载本地v-node</legend>
                <div>
                    <Loadable ctype="v-node" content ={testLoadableNode} parameters={{text:"这个值是传递不进去的，虚节点实例已经构建好了"}} />
                </div>
            </fieldset>

            <fieldset>
                <legend>加载text</legend>
                <div>
                    <Loadable ctype="text" content ="就是预先定义好的text<div>hello</div>" parameters={{text:"看看"}} />
                </div>
            </fieldset>

            <fieldset>
                <legend>加载html</legend>
                <div>
                    <Loadable ctype="html" content ="就是预先定义好的html<b>hello</b>" parameters={{text:"看看"}} />
                </div>
            </fieldset>
        </div>;
        
    }
    static state:any={
        iframe_url:"in-iframe.html"
    };

    static actions:any = {
        "changeIframeUrl":function(state,action){
            let newIframeUrl = prompt("请输入新的iframe的url","in-iframe_other.html");
            return {iframe_url:newIframeUrl};
        }
    };
}
export default __module__(TestLoadable);
