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
define(["require", "exports", "lib/react/react", "app", "ui"], function (require, exports, React, app, ui_1) {
    "use strict";
    exports.__esModule = true;
    var My = /** @class */ (function (_super) {
        __extends(My, _super);
        function My() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onLoadModal = function (url) {
                app.dialog({ title: "里面出来的模态框", module: url || "test/dialog" }).then(function (state) {
                    alert(state.status + "->" + state.result);
                });
            };
            return _this;
        }
        My.prototype.render = function () {
            var _this = this;
            return React.createElement("div", null,
                React.createElement("h1", null, "Hello1"),
                React.createElement("a", { onClick: function () { return _this.onLoadModal(); } }, "\u70B9\u51FB\u6211\u8C03\u7528app\u7684\u6A21\u6001\u6846"),
                " ",
                React.createElement("br", null),
                React.createElement("a", { onClick: function () { return _this.onLoadModal("test/dialog2"); } }, "\u70B9\u51FB\u6211\u8C03\u7528app\u7684\u6A21\u6001\u6846 ,\u6253\u5F00\u53E6\u5916\u4E00\u4E2A\u9875\u9762"));
        };
        return My;
    }(React.Component));
    exports["default"] = My;
    ui_1.$mountable(My);
});
