import * as React from 'lib/react/react';
import {Table, Icon, Divider} from 'lib/antd/antd';
import {__module__} from 'lib/module';
import {array_filter} from 'lib/utils';

declare let Promise:any;



class AccountListView extends React.Component{
    props:any;
    $get:any;
    constructor(props){
        super(props);
    }
    render(){
        let cols:any[] = [...AccountListView.columns];
        let actionCol = {
          title: '操作',
          key: 'actions',
          render: (text, record) => (
            <span>
              <a href="javascript:;"><Icon type="profile" />查看</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={()=>this.props["remove"](record)}><Icon type="close" />删除</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={()=>this.props["modify"](record)}><Icon type="edit" />修改</a>
            </span>
          ),
        };
        cols.push(actionCol);
        
        let data = this.props.Items;
        return <Table
            columns={cols}
            rowKey={record => record.Id}
            dataSource={data}
            pagination={this.props.pagination}
            loading={this.props.loading}
            onChange={this.props["handleTableChange"]}
        />;
    }

    static initialize= function(props):IThenable{
      let self = this;
      return new Promise((resolve,reject)=>{
        this.$post("{Site}/Site/Accounts",{}).then((result)=>{
          //for(let n in result) props[n] = result[n];
          resolve(result);
        });
      });
      
    }

    static actions :{[name:string]:(state:any,aciton:any)=>any}={
      "remove":function(state:any,action:any):any{
        let me = this;
        let record = action;
        action.payload = new Promise((resolve,reject)=>{
          action.payload = this.$confirm("是否确定要删除该记录?","warning").then((btn)=>{
            if(btn.status!="ok")return null;
            me.$waiting("正在删除...");
            me.$post("{Site}/Site/RemoveAccount",{id:record.Id}).then((rs)=>{
              me.$waiting(false);
              let items = array_filter(state.Items,(item)=>{item.Id!=record.Id});
              resolve({Items:items});
            });
          });
        });
        
        return state;
      },
      "modify":function(state:any,action:any):any{

      }
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

export default __module__(AccountListView);