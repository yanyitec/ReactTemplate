//#region import
import React, { Component } from 'react'
import {$app, $mountable } from 'lib/ui';
import * as $ from 'lib/axios'

import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Table,
    Divider,
    Modal,
    message
} from 'lib/antd/antd';
//#endregion
//#region 变量

const FormItem = Form.Item;
const confirm = Modal.confirm;
declare var require :Function;

const formItemLayout2 = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
};
//#endregion
//#region 采购单列表
class PRList extends Component<any, any>
{
    constructor(p) { 

        super(p);
        this.$p=p;
       
    }
  
    componentDidMount() {
       
        this.props['PRList.initialize']();
       
    }  
    getData(index)
    {
    //    const $this=this;
    //    $this.setState({loading:true});
    //     $.getJSON('http://localhost:50103/values/List',{keyWord:$this.state.searchSupplierValue,PageIndex:index,PRCode:$this.state.PRCode,pageSize:$this.state.pagination.pageSize},function(data){
           
    //                 $this.setState({dataSource:data.items,loading:false,pagination:{current:data.pageIndex,pageSize:data.pageSize,total:(data.pageCounts)}});
    //             });
    
    
               
    }  
    
    
    
    
    
    
    
    handleTableChange = (pagination, filters, sorter) => {
       
        // const pager = { ...this.state.pagination };
        // pager.current = pagination.current;
        // this.getData(pagination.current,this.state.PRCode);
        

    }
    
//搜索输入框 事件
    handleInputChange(e){
        // this.setState({
        //     searchSupplierValue:e.target.value
        // });
    }
   

    

    
    /**
     *删除
     *
     * @memberof id PRCode
     */
    del = (id) => {
        // if (id) {

        //     let $this = this;
        //     confirm({
        //         title: '你确定要删除吗?',
        //         content: '',
        //         onOk:()=>  {

                    
        //             $.get('http://localhost:50103/values/DeletePRInfo?PRCode='+id, function (data) {
        //                 if (data == 'Success') {
        //                     $this.getData($this.state.pagination.current, $this.state.PRCode);
        //                     message.success('删除成功!');
        //                 } else {
        //                     message.error('删除失败!');
                           
        //                 }



        //             }
            

              
        //     },
        //         onCancel() {

        //         },
        //     });

        // }
    }
   
    render() {
        const columns = [
            {
                title: '编号',
                dataIndex: 'PRCode',
                key: 'PRCode',
            },{
            title: '采购项目名称',
            dataIndex: 'PurchaseName',
            key: 'PurchaseName',
        }, {
            title: '状态',
            dataIndex: 'PRStatus',
            key: 'PRStatus',
            render:  (text, record, index)=> {
              
               
                return (<div>{getState(record.PRStatus)}</div>);
            
        }
        }, {
            title: '需求人',
            dataIndex: 'Demander',   
            key: 'Demander',
        }, {
            title: '创建时间', 
            dataIndex: 'CreateTime',
            key: 'CreateTime', 
        }, { 

            title: '操作',
            dataIndex: 'action',
            render:  (text, record, index)=> {
              
               
                    return (
                        <div>
                            <Button onClick={()=>{this.view(record.PRCode,true)}} >查看</Button>
                            { 
                                record.PRStatus==101?
                                <Button  onClick={()=>{this.view(record.PRCode,false)}} >修改</Button>
                                :''
                            }
                            { 
                                record.PRStatus==101?
                                <Button  onClick={()=>{this.del(record.PRCode)}} >删除</Button>
                                :''
                            }
                            <Button onClick={()=>{}} >审核</Button>
                        </div>
                    );
                
            }
        }];
        
        return (
            <div>

                <Form>
                    <Col span={24} className="FormCol">
                        <Row>
                        <Col span={5}>

                            </Col>
                            <Col span={10}>
                                <FormItem {...formItemLayout2} label="关键字">
                                   
                                        <Input    id="searchSupplier"/>
                                    

                                </FormItem> 
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={()=>this.getData(1)} style={{ marginLeft: '1px', marginTop: '3px' }} icon="search" />
                            </Col>
                            <Col span={5}>

                            </Col>
                        </Row>
                        <Row>
                        <Col span={12} >
    
                        </Col>
    
                        <Col span={6} >
    
                        </Col>
                        <Col span={6} >
                            <Button onClick={()=>console.log(this.props)} style={{ marginRight: 10 }}>创建采购单</Button>
                          
    
                            
                        </Col>
                    </Row>
                    </Col>
                   
                    <Col span={24}>
                    {/* <Table rowKey="PRCode"  onChange={this.handleTableChange} pagination={this.state.pagination} dataSource={this.state.dataSource} loading={this.state.loading} columns={columns} /> */}
                    </Col>
                    <Divider />
                    
                </Form>
            </div>
        );
    }
   
}

//#endregion 

//#region 辅助方法
const urlBase='http://localhost:50103/';
/**
 *根据传入的状态代码
 *
 * @param {*} stateCode 状态代码
 * @returns
 */
function getState(stateCode)
{
  
    switch(stateCode)
    {
        case '101':
        return '未开始';
        case '111':
        return '待审批';
        case '201':
        return '审核中';
        case '301':
        return '同意';
        case '401':
        return '拒绝';

    }
}
//#endregion

export default $mountable(PRList,{
    action_handlers:{
        "PRList.initialize":(state, action)=>{
            //初始化
           return {
            type:'PRList.initialize',
            delVisible: false,//是否显示删除
            dataSource: [],//列表数据源
            pagination:{total:0,current:1,pageSize:10},//分页信息
            loading:false,//是否加载
            keyWord:'',//搜索关键字
        };
        },
        "PRList.getData":(state, action)=>{
            $.getJSON('http://localhost:50103/values/List',{keyWord:$this.state.searchSupplierValue,PageIndex:index,PRCode:$this.state.PRCode,pageSize:$this.state.pagination.pageSize},function(data){
           
                                $this.setState({dataSource:data.items,loading:false,pagination:{current:data.pageIndex,pageSize:data.pageSize,total:(data.pageCounts)}});
                            });
        },
    } 
});
