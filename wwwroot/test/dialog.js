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
define(["require", "exports", "lib/react/react", "lib/react/prop-types", "lib/ui"], function (require, exports, React, PropTypes, ui_1) {
    "use strict";
    exports.__esModule = true;
    var My = /** @class */ (function (_super) {
        __extends(My, _super);
        function My(props) {
            var _this = _super.call(this, props) || this;
            _this.onChange = function (evt) {
                _this.setState({
                    value: _this.transport.exports = evt.target.value
                });
            };
            _this.onMaster = function (evt) {
                //每个控件里面都可以用context获取到store
                //this.context.store.dispatch({type:'my.alert',text:"我是dialog.tsx发出的信息"});
                _this.props.$store.superStore.dispatch({ type: 'my.alert', text: "我是dialog.tsx发出的信息" });
            };
            _this.onApp = function (evt) {
                _this.props.$store.root().dispatch({ type: 'menu.toggleCollapsed' });
            };
            _this.transport = props.$transport || {};
            _this.state = { value: props.importValue };
            return _this;
        }
        My.prototype.render = function () {
            var _this = this;
            if (this.transport)
                this.transport.getModalResult = function () {
                    return _this.state.value;
                };
            return React.createElement("div", null,
                React.createElement("h1", null, "\u6211\u662F\u53EF\u4EE5\u7528\u5728\u6A21\u6001\u6846\u4E2D\u7684\u9875\u9762"),
                React.createElement("input", { type: "text", value: this.state.value, onChange: this.onChange }),
                React.createElement("br", null),
                React.createElement("a", { onClick: this.onMaster }, "\u8C03\u7528My\u9875\u9762\u7684\u65B9\u6CD5"),
                React.createElement("br", null),
                React.createElement("a", { onClick: this.onApp }, "\u8C03\u7528App\u9875\u9762\u7684\u65B9\u6CD5"),
                React.createElement("br", null));
        };
        //要使用context上下文
        My.contextTypes = {
            store: PropTypes.object
        };
        return My;
    }(React.Component));
    exports.My = My;
    exports["default"] = ui_1.$mountable(My);
});
