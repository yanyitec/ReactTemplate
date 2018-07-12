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
define(["require", "exports", "lib/react/react", "ui"], function (require, exports, React, ui_1) {
    "use strict";
    exports.__esModule = true;
    var My = /** @class */ (function (_super) {
        __extends(My, _super);
        function My(props) {
            var _this = _super.call(this, props) || this;
            _this.onChange = function (evt) {
                _this.setState({
                    value: evt.target.value
                });
            };
            _this.state = { value: props.importValue };
            return _this;
        }
        My.prototype.render = function () {
            var _this = this;
            if (this.props.transport)
                this.props.transport.getModelResult = function () {
                    return _this.state.value;
                };
            return React.createElement("div", null,
                React.createElement("h1", null, "\u6211\u662F\u53EF\u4EE5\u7528\u5728\u6A21\u6001\u6846\u4E2D\u7684\u9875\u97622"),
                React.createElement("input", { type: "text", value: this.state.value, onChange: this.onChange }));
        };
        return My;
    }(React.Component));
    exports["default"] = My;
    ui_1.$mountable(My);
});
