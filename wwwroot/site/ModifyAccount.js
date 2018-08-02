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
define(["require", "exports", "lib/react/react", "lib/module"], function (require, exports, React, module_1) {
    "use strict";
    exports.__esModule = true;
    var AccountModifyView = /** @class */ (function (_super) {
        __extends(AccountModifyView, _super);
        function AccountModifyView(props) {
            return _super.call(this, props) || this;
        }
        AccountModifyView.prototype.render = function () {
            return null;
        };
        AccountModifyView.initialize = function (props) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                _this.$get("{Site}/Site/GetAccount", { id: props.AccountId }).then(function (result) {
                    //for(let n in result) props[n] = result[n];
                    resolve({ Detail: result });
                });
            });
        };
        AccountModifyView.actions = {};
        AccountModifyView.columns = [{
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
        return AccountModifyView;
    }(React.Component));
    exports["default"] = module_1.__module__(AccountModifyView);
});
