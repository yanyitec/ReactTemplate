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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/module", "lib/utils"], function (require, exports, React, antd_1, module_1, utils_1) {
    "use strict";
    exports.__esModule = true;
    var AccountListView = /** @class */ (function (_super) {
        __extends(AccountListView, _super);
        function AccountListView(props) {
            return _super.call(this, props) || this;
        }
        AccountListView.prototype.render = function () {
            var _this = this;
            var cols = AccountListView.columns.slice();
            var actionCol = {
                title: '操作',
                key: 'actions',
                render: function (text, record) { return (React.createElement("span", null,
                    React.createElement("a", { href: "javascript:;" },
                        React.createElement(antd_1.Icon, { type: "profile" }),
                        "\u67E5\u770B"),
                    React.createElement(antd_1.Divider, { type: "vertical" }),
                    React.createElement("a", { href: "javascript:;", onClick: function () { return _this.props["remove"](record); } },
                        React.createElement(antd_1.Icon, { type: "close" }),
                        "\u5220\u9664"),
                    React.createElement(antd_1.Divider, { type: "vertical" }),
                    React.createElement("a", { href: "javascript:;", onClick: function () { return _this.props["modify"](record); } },
                        React.createElement(antd_1.Icon, { type: "edit" }),
                        "\u4FEE\u6539"))); }
            };
            cols.push(actionCol);
            var data = this.props.Items;
            return React.createElement(antd_1.Table, { columns: cols, rowKey: function (record) { return record.Id; }, dataSource: data, pagination: this.props.pagination, loading: this.props.loading, onChange: this.props["handleTableChange"] });
        };
        AccountListView.initialize = function (props) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                _this.$post("{Site}/Site/Accounts", {}).then(function (result) {
                    //for(let n in result) props[n] = result[n];
                    resolve(result);
                });
            });
        };
        AccountListView.actions = {
            "remove": function (state, action) {
                var _this = this;
                var me = this;
                var record = action;
                action.payload = new Promise(function (resolve, reject) {
                    action.payload = _this.$confirm("是否确定要删除该记录?", "warning").then(function (btn) {
                        if (btn.status != "ok")
                            return null;
                        me.$waiting("正在删除...");
                        me.$post("{Site}/Site/RemoveAccount", { id: record.Id }).then(function (rs) {
                            me.$waiting(false);
                            var items = utils_1.array_filter(state.Items, function (item) { item.Id != record.Id; });
                            resolve({ Items: items });
                        });
                    });
                });
                return state;
            },
            "modify": function (state, action) {
            }
        };
        AccountListView.columns = [{
                title: '用户名',
                dataIndex: 'Username',
                key: 'Username'
            }, {
                title: '显示名',
                dataIndex: 'DisplayName',
                key: 'DisplayName'
            }, {
                title: '电子邮件',
                dataIndex: 'Email',
                key: 'Email'
            }, {
                title: '最后登陆时间',
                dataIndex: 'LastLoginTime',
                key: 'LastLoginTime'
            }];
        return AccountListView;
    }(React.Component));
    exports["default"] = module_1.__module__(AccountListView);
});
