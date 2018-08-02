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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/utils", "lib/ui"], function (require, exports, react_1, antd_1, utils_1, ui_1) {
    "use strict";
    exports.__esModule = true;
    var AuthView = /** @class */ (function (_super) {
        __extends(AuthView, _super);
        function AuthView(props) {
            var _this = _super.call(this, props) || this;
            _this.keepCenter = function () {
                var elem = _this.elem;
                while (elem) {
                    if (elem.parentNode == document.body)
                        break;
                    elem = elem.parentNode;
                }
                if (!elem) {
                    if (_this.isAttached)
                        utils_1.detech(window, "resize", _this.keepCenter);
                }
                var w = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
                var h = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
                _this.elem.style.height = h + "px";
                _this.form.style.left = (w - _this.form.clientWidth) / 2 + "px";
                _this.form.style.top = (h - _this.form.clientHeight) / 2 + "px";
            };
            return _this;
        }
        AuthView.prototype.render = function () {
            var _this = this;
            var state = this.props.auth;
            return react_1["default"].createElement("div", { ref: function (node) { return _this.elem = node; }, id: 'auth-area', style: { position: "fixed", top: 0, left: 0, width: '100%' } },
                react_1["default"].createElement("div", { ref: function (node) { return _this.bg = node; }, className: 'auth-bg' }),
                react_1["default"].createElement("form", { className: 'grid auth-form', ref: function (node) { return _this.form = node; }, style: { position: "fixed" } },
                    react_1["default"].createElement("h1", null,
                        react_1["default"].createElement(antd_1.Icon, { type: "lock" }),
                        " \u7528\u6237\u767B\u9646"),
                    react_1["default"].createElement("div", { className: 'col-d1' },
                        react_1["default"].createElement(ui_1.Field, { label: react_1["default"].createElement(antd_1.Icon, { type: "user" }), name: "Username", validStates: this.props.validStates },
                            react_1["default"].createElement(antd_1.Input, { name: "Username", value: state.credence.Username, placeholder: "\u7528\u6237\u540D", onChange: this.props["auth.text_changed"] }))),
                    react_1["default"].createElement("div", { className: 'col-d1' },
                        react_1["default"].createElement(ui_1.Field, { label: react_1["default"].createElement(antd_1.Icon, { type: "key" }), name: "Password", validStates: this.props.validStates },
                            react_1["default"].createElement(antd_1.Input, { name: "Password", type: "password", value: state.credence.Password, placeholder: "\u5BC6\u7801", onChange: this.props["auth.text_changed"] }))),
                    react_1["default"].createElement("div", { className: 'col-d1 rememberMe' },
                        react_1["default"].createElement(ui_1.Field, { label: "" },
                            react_1["default"].createElement(antd_1.Checkbox, { name: "RememberMe", checked: state.credence.RememberMe ? true : false, onChange: this.props["auth.check_changed"] }),
                            " \u8BB0\u4F4F\u6211 ",
                            react_1["default"].createElement(antd_1.Icon, { type: "tag-o" }))),
                    react_1["default"].createElement("div", { className: 'col-d1 actions' },
                        react_1["default"].createElement(antd_1.Button, { onClick: this.props["auth.submit"] },
                            react_1["default"].createElement(antd_1.Icon, { type: "unlock" }),
                            " \u767B\u9646 ")),
                    react_1["default"].createElement("div", { className: 'col-d1' }, state.message ? react_1["default"].createElement("div", { className: 'error-message', dangerouslySetInnerHTML: { __html: state.message } }) : null)));
        };
        AuthView.prototype.componentDidMount = function () {
            if (!this.isAttached) {
                utils_1.attach(window, 'resize', this.keepCenter);
                this.isAttached = true;
            }
            this.keepCenter();
        };
        AuthView.prototype.componentDidUpdate = function () {
            if (!this.isAttached) {
                utils_1.attach(window, 'resize', this.keepCenter);
                this.isAttached = true;
            }
            this.keepCenter();
        };
        AuthView.prototype.componentWillUnmount = function () {
            if (this.isAttached) {
                utils_1.detech(window, 'resize', this.keepCenter);
                this.isAttached = false;
            }
        };
        return AuthView;
    }(react_1.Component));
    exports["default"] = AuthView;
});
