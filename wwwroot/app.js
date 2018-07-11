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
define(["require", "exports", "lib/react/react", "lib/react/react-dom", "lib/antd/antd", "ui"], function (require, exports, react_1, ReactDOM, antd_1, ui_1) {
    "use strict";
    exports.__esModule = true;
    var SubMenu = antd_1.Menu.SubMenu;
    var json = [
        {
            Id: "1",
            Name: "弹出模态框",
            Icon: "mail",
            url: "javascript:dialog"
        },
        {
            Id: "2",
            Name: "加载test/my模块",
            url: "test/my",
            Icon: "mail"
        },
        {
            Id: "3",
            Name: "c",
            Icon: "mail",
            ChildNodes: [
                {
                    Id: "5",
                    Name: "3",
                    Icon: "mail"
                },
                {
                    Id: "6",
                    Name: "6",
                    Icon: "mail"
                }
            ]
        },
        {
            Id: "4",
            Name: "d",
            Icon: "mail"
        }
    ];
    var App = /** @class */ (function (_super) {
        __extends(App, _super);
        function App(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                layout_collapsed: false,
                modal_visible: false,
                modal_title: "",
                modal_content: "一个模态框",
                workspace_module: undefined
            };
            _this._toggleLayoutCollapsed = function () {
                _this.setState({
                    collapsed: !_this.state.layout_collapsed
                });
            };
            _this._onMenuClick = function (node) {
                if (node.url.indexOf("javascript:") >= 0) {
                    var actionName = node.url.substr("javascript:".length);
                    var action = _this[actionName];
                    if (typeof action === 'function')
                        action.call(_this, node);
                }
                else {
                    _this.setState({
                        workspace_module: node.url
                    });
                }
            };
            _this._buildMenuName = function (node) {
                if (node.url) {
                    return react_1["default"].createElement("span", { onClick: function () { return _this._onMenuClick(node); } }, node.Name);
                }
                else {
                    return react_1["default"].createElement("span", null, node.Name);
                }
            };
            _this._buildMenu = function (data) {
                var result = [];
                for (var i = 0, j = data.length; i < j; i++) {
                    var node = data[i];
                    var name_1 = _this._buildMenuName(node);
                    if (node.ChildNodes && node.ChildNodes.length) {
                        var subs = _this._buildMenu(node.ChildNodes);
                        result.push(react_1["default"].createElement(SubMenu, { key: node.Id, title: react_1["default"].createElement("span", null,
                                react_1["default"].createElement(antd_1.Icon, { type: node.Icon || "email" }),
                                name_1) }, subs));
                    }
                    else {
                        result.push(react_1["default"].createElement(antd_1.Menu.Item, { key: node.Id },
                            react_1["default"].createElement(antd_1.Icon, { type: node.Icon || "email" }),
                            name_1));
                    }
                }
                return result;
            };
            _this.dialog = function (opts) {
                if (_this.modalPromise)
                    return Promise.reject(undefined);
                opts || (opts = {});
                var content = opts.content;
                if (opts.url) {
                    var contentOpts = opts.contentOpts || {};
                    contentOpts.$dialogOpts = opts;
                    contentOpts.key = _this.genId();
                    content = react_1["default"].createElement(ui_1.Loadable, { module: opts.url, parameters: contentOpts, key: contentOpts.key });
                }
                _this.setState({
                    modal_visible: true,
                    modal_title: opts.title || "",
                    modal_content: content || ""
                });
                var promise = _this.modalPromise = new Deferred();
                promise.opts = opts;
                return promise;
            };
            _this._onModalOk = function () {
                _this.setState({
                    modal_visible: false,
                    confirmLoading: false
                });
                var result;
                if (_this.modalPromise.opts && _this.modalPromise.opts.$getDialogResult) {
                    result = _this.modalPromise.opts.$getDialogResult();
                }
                _this.modalPromise.resolve({ status: "ok", result: result });
                _this.modalPromise = undefined;
            };
            _this._onModalCancel = function () {
                _this.setState({
                    modal_visible: false
                });
                _this.modalPromise.resolve({ status: "cancel" });
                _this.modalPromise = undefined;
            };
            _this.genId = function () {
                var idSeed = 1;
                var time = new Date().valueOf().toString();
                _this.genId = function () {
                    if (idSeed > 2100000000) {
                        idSeed = 1;
                        time = new Date().valueOf().toString();
                    }
                    return idSeed.toString() + '_' + time;
                };
                return _this.genId();
            };
            define("app", _this);
            return _this;
        }
        App.prototype.render = function () {
            var loadable;
            if (this.state.workspace_module) {
                loadable = react_1["default"].createElement(ui_1.Loadable, { className: 'content', module: this.state.workspace_module, loadingText: "\u6B63\u5728\u52A0\u8F7D..." });
            }
            //const  = this.props;
            var logo;
            if (true) {
                logo = react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: this._toggleLayoutCollapsed },
                    react_1["default"].createElement(antd_1.Icon, { type: this.state.layout_collapsed ? 'menu-unfold' : 'menu-fold' }));
            }
            var menuNodes = this._buildMenu(json);
            var menu = react_1["default"].createElement(antd_1.Menu, { defaultSelectedKeys: ['1'], defaultOpenKeys: ['sub1'], mode: "inline", theme: "dark", inlineCollapsed: this.props.layout_collapsed }, menuNodes);
            return react_1["default"].createElement("div", { className: this.state.layout_collapsed ? "layout layout-collapsed" : "layout" },
                react_1["default"].createElement("div", { className: 'sider' },
                    react_1["default"].createElement("div", { className: this.state.layout_collapsed ? "collapsed" : "" },
                        logo,
                        menu)),
                react_1["default"].createElement("div", { className: 'header' }, "header"),
                react_1["default"].createElement("div", { className: "content" }, loadable),
                react_1["default"].createElement(antd_1.Modal, { title: this.state.modal_title, visible: this.state.modal_visible, onOk: this._onModalOk, confirmLoading: false, onCancel: this._onModalCancel },
                    react_1["default"].createElement("div", null, this.state.modal_content)));
            //return 
        };
        return App;
    }(react_1.Component));
    exports["default"] = App;
    App.renderTo = function (amountElement, props, container) {
        (props || (props = {})).$container = container;
        ReactDOM.render(react_1["default"].createElement(App, props, null), amountElement);
    };
});
