import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as PropTypes from 'lib/react/prop-types';
import {$mountable,FieldsetView,FieldView} from 'lib/ui';
import antd,{Icon,Tooltip,Checkbox,Alert,Button,Collapse} from 'lib/antd/antd';

class FormView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Collapse>
            <Collapse.Panel>
                <FieldsetView header="基本信息">
                    <div className='grid'>
                        <FieldView className='col-d4' name='Id' xs='false' />
                        <FieldView className='col-d4' required={true} name='Name' xs='false' />
                    </div>
                </FieldsetView>
            </Collapse.Panel>
        </Collapse>;
    }
}
export default $mountable(FormView,{

});