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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/redux/react-redux", "ui"], function (require, exports, react_1, antd_1, react_redux_1, ui_1) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    var SubMenu = antd_1.Menu.SubMenu;
    var json = [
        {
            Id: "1",
            Name: "弹出模态框",
            Icon: "mail",
            url: '[dispatch]:{"type":"dialog","text":"hello react."}'
        },
        {
            Id: "2",
            Name: "加载test/my模块",
            Url: "test/my",
            Icon: "mail"
        },
        {
            Id: "22",
            Name: "加载test/dialog模块",
            Url: "test/dialog",
            Icon: "mail"
        },
        {
            Id: "3",
            Name: "c",
            Icon: "mail",
            ChildNodes: [
                {
                    Id: "5",
                    Name: "dialog2",
                    Url: "test/dialog2",
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
    var MainMenuView = /** @class */ (function (_super) {
        __extends(MainMenuView, _super);
        function MainMenuView(props) {
            var _this = _super.call(this, props) || this;
            _this._buildMenuName = function (node, menuClickHandler) {
                if (node.Url) {
                    return react_1["default"].createElement("span", { onClick: function () { return menuClickHandler(node); } }, node.Name);
                }
                else {
                    return react_1["default"].createElement("span", null, node.Name);
                }
            };
            _this._buildMenu = function (children, menuClickHandler) {
                var result = [];
                for (var i = 0, j = children.length; i < j; i++) {
                    var node = children[i];
                    var name_1 = _this._buildMenuName(node, menuClickHandler);
                    if (node.ChildNodes && node.ChildNodes.length) {
                        var subs = _this._buildMenu(node.ChildNodes, menuClickHandler);
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
            return _this;
        }
        MainMenuView.prototype.render = function () {
            var _a = this.props, onClick = _a.onClick, model = _a.model;
            var _b = this.props, data = _b.data, defaultSelectedKeys = _b.defaultSelectedKeys, defaultOpenKeys = _b.defaultOpenKeys, collapsed = _b.collapsed;
            return react_1["default"].createElement(antd_1.Menu, { defaultSelectedKeys: defaultSelectedKeys, defaultOpenKeys: defaultOpenKeys, mode: "inline", theme: "dark", inlineCollapsed: collapsed }, this._buildMenu(data, onClick));
        };
        return MainMenuView;
    }(react_1.Component));
    var MainMenu = react_redux_1.connect(function (model) { return model.menu; }, function (dispatch) {
        return {
            onClick: function (node) { return dispatch({ type: "menu.click", node: node }); }
        };
    })(MainMenuView);
    var DialogView = /** @class */ (function (_super) {
        __extends(DialogView, _super);
        function DialogView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DialogView.prototype.render = function () {
            var _a = this.props, title = _a.title, width = _a.width, height = _a.height, onOk = _a.onOk, onCancel = _a.onCancel;
            var contentView = react_1["default"].createElement(ui_1.ContentView, this.props, null);
            return react_1["default"].createElement(antd_1.Modal, { title: title, visible: true, onOk: onOk, onCancel: onCancel, confirmLoading: false }, contentView);
        };
        return DialogView;
    }(react_1.Component));
    exports.DialogView = DialogView;
    var Dialog = react_redux_1.connect(function (model) { return model.dialog; }, function (dispatch) {
        return {
            onOk: function () { return dispatch({ type: "dialog.ok" }); },
            onCancel: function () { return dispatch({ type: "dialog.cancel" }); }
        };
    })(DialogView);
    var Signin = react_redux_1.connect(function (model) { return model.user; }, function (dispatch) {
        return {
            onSigninSuccess: function (userInfo) { dispatch({ user: userInfo, type: 'user.signinSuccess' }); }
        };
    })(ui_1.SigninView);
    var WorkArea = react_redux_1.connect(function (model) { return model.workarea; }, function (dispatch) {
        return {};
    })(ui_1.CascadingView);
    var AppView = /** @class */ (function (_super) {
        __extends(AppView, _super);
        function AppView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AppView.prototype.render = function () {
            var _a = this.props, menu = _a.menu, dialog = _a.dialog, user = _a.user, menu_collapsed = _a.menu_collapsed;
            var dialogView = dialog.visible ? react_1["default"].createElement(Dialog, null) : null;
            if (!user || !user.Id)
                return react_1["default"].createElement(Signin, null);
            return react_1["default"].createElement("div", { className: menu_collapsed ? "layout layout-collapsed" : "layout" },
                react_1["default"].createElement("div", { className: "sider" },
                    react_1["default"].createElement(MainMenu, null)),
                react_1["default"].createElement("div", { className: 'header' }, "header"),
                react_1["default"].createElement("div", { className: "content" },
                    react_1["default"].createElement(WorkArea, { id: "workarea" })),
                dialogView);
        };
        return AppView;
    }(react_1.Component));
    exports.AppView = AppView;
    var App = react_redux_1.connect(function (state) { return __assign({}, state); }, function (dispatch) {
        return {
            onOk: function () { return dispatch({ type: "dialog.ok" }); },
            onCancel: function () { return dispatch({ type: "dialog.cancel" }); }
        };
    })(AppView);
    var controller = {
        "menu.click": function (model, action) {
            var node = action.node;
            var url = node.Url;
            if (!url)
                return model;
            if (url.indexOf("[dispatch]:") >= 0) {
                var actionJson = url.substr("[dispatch]:".length);
                var action_1 = JSON.parse(actionJson);
                var handler = controller[action_1.type];
                if (handler)
                    return handler.call(_this, model, action_1);
                return model;
            }
            return controller.navigate.call(_this, model, {
                type: "navigate",
                module: url
            });
            return model;
        },
        "dialog": function (model, action) {
            action.visible = true;
            if (!action.deferred)
                action.deferred = new Deferred();
            action.transport = { '__transport__': 'dialog' };
            return ui_1.mergemo(model, {
                dialog: action
            });
        },
        "dialog.ok": function (model, action) {
            model.dialog.deferred.resolve({ status: "ok", result: model.dialog.transport.exports });
            return ui_1.mergemo(model, {
                dialog: { visible: false, deferred: null, $transport: null }
            });
        },
        "dialog.cancel": function (model, action) {
            model.dialog.deferred.resolve({ status: "cancel" });
            return ui_1.mergemo(model, {
                dialog: { visible: false, deferred: null }
            });
        },
        "navigate": function (model, action) {
            action.transport = { "__transport__": "app.navigate" };
            action.superStore = appStore;
            return __assign({}, model, { workarea: { pages: [action] } });
        },
        "user.signinSuccess": function (model, action) {
            return __assign({}, model, { user: action.user });
        }
    };
    var initModel = {
        menu: {
            data: json
        },
        dialog: { width: 100 },
        workarea: {
            pages: []
        },
        user: {}
    };
    var api = {
        dialog: function (opts) {
            var deferred = new Deferred();
            var action = __assign({ type: "dialog", deferred: deferred }, opts);
            appStore.dispatch(action);
            return deferred.promise();
        },
        getStore: function () { return appStore; }
    };
    define("app", api);
    var appStore;
    var MOD = ui_1.$mountable(AppView, {
        model: initModel,
        mapStateToProps: null,
        onCreating: function (reduxParams) {
            appStore = reduxParams.store;
        },
        mapDispatchToProps: function (dispatch) {
            return {
                onOk: function () { return dispatch({ type: "dialog.ok" }); },
                onCancel: function () { return dispatch({ type: "dialog.cancel" }); }
            };
        },
        controller: controller
    });
    exports["default"] = MOD;
});
