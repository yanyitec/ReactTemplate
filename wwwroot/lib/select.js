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
define(["require", "exports", "lib/react/react", "lib/react/react-dom", "lib/jQuery", "lib/antd/antd"], function (require, exports, React, ReactDOM, $, antd_1) {
    "use strict";
    exports.__esModule = true;
    var TreeNode = antd_1.Tree.TreeNode;
    var Header = antd_1.Layout.Header, Content = antd_1.Layout.Content, Footer = antd_1.Layout.Footer, Sider = antd_1.Layout.Sider;
    var SubMenu = antd_1.Menu.SubMenu;
    var Search = antd_1.Input.Search;
    var list = {
        content: {},
        tab: {
            width: '800px'
        }
    };
    //菜单树
    var TreeList = /** @class */ (function (_super) {
        __extends(TreeList, _super);
        function TreeList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = {
                treelist: [],
                packjson: {}
            };
            _this.onSelect = function (key, ele) {
                _this.props.onTreeSelected(key);
            };
            return _this;
        }
        TreeList.prototype.getArray = function (data) {
            var treenodel = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].childNodes == undefined) {
                    treenodel.push(React.createElement(TreeNode, { key: data[i].id, title: data[i].nodeName }));
                }
                else {
                    treenodel.push(React.createElement(TreeNode, { key: data[i].id, title: data[i].nodeName }, this.getArray(data[i].childNodes)));
                }
            }
            return treenodel;
        };
        TreeList.prototype.componentDidMount = function () {
            var that = this;
            this.setState(that.state.packjson = this.props.parms.$dialogOpts.data);
            console.log(this.state.packjson);
            $.ajax({
                method: 'post',
                url: that.state.packjson.treeurl,
                dataType: 'JSON'
            }).done(function (response) {
                that.setState(that.state.treelist[0] = response);
                // console.log(that.state.treelist)
            }).fail(function (ex) { console.log(ex); });
        };
        TreeList.prototype.render = function () {
            return (React.createElement(antd_1.Tree, { showLine: true, defaultExpandedKeys: ['0-0-0'], onSelect: this.onSelect }, this.getArray(this.state.treelist)));
        };
        return TreeList;
    }(React.Component));
    var SiderDemo = /** @class */ (function (_super) {
        __extends(SiderDemo, _super);
        function SiderDemo() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = {
                collapsed: false,
                rowData: [],
                searhTxt: '',
                selectTreeKey: '',
                insData: [],
                selectedRowKeys: [],
                manlist: [],
                packjson: {}
            };
            _this.onCollapse = function (collapsed) {
                _this.setState({ collapsed: collapsed });
            };
            _this.onSelectMenu = function (m) {
                console.info(m);
            };
            _this.InputSearh = function (value) {
                if (_this.state.packjson.treeurl) {
                    if (!_this.state.selectTreeKey) {
                        alert('请先选择一个部门');
                        return;
                    }
                }
                _this.setState({ searhTxt: value });
            };
            _this.onTreeSelected = function (m) {
                _this.setState({ selectTreeKey: m });
                console.log(m);
                var that = _this;
                $.ajax({
                    method: 'post',
                    url: that.state.packjson.tburl + m[0],
                    dataType: 'JSON'
                }).done(function (response) {
                    that.setState(that.state.manlist = response);
                }).fail(function (ex) { console.log(ex); });
            };
            //操作树
            _this.onSelectChange = function (selectedRowKeys, selectedRows) {
                console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
                _this.setState({ selectedRowKeys: selectedRowKeys });
                _this.setState({ insData: selectedRows });
            };
            _this.onClose = function (valueq) {
                var arrindex = null;
                this.state.selectedRowKeys.find(function (value, index) {
                    if (value == valueq.key) {
                        arrindex = index;
                    }
                });
                if (parseInt(arrindex) >= 0) {
                    this.setState(this.state.selectedRowKeys.splice(arrindex, 1));
                    this.setState(this.state.insData.splice(arrindex, 1));
                }
            };
            return _this;
        }
        ///加载请求
        SiderDemo.prototype.componentDidMount = function () {
            //获取配置
            var that = this;
            this.setState(that.state.packjson = this.props.$dialogOpts.data);
            console.log(this.state.packjson);
            //没有树形菜单
            if (!this.state.packjson.treeurl) {
                var that_1 = this;
                $.ajax({
                    method: 'post',
                    url: that_1.state.packjson.tburl,
                    dataType: 'JSON'
                }).done(function (response) {
                    that_1.setState(that_1.state.manlist = response);
                }).fail(function (ex) { console.log(ex); });
            }
        };
        SiderDemo.prototype.render = function () {
            var _this = this;
            //返回数据
            if (this.props.$dialogOpts)
                this.props.$dialogOpts.$getDialogResult = function () {
                    var result = [];
                    for (var obj in _this.state.insData) {
                        for (var item in _this.state.manlist) {
                            if (_this.state.insData[obj].key == _this.state.manlist[item].id) {
                                result.push(_this.state.manlist[item]);
                            }
                        }
                    }
                    return result;
                };
            var selectedRowKeys = this.state.selectedRowKeys;
            var rowSelection = {
                selectedRowKeys: selectedRowKeys,
                onChange: this.onSelectChange,
                type: this.state.packjson.ischecked
            };
            //列表数据
            var data = [];
            this.state.manlist.forEach(function (e) {
                var obj = {
                    key: e.id
                };
                for (var item in _this.state.packjson.columns) {
                    var name_1 = _this.state.packjson.columns[item].dataIndex;
                    obj[name_1] = e[name_1];
                }
                data.push(obj);
            });
            return (React.createElement("div", { style: list.content },
                React.createElement(antd_1.Layout, null,
                    this.state.packjson.treeurl ? React.createElement(Sider, { style: { backgroundColor: 'white' } },
                        React.createElement(TreeList, { onTreeSelected: this.onTreeSelected, parms: this.props })) : '',
                    React.createElement(antd_1.Layout, { style: { backgroundColor: 'white' } },
                        React.createElement("header", null,
                            React.createElement(Search, { placeholder: "\u8BF7\u8F93\u5165\u8981\u67E5\u8BE2\u7684\u59D3\u540D", onSearch: this.InputSearh, enterButton: true, style: { width: '300px', padding: '20px 0 20px 0', height: '74px' } })),
                        React.createElement(Content, { style: { display: 'flex' } },
                            React.createElement(antd_1.Table, { style: list.tab, columns: this.state.packjson.columns, dataSource: data, rowSelection: rowSelection }),
                            React.createElement("div", { style: { width: '200px', minHeight: '360', textAlign: 'center' } }, this.state.insData.length > 0 ? React.createElement("div", null, this.state.insData.map(function (item) { return (React.createElement(antd_1.Alert, { key: item.key, message: item[_this.state.packjson.selectType], type: "success", closable: true, onClose: _this.onClose.bind(_this, item) })); })) : React.createElement("div", null, "\u6CA1\u6709\u6570\u636E")))))));
        };
        return SiderDemo;
    }(React.Component));
    exports["default"] = SiderDemo;
    SiderDemo.renderTo = function (amountElement, props, container) {
        (props || (props = {})).$container = container;
        ReactDOM.render(React.createElement(SiderDemo, props, null), amountElement);
    };
});
