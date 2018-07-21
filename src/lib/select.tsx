import * as React from 'lib/react/react';
import * as ReactDOM from 'lib/react/react-dom';
import * as $ from 'lib/jQuery';
import { Tree, Layout, Menu, Breadcrumb, Icon, Input, Table, Alert } from 'lib/antd/antd';
import * as axios from 'lib/axios'
const TreeNode = Tree.TreeNode;
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;
const list = {
    content: {
    },
    tab: {
        width: '800px'
    }
}

//菜单树
class TreeList extends React.Component {
    props: any
    state = {
        treelist: [],
        packjson: {}
    };
    getArray(data) {
        let treenodel = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].childNodes == undefined) {
                treenodel.push(<TreeNode key={data[i].id} title={data[i].nodeName}></TreeNode>);
            }
            else {
                treenodel.push(<TreeNode key={data[i].id} title={data[i].nodeName}>
                    {this.getArray(data[i].childNodes)}
                </TreeNode>);
            }
        }
        return treenodel
    }
    componentDidMount() {
        let that = this;
        this.setState(that.state.packjson = this.props.parms.$dialogOpts.data);
        console.log(this.state.packjson)
        $.ajax({
            method: 'post',
            url: that.state.packjson.treeurl,
            dataType: 'JSON',
        }).done(function (response) {
            that.setState(that.state.treelist[0] = response)
            // console.log(that.state.treelist)
        }).fail(function (ex) { console.log(ex) });
    }
    onSelect = (key, ele) => {
        this.props.onTreeSelected(key);
    }
    render() {
        return (
            <Tree
                showLine
                defaultExpandedKeys={['0-0-0']}
                onSelect={this.onSelect}
            >
                {this.getArray(this.state.treelist)}
            </Tree>
        );
    }

}

export default class SiderDemo extends React.Component {
    props: any
    state = {
        collapsed: false,
        rowData: [],
        searhTxt: '',
        selectTreeKey: '',
        insData: [],
        selectedRowKeys: [],
        manlist: [],
        packjson: {},//配置
    };
    ///加载请求
    componentDidMount() {
        //获取配置
        let that = this;
        this.setState(that.state.packjson = this.props.$dialogOpts.data);
        console.log(this.state.packjson)
        //没有树形菜单
            if(!this.state.packjson.treeurl){
            let that = this;
            $.ajax({
                method: 'post',
                url: that.state.packjson.tburl,
                dataType: 'JSON',
            }).done(function (response) {
                that.setState(that.state.manlist = response)
            }).fail(function (ex) { console.log(ex) });
        }


    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    onSelectMenu = (m) => {
        console.info(m);
    };
    InputSearh = (value) => {
        if(this.state.packjson.treeurl){
            if (!this.state.selectTreeKey) {
                alert('请先选择一个部门')
                return
            }
        }
        this.setState({ searhTxt: value })
    }
    onTreeSelected = (m) => {
        this.setState({ selectTreeKey: m })
        console.log(m)
        let that = this;
        $.ajax({
            method: 'post',
            url: that.state.packjson.tburl + m[0],
            dataType: 'JSON',
        }).done(function (response) {
            that.setState(that.state.manlist = response)
        }).fail(function (ex) { console.log(ex) });
    }
    //操作树
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
        this.setState({ selectedRowKeys });
        this.setState({ insData: selectedRows })
    }
    onClose = function (valueq) {
        let arrindex = null;
        this.state.selectedRowKeys.find(function (value, index) {
            if (value == valueq.key) {
                arrindex = index;
            }
        })
        if (parseInt(arrindex) >= 0) {
            this.setState(this.state.selectedRowKeys.splice(arrindex, 1))
            this.setState(this.state.insData.splice(arrindex, 1))
        }
    };
    render() {
        //返回数据
        if (this.props.$dialogOpts) this.props.$dialogOpts.$getDialogResult = () => {
          
            let result = [];
          
            for (const obj in this.state.insData) {
                for (const item in this.state.manlist) {
                 
                    if (this.state.insData[obj].key == this.state.manlist[item].id) {
                        result.push(this.state.manlist[item])
                    }
                }
            }
            return result;
        }
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:this.state.packjson.ischecked 
        };
        //列表数据
        const data = [];
        this.state.manlist.forEach(e => {
            let obj = {
                key:e.id
            }
             for (const item in this.state.packjson.columns){
                let name = this.state.packjson.columns[item].dataIndex
                obj[name] = e[name]
             }
            data.push(obj)
        })

        return (
            <div style={list.content}>
                <Layout>
                    {
                        this.state.packjson.treeurl ? <Sider style={{ backgroundColor: 'white' }}><TreeList onTreeSelected={this.onTreeSelected} parms={this.props} /></Sider> : ''
                    }
                    <Layout style={{ backgroundColor: 'white' }}>
                        <header>
                            <Search
                                placeholder="请输入要查询的姓名"
                                onSearch={this.InputSearh}
                                enterButton
                                style={{ width: '300px', padding: '20px 0 20px 0', height: '74px' }} />
                        </header>
                        <Content style={{ display: 'flex' }}>
                            <Table style={list.tab} columns={this.state.packjson.columns} dataSource={data} rowSelection={rowSelection} />
                            <div style={{ width: '200px', minHeight: '360', textAlign: 'center' }}>
                                {
                                    this.state.insData.length > 0 ? <div>{this.state.insData.map(item => (
                                        <Alert
                                            key={item.key}
                                            message={item[this.state.packjson.selectType]}
                                            type="success"
                                            closable
                                            onClose={this.onClose.bind(this, item)}
                                        />
                                    ))}</div> : <div>没有数据</div>
                                }
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}


(SiderDemo as any).renderTo = (amountElement: HTMLElement, props: any, container?: any) => {
    (props || (props = {})).$container = container;
    ReactDOM.render(React.createElement(SiderDemo, props, null), amountElement);
}