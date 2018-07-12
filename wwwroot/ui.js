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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "lib/axios", "lib/react/react", "lib/react/react-dom", "lib/redux/redux", "lib/redux/react-redux", "lib/antd/antd"], function (require, exports, axios, react_1, ReactDOM, redux_1, react_redux_1, antd_1) {
    "use strict";
    exports.__esModule = true;
    exports.mergemo = function (old, newModel) {
        for (var n in old) {
            if (newModel[n] === undefined)
                newModel[n] = old[n];
        }
        return newModel;
    };
    var div = document.createElement("div");
    var _attach;
    var _detech;
    if (div.attachEvent) {
        _attach = function (elem, evt, handler) { return elem.attachEvent('on' + evt, handler); };
        _detech = function (elem, evt, handler) { return elem.detechEvent('on' + evt, handler); };
    }
    else {
        _attach = function (elem, evt, handler) { return elem.addEventListener(evt, handler, false); };
        _detech = function (elem, evt, handler) { return elem.removeEventListener(evt, handler, false); };
    }
    exports.attach = _attach;
    exports.detech = _detech;
    exports.getBox = function (elem) {
        if (!elem) {
            var w_1 = window.innerWidth || document.documentElement.clientWidth;
            var h_1 = window.innerHeight || document.documentElement.clientHeight;
            return { x: 0, y: 0, width: w_1, height: h_1 };
        }
        var x = 0, y = 0;
        var w = elem.clientWidth, h = elem.clientHeight;
        while (elem) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            if (elem === document.body)
                break;
            elem = elem.offsetParent;
        }
        return { x: x, y: y, width: w, height: h };
    };
    exports.$mountable = function (Component, mountArguments) {
        mountArguments || (mountArguments = {});
        if (!mountArguments.controller) {
            Component.$mount = function (props, targetElement, superStore, transport) {
                (props || (props = {}));
                transport || (transport = { '__transport__': "$mount(" + Component.toString() + ")" });
                mountArguments.transport = props.transport = transport;
                mountArguments.transport.superStore = props.superStore = transport.superStore = superStore;
                if (mountArguments.onCreating)
                    mountArguments.onCreating(mountArguments);
                ReactDOM.render(react_1["default"].createElement(Component, props, null), targetElement);
            };
            return Component;
        }
        Component.$mount = function (props, targetElement, superStore, transport) {
            (props || (props = {}));
            transport || (transport = { '__transport__': "$mount(" + Component.toString() + ")" });
            mountArguments.transport = props.transport = transport;
            mountArguments.transport.superStore = props.superStore = transport.superStore = superStore;
            var initModel;
            if (typeof mountArguments.model === 'function')
                initModel = mountArguments.model(props, transport);
            else
                initModel = mountArguments.model;
            var controller = mountArguments.controller;
            var store = mountArguments.store = transport.store = transport.store || redux_1.createStore(function (model, action) {
                var handler = controller[action.type];
                return handler ? handler(model, action) : model;
            }, initModel);
            var mapStateToProps = mountArguments.mapStateToProps;
            if (mapStateToProps === null) {
                mapStateToProps = function (state) { return __assign({}, state); };
            }
            var mapDispatchToProps = mountArguments.mapDispatchToProps;
            var Redux = mountArguments.Redux = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Component);
            mountArguments.targetElement = targetElement;
            if (mountArguments.onCreating)
                mountArguments.onCreating(mountArguments);
            ReactDOM.render(react_1["default"].createElement(react_redux_1.Provider, { store: store },
                react_1["default"].createElement(Redux, null)), targetElement);
        };
        return Component;
    };
    var HtmlElementView = /** @class */ (function (_super) {
        __extends(HtmlElementView, _super);
        function HtmlElementView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HtmlElementView.prototype.render = function () {
            var _a = this.props, id = _a.id, className = _a.className;
            if (this.props.vnode) {
                return react_1["default"].createElement("div", { className: (className || "") + ' html-element', id: id || "", ref: "html-element" }, this.props.vnode);
            }
            if (this.props.text !== undefined) {
                return react_1["default"].createElement("div", { className: (className || "") + ' html-element', id: id || "", ref: "html-element" }, this.props.text);
            }
            return react_1["default"].createElement("div", { className: (className || "") + ' html-element', id: id || "", ref: "html-element" });
        };
        HtmlElementView.prototype.componentDidMount = function () {
            this._fillContent();
        };
        HtmlElementView.prototype.componentDidUpdate = function () {
            this._fillContent();
        };
        HtmlElementView.prototype._fillContent = function () {
            if (this.props.vnode)
                return;
            var element = this.refs["html-element"];
            var _a = this.props, html = _a.html, dom = _a.dom;
            if (html && this.content !== html)
                this.content = element.innerHTML = html;
            else if (dom && this.content !== dom) {
                element.innerHTML = "";
                element.appendChild(dom);
                this.content = dom;
            }
        };
        return HtmlElementView;
    }(react_1.Component));
    exports.HtmlElementView = HtmlElementView;
    var LoadableView = /** @class */ (function (_super) {
        __extends(LoadableView, _super);
        function LoadableView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._removeLoading = function (loadableElement, contentElement, loadingElmement, transport, onload) {
                if (loadingElmement.parentNode)
                    loadingElmement.parentNode.removeChild(loadingElmement);
                if (onload)
                    onload.call(loadableElement);
            };
            _this._renderTo = function (loadableElement, contentElement, loadingElement, content, props, transport, onload) {
                if (_this.isUnmount)
                    return;
                if (!content) {
                    contentElement.innerHTML = "";
                    _this._removeLoading(loadableElement, contentElement, loadingElement, transport, onload);
                    return;
                }
                if (typeof content.then === 'function') {
                    content.then(function (val) {
                        _this._renderTo(loadableElement, contentElement, loadingElement, val, props, transport, onload);
                    }, function () {
                        _this.url = undefined;
                        _this.module = undefined;
                    });
                    return;
                }
                if (content.$mount) {
                    var result = content.$mount(props, contentElement, transport.superStore, transport);
                    if (result && typeof result.then === 'function') {
                        return _this._renderTo(loadableElement, contentElement, loadingElement, result, props, transport, onload);
                    }
                    return _this._removeLoading(loadableElement, contentElement, loadingElement, transport, onload);
                }
                if (typeof content === 'function') {
                    var result = content(props, contentElement);
                    if (result && typeof result.then === 'function') {
                        return _this._renderTo(loadableElement, contentElement, loadingElement, result, props, transport, onload);
                    }
                    return _this._removeLoading(loadableElement, contentElement, loadingElement, transport, onload);
                }
                contentElement.innerHTML = content;
                return _this._removeLoading(loadableElement, contentElement, loadingElement, transport, onload);
            };
            return _this;
        }
        LoadableView.prototype.render = function () {
            var contentElement;
            var id = this.props.id;
            var iframeUrl = this.props.iframeUrl;
            var className = this.props.className;
            var self = this;
            if (iframeUrl) {
                var onload_1 = function () {
                    self._removeLoading(self.refs["html-element"], self.refs["loadable-content"], self.refs["loading"], self.props.onload);
                };
                contentElement = react_1["default"].createElement("iframe", { src: iframeUrl, onLoad: onload_1, className: "loadable-content" });
            }
            else {
                contentElement = react_1["default"].createElement("div", { className: "loadable-content", ref: "loadable-content" });
            }
            return react_1["default"].createElement("div", { className: (className || "") + ' loadable', id: id || "", ref: "html-element" },
                contentElement,
                react_1["default"].createElement("div", { className: 'loading', ref: "loading" },
                    react_1["default"].createElement("div", { className: 'loading-mask' }),
                    react_1["default"].createElement("div", { className: 'loading-text' }, this.props.loadingText || "加载中...")));
        };
        LoadableView.prototype.componentDidMount = function () {
            this._fillContent();
        };
        LoadableView.prototype.componentDidUpdate = function () {
            this._fillContent();
        };
        LoadableView.prototype.componentWillUnmount = function () {
            this.isUnmount = true;
        };
        LoadableView.prototype._fillContent = function () {
            var loadableElement = this.refs["html-element"];
            var contentElement = this.refs["loadable-content"];
            var loadingElement = this.refs["loading"];
            var module = this.props.module;
            var contentUrl = this.props.contentUrl;
            var props = this.props.props;
            var transport = this.props.transport;
            var onload = this.props.onload;
            if (module) {
                if (typeof module == "string") {
                    if (module === this.url)
                        return;
                    module = require(module);
                    this.url = module;
                }
            }
            if (contentUrl) {
                if (contentUrl === this.url)
                    return;
                module = axios.get(contentUrl);
                this.url = contentUrl;
            }
            this.module = module;
            if (!module.then) {
                console.warn("Loadable's module property should be a url or module");
                this.url = undefined;
                this.module = undefined;
                return;
            }
            return this._renderTo(loadableElement, contentElement, loadingElement, module, props, transport, onload);
        };
        return LoadableView;
    }(react_1.Component));
    exports.LoadableView = LoadableView;
    var ContentView = /** @class */ (function (_super) {
        __extends(ContentView, _super);
        function ContentView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContentView.prototype.render = function () {
            var _a = this.props, iframeUrl = _a.iframeUrl, module = _a.module, vnode = _a.vnode, html = _a.html, text = _a.text, contentUrl = _a.contentUrl, dom = _a.dom, id = _a.id, className = _a.className, props = _a.props, superStore = _a.superStore, transport = _a.transport;
            if (module || iframeUrl || contentUrl)
                return react_1["default"].createElement(LoadableView, { transport: transport, superStore: superStore, module: module || "", iframeUrl: iframeUrl || "", contentUrl: contentUrl || "", id: id || "", className: className || "", props: props });
            if (vnode || html || text || dom) {
                return react_1["default"].createElement(HtmlElementView, { vnode: vnode || "", html: html || "", text: text || "", dom: dom || "" });
            }
            return null;
        };
        return ContentView;
    }(react_1.Component));
    exports.ContentView = ContentView;
    var Center = /** @class */ (function (_super) {
        __extends(Center, _super);
        function Center() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Center.prototype.render = function () {
            return react_1["default"].createElement("div", { ref: 'elem', id: this.props.id || "", className: this.props.className || "" }, this.props.children);
        };
        Center.prototype.componentDidUpdate = function () {
            var ctr = this.refs["elem"];
            ctr.__rsz();
        };
        Center.prototype.componentDidMount = function () {
            var _this = this;
            var target = this.props.target;
            if (target)
                target = document.getElementById(target);
            else
                target = "";
            var ctr = this.refs["elem"];
            ctr.style.position = "absolute";
            ctr.style.cssText = "position:absolute;margin:0;z-index:999;";
            //document.body.appendChild(ctr);
            var rsz = ctr.__rsz = function () {
                var pPos = exports.getBox(ctr.offsetParent);
                var _a = exports.getBox(target), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                x = x - pPos.x;
                y = y - pPos.y;
                console.log(x, y, width, height);
                var adjust = parseInt(_this.props.adjust) || 0;
                var top = y + (height - ctr.clientHeight) / 2 + adjust;
                if (_this.props.mintop) {
                    var min = parseInt(_this.props.mintop);
                    if (top < min)
                        top = min;
                }
                if (top < 50)
                    top = 50;
                ctr.style.left = x + (width - ctr.clientWidth) / 2 + "px";
                ctr.style.top = top + "px";
            };
            rsz();
            exports.attach(window, 'resize', rsz);
        };
        Center.prototype.componentWillUnmount = function () {
            var ctr = this.refs["elem"];
            exports.detech(window, 'resize', ctr.__rsz);
        };
        return Center;
    }(react_1["default"].Component));
    exports.Center = Center;
    var SigninView = /** @class */ (function (_super) {
        __extends(SigninView, _super);
        function SigninView(props) {
            var _this = _super.call(this, props) || this;
            _this.onSubmit = function () {
                var error = _this.checkInputs();
                if (error.length)
                    return _this.setState({ errorMessage: error });
                axios.get('api/login').then(function (value) {
                    value = value.data;
                    if (value.Username === _this.user.Username && value.Password === _this.user.Password) {
                        if (_this.props.onSigninSuccess)
                            _this.props.onSigninSuccess(value);
                        return;
                    }
                    else {
                        error.push(react_1["default"].createElement("div", { key: '3' }, "\u7528\u6237\u540D\u5BC6\u7801\u4E0D\u6B63\u786E"));
                        _this.setState({ errorMessage: error, waiting: false });
                    }
                });
                _this.setState({
                    waiting: true
                });
            };
            _this.nameFocusin = function () {
                _this.setState({ nameInputing: true });
            };
            _this.nameFocusout = function (e) {
                _this.user.Username = e.target.value;
                _this.setState({ nameInputing: _this.user.Username, errorMessage: _this.checkInputs() });
            };
            _this.pswdFocusin = function () {
                _this.setState({ pswdInputing: true });
            };
            _this.pswdFocusout = function (e) {
                _this.user.Password = e.target.value;
                _this.setState({ pswdInputing: _this.user.Password, errorMessage: _this.checkInputs() });
            };
            _this.remeberPassChange = function (e) {
                _this.user.RememberPassword = e.target.checked;
                _this.setState({ passwordRemberded: e.target.checked });
            };
            var user = _this.user = props.user || {};
            _this.opacity = 30;
            _this.state = {
                nameInputing: user.Username,
                pswdInputing: user.Password,
                passwordRemberded: user.RemberPassword,
                waiting: false
            };
            return _this;
        }
        SigninView.prototype.componentDidMount = function () {
            var _this = this;
            var elem = document.getElementById("signin-bg");
            elem.style.opacity = (this.opacity / 100).toString();
            elem.style.filter = "alpha(opacity=" + this.opacity + ")";
            this.timer = setTimeout(function () {
                _this.timer = setInterval(function () {
                    if (_this.opacity < 100) {
                        _this.opacity += 10;
                        elem.style.opacity = (_this.opacity / 100).toString();
                        elem.style.filter = "alpha(opacity=" + _this.opacity + ")";
                    }
                    else {
                        clearInterval(_this.timer);
                        _this.timer = 0;
                    }
                }, 3000);
            }, 500);
        };
        SigninView.prototype.componentWillUnmount = function () {
            clearTimeout(this.timer);
            clearInterval(this.timer);
            this.timer = 0;
        };
        SigninView.prototype.checkInputs = function () {
            var error = [];
            if (!this.user.Username) {
                error.push(react_1["default"].createElement("div", { key: error.length }, "\u8BF7\u586B\u5199\u7528\u6237\u540D"));
            }
            if (!this.user.Password) {
                error.push(react_1["default"].createElement("div", { key: error.length }, "\u8BF7\u586B\u5199\u5BC6\u7801"));
            }
            return error;
        };
        SigninView.prototype.render = function () {
            var inputForm = react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: this.state.nameInputing ? 'data-field inputing' : 'data-field' },
                    react_1["default"].createElement("label", { className: 'data-label', htmlFor: "signin-Username" }, "\u7528\u6237\u540D"),
                    react_1["default"].createElement("span", { className: 'data-input' },
                        react_1["default"].createElement(antd_1.Icon, { type: "user" }),
                        react_1["default"].createElement("input", { type: "text", name: "Username", id: "signin-Username", onFocus: this.nameFocusin, onBlur: this.nameFocusout })),
                    react_1["default"].createElement(antd_1.Tooltip, { placement: "right", title: '请输入用户名' },
                        react_1["default"].createElement(antd_1.Icon, { type: "question-circle" }))),
                react_1["default"].createElement("div", { className: this.state.pswdInputing ? 'data-field inputing' : 'data-field' },
                    react_1["default"].createElement("label", { className: 'data-label', htmlFor: "signin-Password" }, "\u5BC6\u7801"),
                    react_1["default"].createElement("span", { className: 'data-input' },
                        react_1["default"].createElement(antd_1.Icon, { type: "key" }),
                        react_1["default"].createElement("input", { type: "password", name: "Password", id: "signin-Password", onFocus: this.pswdFocusin, onBlur: this.pswdFocusout })),
                    react_1["default"].createElement(antd_1.Tooltip, { placement: "right", title: '请输入密码' },
                        react_1["default"].createElement(antd_1.Icon, { type: "question-circle" }))),
                react_1["default"].createElement("div", { className: 'data-field noLabel' },
                    react_1["default"].createElement(antd_1.Checkbox, { onChange: this.remeberPassChange, checked: this.state.passwordRemberded }, "\u8BB0\u4F4F\u5BC6\u7801")),
                react_1["default"].createElement("div", { className: 'data-actions' },
                    react_1["default"].createElement(antd_1.Button, { text: "\u767B\u9646", type: "primary", onClick: this.onSubmit },
                        "\u767B\u9646",
                        react_1["default"].createElement(antd_1.Icon, { type: "unlock" })),
                    this.state.errorMessage && this.state.errorMessage.length ? react_1["default"].createElement("div", { className: 'error' },
                        react_1["default"].createElement(antd_1.Alert, { message: this.state.errorMessage, type: "error", showIcon: true, closable: true })) : null));
            var loadingForm = react_1["default"].createElement("div", null,
                react_1["default"].createElement("img", { src: "images/loading.gif" }),
                react_1["default"].createElement("div", null, "\u6B63\u5728\u767B\u9646.."));
            return react_1["default"].createElement("div", { id: 'signin' },
                react_1["default"].createElement("img", { className: 'bg', id: "signin-bg", src: "images/login-bg.jpg" }),
                react_1["default"].createElement(Center, { id: 'signinInfo', adjust: '-100px' },
                    react_1["default"].createElement("h1", null,
                        react_1["default"].createElement(antd_1.Icon, { type: "lock" }),
                        "\u767B \u9646 "),
                    this.state.waiting ? loadingForm : inputForm));
        };
        return SigninView;
    }(react_1["default"].Component));
    exports.SigninView = SigninView;
    var CascadingView = /** @class */ (function (_super) {
        __extends(CascadingView, _super);
        function CascadingView(props) {
            return _super.call(this, props) || this;
        }
        CascadingView.prototype.render = function () {
            var pages = this.props.pages;
            var pageViews = [];
            for (var i = 0, j = pages.length; i < j; i++) {
                var page = pages[i];
                page.key = i;
                pageViews.push(react_1["default"].createElement(ContentView, page, null));
            }
            return react_1["default"].createElement("div", { className: "cascading", id: this.props.id }, pageViews);
        };
        return CascadingView;
    }(react_1["default"].Component));
    exports.CascadingView = CascadingView;
    var genId = function () {
        var idSeed = 1;
        var time = new Date().valueOf().toString();
        genId = function () {
            if (idSeed > 2100000000) {
                idSeed = 1;
                time = new Date().valueOf().toString();
            }
            return idSeed.toString() + '_' + time;
        };
        return genId();
    };
});
