import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as app from 'app';

export default class My extends React.Component{
    props:any;
    state:any;
    setState:Function;
    constructor(props){
        super(props);
        this.state = {value:props.importValue};
        
    }
    onChange=(evt)=>{
        this.setState({
            value:evt.target.value
        });
    }
    render(){
        if(this.props.$dialogOpts)this.props.$dialogOpts.$getDialogResult = ()=>{
            return this.state.value;
        }

        return <div>
            <h1>我是可以用在模态框中的页面2</h1>
            <input type="text" value={this.state.value} onChange={this.onChange} />
        </div>
    }
    
}
(My as any).renderTo = (amountElement:HTMLElement,props:any,container?:any)=>{
    (props||(props={})).$container = container;
    ReactDOM.render(React.createElement(My,props,null),amountElement);
}