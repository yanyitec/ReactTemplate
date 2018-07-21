import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as PropTypes from 'lib/react/prop-types';
import {FieldsetView,FieldView} from 'lib/ui';
import {$mountable} from 'lib/module';
import antd,{Icon,Tooltip,Checkbox,Alert,Button,Collapse} from 'lib/antd/antd';

class FormView extends React.Component{
    props:any;
    constructor(props){
        super(props);
    }
    render(){
        return <Collapse>
            <Collapse.Panel>
                <FieldsetView header="基本信息">
                    <div>{this.props.Id}</div>
                    <div className='grid'>
                        <FieldView className='col-d4' name='Id' xs='false' />
                        <FieldView className='col-d4' required={true} name='Name' inputType='DatePicker' xs='false' />
                    </div>
                </FieldsetView>
            </Collapse.Panel>
        </Collapse>;
    }
}
export default $mountable(FormView,{

});