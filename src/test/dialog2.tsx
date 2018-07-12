import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import {$mountable} from 'ui';

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
        if(this.props.transport)this.props.transport.getModelResult = ()=>{
            return this.state.value;
        }

        return <div>
            <h1>我是可以用在模态框中的页面2</h1>
            <input type="text" value={this.state.value} onChange={this.onChange} />
        </div>
    }
    
}
$mountable(My);