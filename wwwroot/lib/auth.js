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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/axios", "lib/ui"], function (require, exports, react_1, antd_1, axios, ui_1) {
    "use strict";
    exports.__esModule = true;
    var AUTH_COOKIE_NAME = 'AUTH';
    var Auth = /** @class */ (function (_super) {
        __extends(Auth, _super);
        function Auth(props) {
            var _this = _super.call(this, props) || this;
            _this.nameChange = function (e) {
                _this.setState({ Username: e.target.value.replace(/(^\s+)|(\s+$)/, "") });
            };
            _this.pswdChange = function (e) {
                _this.setState({ Password: e.target.value });
            };
            _this.rememberMeChange = function (e) {
                _this.setState({ RememberMe: e.target.checked });
            };
            _this.nameFocusin = function () {
                _this.setState({ nameInputing: true });
            };
            _this.nameFocusout = function (e) {
                var name = e.target.value.replace(/(^\s+)|(\s+$)/, '');
                _this.setState({ nameInputing: name != '' });
            };
            _this.pswdFocusin = function () {
                _this.setState({ pswdInputing: true });
            };
            _this.pswdFocusout = function (e) {
                _this.setState({ pswdInputing: e.target.value != '' });
            };
            _this.formSubmit = function (e) {
                var errors = _this.checkInputs();
                if (errors.length) {
                    _this.setState({ errorMessages: errors });
                    e.preventDefault();
                    return;
                }
                var auth_type = _this.props.auth_type;
                _this.setState({ processing: true });
                if (auth_type === 'iframe-local' || auth_type === 'iframe') {
                    return;
                }
                _this.doAuth();
                e.preventDefault();
            };
            if (!props.enable)
                return _this;
            _this.view_resolve = props.authview_resolve;
            var authInfo = props.data;
            if (authInfo === undefined) {
                var authJson = ui_1.getCookie(AUTH_COOKIE_NAME);
                if (authJson) {
                    try {
                        authInfo = JSON.parse(authJson);
                    }
                    catch (ex) {
                    }
                }
            }
            authInfo || (authInfo = { Username: '', Password: '', RememberMe: true });
            _this.state = {
                processing: true,
                nameInputing: authInfo.Username,
                pswdInputing: authInfo.Password
            };
            for (var n in authInfo) {
                _this.state[n] = authInfo[n];
            }
            if (authInfo.AccessToken || (authInfo.RememberMe && authInfo.Username && authInfo.Password)) {
                _this.doAuth();
                return _this;
            }
            else {
                _this.state.processing = false;
            }
            return _this;
        }
        Auth.prototype.doAuth = function () {
            var _this = this;
            var authInfo = {
                Username: this.state.Username,
                Password: this.state.Password,
                RememberMe: this.state.RememberMe,
                AccessToken: this.state.AccessToken
            };
            var opts = {
                url: this.props.url,
                method: 'post',
                dataType: this.props.auth_dataType,
                data: authInfo
            };
            var ins = axios.get(this.props.url).then(function (response) {
                if (_this.view_resolve) {
                    var view_resolve = _this.view_resolve;
                    _this.view_resolve = undefined;
                    view_resolve(_this);
                }
                if (response.User.Username !== _this.state.Username || response.User.Password !== _this.state.Password) {
                    _this.setState({ processing: false, errorMessages: ["用户名密码不正确"] });
                    return;
                }
                var authInfo = response.Auth = {
                    Username: _this.state.Username,
                    Password: _this.state.Password,
                    RememberMe: _this.state.RememberMe,
                    AccessToken: response.AccessToken
                };
                ui_1.setCookie(AUTH_COOKIE_NAME, JSON.stringify(authInfo), "s20");
                _this.setState({ enable: false });
                if (_this.props.onAuthSuccess) {
                    _this.props.onAuthSuccess(response);
                }
            }, function (err) {
                _this.setState({
                    errorMessages: ["登录失败"],
                    processing: false
                });
                //if(this.props.auth_reject && rejectable) this.props.auth_reject(err);
            });
        };
        Auth.prototype.checkInputs = function () {
            var error = [];
            if (!this.state.Username) {
                error.push(react_1["default"].createElement("div", { key: error.length }, "\u8BF7\u586B\u5199\u7528\u6237\u540D"));
            }
            if (!this.state.Password) {
                error.push(react_1["default"].createElement("div", { key: error.length }, "\u8BF7\u586B\u5199\u5BC6\u7801"));
            }
            return error;
        };
        Auth.prototype.render = function () {
            if (!this.props.enable)
                return null;
            var auth_type = this.props.auth_type;
            if (auth_type === 'iframe') {
                return react_1["default"].createElement("iframe", { name: "auth_iframe", id: "auth_iframe", src: this.props.url, ref: "auth-iframe" });
            }
            var inputForm = react_1["default"].createElement("form", { action: '', id: 'auth-form', onSubmit: this.formSubmit, method: "post", target: "hidden_auth_iframe" },
                react_1["default"].createElement("h1", null,
                    react_1["default"].createElement(antd_1.Icon, { type: "lock" }),
                    " \u767B\u5F55"),
                react_1["default"].createElement("div", { className: this.state.nameInputing ? 'data-field inputing' : 'data-field' },
                    react_1["default"].createElement("label", { className: 'data-label', htmlFor: "signin-Username" }, "\u7528\u6237\u540D"),
                    react_1["default"].createElement("span", { className: 'data-input' },
                        react_1["default"].createElement(antd_1.Icon, { type: "user" }),
                        react_1["default"].createElement("input", { type: "text", name: "Username", id: "signin-Username", value: this.state.Username, onFocus: this.nameFocusin, onBlur: this.nameFocusout, onChange: this.nameChange })),
                    react_1["default"].createElement(antd_1.Tooltip, { placement: "right", title: '请填写用户名' },
                        react_1["default"].createElement(antd_1.Icon, { type: "question-circle" }))),
                react_1["default"].createElement("div", { className: this.state.pswdInputing ? 'data-field inputing' : 'data-field' },
                    react_1["default"].createElement("label", { className: 'data-label', htmlFor: "signin-Password" }, "\u5BC6\u7801"),
                    react_1["default"].createElement("span", { className: 'data-input' },
                        react_1["default"].createElement(antd_1.Icon, { type: "key" }),
                        react_1["default"].createElement("input", { type: "password", name: "Password", id: "signin-Password", value: this.state.Password, onFocus: this.pswdFocusin, onBlur: this.pswdFocusout, onChange: this.pswdChange })),
                    react_1["default"].createElement(antd_1.Tooltip, { placement: "right", title: '请输入密码' },
                        react_1["default"].createElement(antd_1.Icon, { type: "question-circle" }))),
                react_1["default"].createElement("div", { className: 'data-field noLabel' },
                    react_1["default"].createElement(antd_1.Checkbox, { onChange: this.rememberMeChange, checked: this.state.RememberMe }, "\u8BB0\u4F4F\u6211")),
                react_1["default"].createElement("div", { className: 'data-actions' },
                    react_1["default"].createElement(antd_1.Button, { text: "\u767B\u9646", type: "primary", htmlType: "submit" },
                        "\u767B\u9646",
                        react_1["default"].createElement(antd_1.Icon, { type: "unlock" })),
                    this.state.errorMessages && this.state.errorMessages.length ? react_1["default"].createElement("div", { className: 'error' },
                        react_1["default"].createElement(antd_1.Alert, { message: this.state.errorMessages, type: "error", showIcon: true, closable: true })) : null));
            var loadingForm = react_1["default"].createElement("div", { id: 'auth-processing' },
                react_1["default"].createElement("img", { src: "images/loading.gif" }),
                react_1["default"].createElement("div", null, "\u6B63\u5728\u767B\u9646.."));
            if (auth_type === 'local-iframe') {
                if (this.state.processing) {
                    return react_1["default"].createElement("div", { id: 'autharea' },
                        react_1["default"].createElement("img", { src: "images/auth-bg.jpg", className: 'bg' }),
                        react_1["default"].createElement(ui_1.Center, { id: 'auth-content', adjust: '-100px' }, loadingForm),
                        react_1["default"].createElement("iframe", { src: this.props.url, name: 'hidden_auth_iframe', id: 'auth-iframe', style: 'display:none;', ref: "auth-iframe" }));
                }
                else {
                    return react_1["default"].createElement("div", { id: 'autharea' },
                        react_1["default"].createElement("img", { src: "images/auth-bg.jpg", className: 'bg' }),
                        react_1["default"].createElement(ui_1.Center, { id: 'auth-content', adjust: '-100px' }, inputForm),
                        react_1["default"].createElement("iframe", { src: this.props.url, style: 'display:none;', name: 'hidden_auth_iframe', id: 'auth-iframe', ref: "auth-iframe" }));
                }
            }
            else {
                if (this.state.processing) {
                    return react_1["default"].createElement("div", { id: 'autharea' },
                        react_1["default"].createElement("img", { src: "images/auth-bg.jpg", className: 'bg' }),
                        react_1["default"].createElement(ui_1.Center, { id: 'auth-content', adjust: '-100px' }, loadingForm));
                }
                else {
                    return react_1["default"].createElement("div", { id: 'autharea' },
                        react_1["default"].createElement("img", { src: "images/auth-bg.jpg", className: 'bg' }),
                        react_1["default"].createElement(ui_1.Center, { id: 'auth-content', adjust: '-100px' }, inputForm));
                }
            }
        };
        Auth.prototype.componentDidMount = function () {
            var auth_type = this.props.auth_type;
            if (this.view_resolve) {
                var view_resolve = this.view_resolve;
                this.view_resolve = undefined;
                //this.props.authview_resolve =undefined;
                view_resolve(this);
            }
        };
        return Auth;
    }(react_1.Component));
    exports["default"] = Auth;
});
