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
    var OtherComponent = /** @class */ (function (_super) {
        __extends(OtherComponent, _super);
        function OtherComponent(props) {
            return _super.call(this, props) || this;
        }
        OtherComponent.prototype.render = function () {
            var props = this.props;
            return React.createElement("div", null,
                "\u6211\u662F OtherComponent\u7EC4\u4EF6.render\u4EA7\u751F\u7684\u5185\u5BB9\uFF0C",
                React.createElement("p", null),
                " \u4F20\u9012\u4E86\u4E00\u4E2A other\u503C\u7ED9\u6211:",
                props.other);
        };
        return OtherComponent;
    }(React.Component));
    var TestLoadable = /** @class */ (function (_super) {
        __extends(TestLoadable, _super);
        function TestLoadable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestLoadable.prototype.render = function () {
            var _this = this;
            var onContentChange = function (e, t) { alert("内容有变更" + t); console.log(e); };
            var testLoadableNode = React.createElement("div", null, "\u6211\u662FTestLoadable\u91CC\u9762\u5B9A\u4E49\u7684\u4E00\u4E2A\u7EC4\u4EF6\u5B9E\u4F8B,\u4F20\u9012\u4E86\u4E00\u4E2Atext \u7ED9\u6211;");
            return React.createElement("div", null,
                React.createElement("h1", null, "Loadable\u7EC4\u4EF6\u5355\u5143\u6D4B\u8BD5\u9875\u9762"),
                React.createElement("div", null,
                    "\u5F53\u524D\u65F6\u95F4:",
                    new Date().valueOf()),
                React.createElement("button", { onClick: function () { _this.$waiting("hello"); } }, "show \u4E00\u4E2Awaiting"),
                React.createElement("button", { onClick: function () { _this.$messageBox("写点什么,<br />换行实施打发打发<br />", "标题", "error").then(function () { return alert("盒子关闭了"); }); } }, "show \u4E00\u4E2AmessageBox"),
                React.createElement("button", { onClick: function () { _this.$dialog({ ctype: 'html', content: "hello" }).then(function (rs) { return alert(rs.status); }); } }, "show \u4E00\u4E2Adialog"),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u52A0\u8F7Diframe"),
                    React.createElement("div", null,
                        React.createElement("div", null, "html/htm\u540E\u7F00\u4F1A\u81EA\u52A8\u8BC6\u522B\u4E3Aiframe\u3002\u6307\u5B9Actype\u5C5E\u6027\u53EF\u4EE5\u5F3A\u5236\u7528iframe"),
                        React.createElement("button", { onClick: this.props["changeIframeUrl"] }, "\u53D8\u66F4url"),
                        React.createElement("div", null,
                            "url:",
                            this.props.iframe_url),
                        React.createElement("div", null,
                            React.createElement(module_1.Loadable, { url: this.props.iframe_url, parameters: { text: "s" }, height: "80px", onContentChange: onContentChange })))),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u52A0\u8F7D\u672C\u5730Component"),
                    React.createElement("div", null,
                        React.createElement(module_1.Loadable, { ctype: "Component", Component: OtherComponent, parameters: { other: "hello" } }))),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u52A0\u8F7D\u672C\u5730v-node"),
                    React.createElement("div", null,
                        React.createElement(module_1.Loadable, { ctype: "v-node", content: testLoadableNode, parameters: { text: "这个值是传递不进去的，虚节点实例已经构建好了" } }))),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u52A0\u8F7Dtext"),
                    React.createElement("div", null,
                        React.createElement(module_1.Loadable, { ctype: "text", content: "\u5C31\u662F\u9884\u5148\u5B9A\u4E49\u597D\u7684text<div>hello</div>", parameters: { text: "看看" } }))),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u52A0\u8F7Dhtml"),
                    React.createElement("div", null,
                        React.createElement(module_1.Loadable, { ctype: "html", content: "\u5C31\u662F\u9884\u5148\u5B9A\u4E49\u597D\u7684html<b>hello</b>", parameters: { text: "看看" } }))));
        };
        TestLoadable.state = {
            iframe_url: "in-iframe.html"
        };
        TestLoadable.actions = {
            "changeIframeUrl": function (state, action) {
                var newIframeUrl = prompt("请输入新的iframe的url", "in-iframe_other.html");
                return { iframe_url: newIframeUrl };
            }
        };
        return TestLoadable;
    }(React.Component));
    exports["default"] = module_1.__module__(TestLoadable);
});
