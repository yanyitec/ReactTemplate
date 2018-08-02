var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "react", "lib/ui", "lib/axios", "lib/antd/antd"], function (require, exports, react_1, ui_1, $, antd_1) {
    "use strict";
    exports.__esModule = true;
    //#endregion
    //#region 变量
    var FormItem = antd_1.Form.Item;
    var confirm = antd_1.Modal.confirm;
    var formItemLayout2 = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    };
    //#endregion
    //#region 采购单列表
    var PRList = /** @class */ (function (_super) {
        __extends(PRList, _super);
        function PRList(p) {
            var _this = _super.call(this, p) || this;
            _this.handleTableChange = function (pagination, filters, sorter) {
                // const pager = { ...this.state.pagination };
                // pager.current = pagination.current;
                // this.getData(pagination.current,this.state.PRCode);
            };
            /**
             *删除
             *
             * @memberof id PRCode
             */
            _this.del = function (id) {
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
            };
            _this.$p = p;
            return _this;
        }
        PRList.prototype.componentDidMount = function () {
            this.props['PRList.initialize']();
        };
        PRList.prototype.getData = function (index) {
            //    const $this=this;
            //    $this.setState({loading:true});
            //     $.getJSON('http://localhost:50103/values/List',{keyWord:$this.state.searchSupplierValue,PageIndex:index,PRCode:$this.state.PRCode,pageSize:$this.state.pagination.pageSize},function(data){
            //                 $this.setState({dataSource:data.items,loading:false,pagination:{current:data.pageIndex,pageSize:data.pageSize,total:(data.pageCounts)}});
            //             });
        };
        //搜索输入框 事件
        PRList.prototype.handleInputChange = function (e) {
            // this.setState({
            //     searchSupplierValue:e.target.value
            // });
        };
        PRList.prototype.render = function () {
            var _this = this;
            var columns = [
                {
                    title: '编号',
                    dataIndex: 'PRCode',
                    key: 'PRCode'
                }, {
                    title: '采购项目名称',
                    dataIndex: 'PurchaseName',
                    key: 'PurchaseName'
                }, {
                    title: '状态',
                    dataIndex: 'PRStatus',
                    key: 'PRStatus',
                    render: function (text, record, index) {
                        return (react_1["default"].createElement("div", null, getState(record.PRStatus)));
                    }
                }, {
                    title: '需求人',
                    dataIndex: 'Demander',
                    key: 'Demander'
                }, {
                    title: '创建时间',
                    dataIndex: 'CreateTime',
                    key: 'CreateTime'
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    render: function (text, record, index) {
                        return (react_1["default"].createElement("div", null,
                            react_1["default"].createElement(antd_1.Button, { onClick: function () { _this.view(record.PRCode, true); } }, "\u67E5\u770B"),
                            record.PRStatus == 101 ?
                                react_1["default"].createElement(antd_1.Button, { onClick: function () { _this.view(record.PRCode, false); } }, "\u4FEE\u6539")
                                : '',
                            record.PRStatus == 101 ?
                                react_1["default"].createElement(antd_1.Button, { onClick: function () { _this.del(record.PRCode); } }, "\u5220\u9664")
                                : '',
                            react_1["default"].createElement(antd_1.Button, { onClick: function () { } }, "\u5BA1\u6838")));
                    }
                }
            ];
            return (react_1["default"].createElement("div", null,
                react_1["default"].createElement(antd_1.Form, null,
                    react_1["default"].createElement(antd_1.Col, { span: 24, className: "FormCol" },
                        react_1["default"].createElement(antd_1.Row, null,
                            react_1["default"].createElement(antd_1.Col, { span: 5 }),
                            react_1["default"].createElement(antd_1.Col, { span: 10 },
                                react_1["default"].createElement(FormItem, __assign({}, formItemLayout2, { label: "\u5173\u952E\u5B57" }),
                                    react_1["default"].createElement(antd_1.Input, { id: "searchSupplier" }))),
                            react_1["default"].createElement(antd_1.Col, { span: 4 },
                                react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: function () { return _this.getData(1); }, style: { marginLeft: '1px', marginTop: '3px' }, icon: "search" })),
                            react_1["default"].createElement(antd_1.Col, { span: 5 })),
                        react_1["default"].createElement(antd_1.Row, null,
                            react_1["default"].createElement(antd_1.Col, { span: 12 }),
                            react_1["default"].createElement(antd_1.Col, { span: 6 }),
                            react_1["default"].createElement(antd_1.Col, { span: 6 },
                                react_1["default"].createElement(antd_1.Button, { onClick: function () { return console.log(_this.props); }, style: { marginRight: 10 } }, "\u521B\u5EFA\u91C7\u8D2D\u5355")))),
                    react_1["default"].createElement(antd_1.Col, { span: 24 }),
                    react_1["default"].createElement(antd_1.Divider, null))));
        };
        return PRList;
    }(react_1.Component));
    //#endregion 
    //#region 辅助方法
    var urlBase = 'http://localhost:50103/';
    /**
     *根据传入的状态代码
     *
     * @param {*} stateCode 状态代码
     * @returns
     */
    function getState(stateCode) {
        switch (stateCode) {
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
    exports["default"] = ui_1.$mountable(PRList, {
        action_handlers: {
            "PRList.initialize": function (state, action) {
                //初始化
                return {
                    type: 'PRList.initialize',
                    delVisible: false,
                    dataSource: [],
                    pagination: { total: 0, current: 1, pageSize: 10 },
                    loading: false,
                    keyWord: ''
                };
            },
            "PRList.getData": function (state, action) {
                $.getJSON('http://localhost:50103/values/List', { keyWord: $this.state.searchSupplierValue, PageIndex: index, PRCode: $this.state.PRCode, pageSize: $this.state.pagination.pageSize }, function (data) {
                    $this.setState({ dataSource: data.items, loading: false, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: (data.pageCounts) } });
                });
            }
        }
    });
});
