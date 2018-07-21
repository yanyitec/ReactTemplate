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
    var My = /** @class */ (function (_super) {
        __extends(My, _super);
        function My() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        My.prototype.render = function () {
            var _this = this;
            var handler = function () {
                return _this.props["modal1.show"];
            };
            return React.createElement("div", null,
                React.createElement("h1", null, "Test/My"),
                React.createElement("a", { onClick: this.props["modal1.show"] }, "\u70B9\u51FB\u6211\u8C03\u7528app\u7684\u6A21\u6001\u6846"),
                React.createElement("div", null, this.props.returnFromModal),
                React.createElement("br", null),
                React.createElement("a", { onClick: this.props["my.invokeSuper"] }, "\u8C03\u7528\u5916\u9762\u6846\u67B6\u7684\u5185\u5BB9"),
                React.createElement("br", null),
                React.createElement("a", { onClick: function (e) { return _this.props["modal2.show"]("test/dialog2"); } }, "\u70B9\u51FB\u6211\u8C03\u7528app\u7684\u6A21\u6001\u6846 ,\u6253\u5F00\u53E6\u5916\u4E00\u4E2A\u9875\u9762"),
                React.createElement("br", null),
                React.createElement("a", { onClick: this.props["my.jump"] }, "\u70B9\u51FB\u6211\u8DF3\u8F6C\u5230form"));
        };
        return My;
    }(React.Component));
    exports.My = My;
    exports["default"] = module_1.$mountable(My, {
        action_handlers: {
            "my.alert": function (state, action) {
                alert("test/my 页面调用了alert方法:" + action.text);
                return state;
            },
            "modal2.show": function (state, action) {
            },
            "modal1.show": function (state, action) {
                var now = new Date();
                var t = now.getMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                var param = {
                    title: "里面出来的模态框",
                    url: 'test/dialog',
                    data: { text: t }
                };
                action.payload = this.pop(param).then(function (result) {
                    console.log(result);
                    //把result 变成一个action
                    var action = {
                        type: 'my.changeText',
                        status: result.status,
                        data: result.store.getModalResult()
                    };
                    //框架会dispach这个action
                    return action;
                });
                //这里可以添加一些 showmask 的代码
                return state;
            },
            "my.changeText": function (state, action) {
                //alert(action.status + "->" + action.data);
                return {
                    returnFromModal: '点击的按键是:' + action.status + ",对话框里的数据是:" + action.data
                };
            },
            //要让this指向store，必须用function而不能用()=>
            "my.invokeSuper": function (state, action) {
                this.super_store.dispatch({ type: 'menu.toggleFold' });
                return state;
            },
            "my.jump": function (state, action) {
                this.root().navigate('test/form', { Id: 'my.jump-idx' });
                return state;
            }
        }
    });
});
