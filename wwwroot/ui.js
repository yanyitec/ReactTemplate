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
define(["require", "exports", "lib/axios", "lib/react/react", "lib/react/react-dom", "lib/redux/redux", "lib/redux/react-redux"], function (require, exports, axios, react_1, ReactDOM, redux_1, react_redux_1) {
    "use strict";
    exports.__esModule = true;
    exports.mergemo = function (old, newModel) {
        for (var n in old) {
            if (newModel[n] === undefined)
                newModel[n] = old[n];
        }
        return newModel;
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
            var _a = this.props, id = _a.id, className = _a.className, text = _a.text, vnode = _a.vnode;
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
