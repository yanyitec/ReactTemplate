import * as React from 'lib/react/react';
import {Table, Icon, Divider} from 'lib/antd/antd';
import {__module__} from 'lib/module';
import {array_filter} from 'lib/utils';

declare let Promise:any;



class AccountModifyView extends React.Component{
    props:any;
    $get:any;
    constructor(props){
        super(props);
    }
    render(){
        return null;
    }

    static initialize= function(props):IThenable{
      let self = this;
      return new Promise((resolve,reject)=>{
        this.$get("{Site}/Site/GetAccount",{id:props.AccountId}).then((result)=>{
          //for(let n in result) props[n] = result[n];
          resolve({Detail:result});
        });
      });
      
    }

    static actions :{[name:string]:(state:any,aciton:any)=>any}={
      
    };

    static columns = [{
        title: '用户名',
        dataIndex: 'Username',
        key: 'Username'
      }, {
        title: '显示名',
        dataIndex: 'DisplayName',
        key: 'DisplayName',
      }, {
        title: '电子邮件',
        dataIndex: 'Email',
        key: 'Email',
      }, {
        title: '最后登陆时间',
        dataIndex: 'LastLoginTime',
        key: 'LastLoginTime',
      }];
}

export default __module__(AccountModifyView);