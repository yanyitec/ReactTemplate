﻿var __extends = (this && this.__extends) || (function () {
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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/redux/react-redux", "lib/axios", "lib/utils", "lib/ui", "portal/menu", "portal/auth", "lib/ui"], function (require, exports, react_1, antd_1, react_redux_1, axios, utils_1, ui_1, menu_1, auth_1, ui_2) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    var DialogView = /** @class */ (function (_super) {
        __extends(DialogView, _super);
        function DialogView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DialogView.prototype.render = function () {
            var _a = this.props, title = _a.title, width = _a.width, height = _a.height, onOk = _a.onOk, onCancel = _a.onCancel;
            var contentView = react_1["default"].createElement(ui_2.ContentView, this.props, null);
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
    function NavView(appProps) {
        var props = appProps.nav;
        var nodes = appProps.menu.data;
        if (!props || !nodes)
            return null;
        var node = props.data;
        var onNavClick = appProps.onNavClick;
        var simple = props.simple;
        var buildCrumbItem = function (node) {
            if (simple) {
                return react_1["default"].createElement(antd_1.Breadcrumb.Item, { key: node.Id, onClick: function () { return onNavClick(node); } },
                    node.Icon ? react_1["default"].createElement(antd_1.Icon, { type: node.Icon }) : null,
                    node.Name);
            }
            var items = [];
            var p = node && node.ParentId ? nodes[node.ParentId] : undefined;
            if (p && p.Children) {
                for (var i = 0, j = p.Children.length; i < j; i++) {
                    (function (nd, index) {
                        if (nd.Id === node.Id)
                            return;
                        items.push(react_1["default"].createElement(antd_1.Menu.Item, { key: nd.Id, onClick: function () { return onNavClick(nd); } },
                            nd.Icon ? react_1["default"].createElement(antd_1.Icon, { type: nd.Icon }) : null,
                            react_1["default"].createElement("span", null, nd.Name)));
                    })(p.Children[i], i);
                }
            }
            var menu = items.length == 0 ? null : react_1["default"].createElement(antd_1.Menu, null, items);
            return react_1["default"].createElement(antd_1.Breadcrumb.Item, { key: node.Id, onClick: function () { return onNavClick(node); } },
                react_1["default"].createElement(antd_1.Dropdown, { overlay: menu, placement: "bottomLeft" },
                    react_1["default"].createElement("span", null,
                        node.Icon ? react_1["default"].createElement(antd_1.Icon, { type: node.Icon }) : null,
                        node.Name)));
        }; //end buildDropdown;
        var items = [];
        var nd = node;
        while (nd) {
            items.unshift(buildCrumbItem(nd));
            nd = nodes[nd.ParentId];
        }
        items.unshift(react_1["default"].createElement(antd_1.Breadcrumb.Item, { key: "$KEY_HOME", onClick: function () { return onNavClick({ Id: "Home", Name: "首页" }); } },
            react_1["default"].createElement(antd_1.Icon, { type: 'home' }),
            "\u9996\u9875"));
        return react_1["default"].createElement(antd_1.Breadcrumb, null, items);
    }
    function NavXSView(appProps) {
        var props = appProps.nav;
        var nodes = appProps.menu.data;
        if (!props || !nodes || !props.data)
            return null;
        var node = props.data;
        var onNavClick = appProps.onNavClick;
        var items = [];
        var nd = node;
        while (nd) {
            (function (nd) {
                items.push(react_1["default"].createElement(antd_1.Menu.Item, { onClick: function () { return onNavClick(nd); } },
                    nd.Icon ? react_1["default"].createElement(antd_1.Icon, { type: nd.Icon }) : null,
                    nd.Name));
            })(nd);
            nd = nodes[nd.ParentId];
        }
        items.unshift(react_1["default"].createElement(antd_1.Menu.Item, { onClick: function () { return onNavClick({ Id: "Home", Name: "首页" }); } },
            react_1["default"].createElement(antd_1.Icon, { type: 'home' }),
            "\u9996\u9875"));
        var menu = react_1["default"].createElement(antd_1.Menu, null, items);
        return react_1["default"].createElement(antd_1.Dropdown, { overlay: menu, placement: "bottomCenter" },
            react_1["default"].createElement("span", null,
                node.Icon ? react_1["default"].createElement(antd_1.Icon, { type: node.Icon }) : null,
                node.Name));
    }
    function buildNormalQuicks(user, customActions) {
        var userDiv, customDiv;
        if (user && user.data) {
            var userMenuItems = [
                react_1["default"].createElement(antd_1.Menu.Item, { key: "10000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "idcard" }),
                    " \u91CD\u767B\u9646"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "20000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "key" }),
                    " \u4FEE\u6539\u5BC6\u7801"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "30000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "profile" }),
                    " \u4E2A\u6027\u5316"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "40000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "logout" }),
                    " \u9000\u51FA"),
            ];
            var userMenu = react_1["default"].createElement(antd_1.Menu, null, userMenuItems);
            userDiv = react_1["default"].createElement("div", { className: 'user' },
                react_1["default"].createElement(antd_1.Button.Group, null,
                    react_1["default"].createElement(antd_1.Button, { type: 'dashed' },
                        react_1["default"].createElement(antd_1.Icon, { type: "user" }),
                        react_1["default"].createElement("a", null, user.data.DisplayName || user.data.Username || ' ')),
                    react_1["default"].createElement(antd_1.Dropdown, { overlay: userMenu, placement: "bottomRight" },
                        react_1["default"].createElement(antd_1.Button, null,
                            react_1["default"].createElement(antd_1.Icon, { type: "setting" }))),
                    react_1["default"].createElement(antd_1.Button, null,
                        react_1["default"].createElement(antd_1.Icon, { type: "poweroff" }))));
        }
        if (customActions && customActions.length) {
            var customActionItems = [];
            for (var i = customActions.length - 1, j = 0; i >= 0; i--) {
                var actionInfo = customActions[i];
                customActionItems.unshift(react_1["default"].createElement(antd_1.Button, { type: actionInfo.type || 'primary', onClick: actionInfo.onClick },
                    react_1["default"].createElement(antd_1.Icon, { type: actionInfo.icon }),
                    " ",
                    actionInfo.text));
            }
            customDiv = react_1["default"].createElement("div", { className: 'actions' },
                react_1["default"].createElement(antd_1.Button.Group, null, customActionItems));
        }
        return react_1["default"].createElement("div", { id: 'layout-quicks' },
            userDiv,
            customDiv);
    }
    function buildMinQuicks(user, customActions) {
        var customActionItems, customDiv;
        if (user && user.data) {
            customActionItems = [
                react_1["default"].createElement(antd_1.Menu.Item, { key: "10000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "idcard" }),
                    " \u91CD\u767B\u9646"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "20000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "key" }),
                    " \u4FEE\u6539\u5BC6\u7801"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "30000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "profile" }),
                    " \u4E2A\u6027\u5316"),
                react_1["default"].createElement(antd_1.Menu.Item, { key: "40000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "logout" }),
                    " \u9000\u51FA"),
            ];
        }
        if (customActions && customActions.length) {
            var idprefix = (customActions.idprefix || Math.random().toString()) + "_";
            if (customActions && customActions.length)
                customActionItems.unshift(react_1["default"].createElement(antd_1.Menu.Divider, null));
            for (var i = customActions.length - 1, j = 0; i >= 0; i--) {
                var actionInfo = customActions[i];
                customActionItems.unshift(react_1["default"].createElement(antd_1.Menu.Item, { key: idprefix + i },
                    react_1["default"].createElement(antd_1.Icon, { type: actionInfo.icon }),
                    " ",
                    actionInfo.text));
            }
        }
        var customMenu = react_1["default"].createElement(antd_1.Menu, null, customActionItems);
        return react_1["default"].createElement("div", { id: 'layout-quicks' },
            react_1["default"].createElement(antd_1.Dropdown, { overlay: customMenu, placement: "bottomRight" },
                react_1["default"].createElement(antd_1.Button, { size: 'small', theme: 'dark' },
                    react_1["default"].createElement(antd_1.Icon, { type: "ellipsis" }))));
    }
    var AppView = /** @class */ (function (_super) {
        __extends(AppView, _super);
        function AppView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AppView.prototype.render = function () {
            var _a = this.props, menu = _a.menu, dialog = _a.dialog, auth = _a.auth, workarea = _a.workarea, nav = _a.nav, user = _a.user, customActions = _a.customActions, viewType = _a.viewType;
            var layoutLogo;
            if (viewType === 'xs') {
                layoutLogo = react_1["default"].createElement("div", { id: 'layout-logo' },
                    react_1["default"].createElement("a", { className: menu.mode === 'min' ? 'toggle collapsed' : 'toggle', onClick: this.props["menu.toggleMin"] },
                        react_1["default"].createElement(antd_1.Icon, { type: menu.mode == 'min' ? "menu-unfold" : "menu-fold" })));
            }
            else {
                layoutLogo = react_1["default"].createElement("div", { id: 'layout-logo' },
                    react_1["default"].createElement("a", { className: menu.mode === 'min' ? 'toggle collapsed' : 'toggle', onClick: this.props["menu.toggleMin"], onMouseOver: menu.mode === 'min' ? this.props["menu.show"] : null, onMouseOut: menu.mode === 'min' ? this.props["menu.hide"] : null },
                        react_1["default"].createElement(antd_1.Icon, { type: menu.mode == 'min' ? "caret-down" : "caret-up" })),
                    react_1["default"].createElement("div", { className: 'logo-image' },
                        react_1["default"].createElement("img", { src: 'images/logo.png', onClick: this.props["menu.toggleMin"] })));
            }
            return react_1["default"].createElement("div", { id: 'layout', className: 'layout-' + viewType },
                react_1["default"].createElement("div", { id: 'layout-header' },
                    layoutLogo,
                    viewType == 'xs' ? react_1["default"].createElement(NavXSView, { nav: nav, menu: menu, onNavClick: this.props["nav.click"] }) : null,
                    viewType == 'xs' || viewType == 'sm' ? buildMinQuicks(user, customActions) : buildNormalQuicks(user, customActions)),
                react_1["default"].createElement("div", { id: 'layout-content', className: "menu-" + menu.mode },
                    react_1["default"].createElement("div", { id: 'layout-sider' },
                        react_1["default"].createElement(menu_1["default"], __assign({ id: 'main-menu' }, menu, { className: menu.hidden ? 'hidden' : '', onMenuClick: this.props["menu.click"], onMenuToggleFold: this.props["menu.toggleFold"], onMouseOver: menu.mode === 'min' ? this.props["menu.show"] : null, onMouseOut: menu.mode === 'min' ? this.props["menu.hide"] : null }))),
                    react_1["default"].createElement("div", { id: 'layout-body' },
                        viewType != 'xs' ? react_1["default"].createElement("div", { id: 'layout-nav' },
                            react_1["default"].createElement(NavView, { nav: nav, menu: menu, onNavClick: this.props["nav.click"], simple: viewType == 'sm' })) : null,
                        react_1["default"].createElement("div", { id: 'layout-workarea' },
                            react_1["default"].createElement(ui_2.CascadingView, __assign({ id: "workarea" }, workarea))))),
                dialog.enable === true ? react_1["default"].createElement(Dialog, null) : null,
                auth.enable === true ? react_1["default"].createElement(auth_1["default"], __assign({}, auth, { onAuthSuccess: this.props["auth.success"] })) : null);
        };
        return AppView;
    }(react_1.Component));
    exports.AppView = AppView;
    var action_handlers = {
        "resize": function (state, action) {
            if (rszDelayTick) {
                clearTimeout(rszDelayTick);
                rszDelayTick = 0;
            }
            var vtype = ui_1.viewType();
            var menuMode = state.menu.mode || 'normal';
            var beforeMode = state.menu.beforeMode;
            if (vtype === 'xs') {
                beforeMode = 'normal';
                menuMode = 'min';
            }
            if (!beforeMode)
                beforeMode = 'normal';
            return {
                viewType: vtype,
                menu: { mode: menuMode, beforeMode: beforeMode }
            };
        },
        "menu.toggleFold": function (state, action) {
            var mode = state.menu.mode === 'fold' ? 'normal' : 'fold';
            return {
                menu: { mode: mode, hidden: false, beforeMode: mode }
            };
        },
        "menu.toggleMin": function (state, action) {
            var beforeMode = state.menu.beforeMode;
            if (beforeMode === undefined)
                beforeMode = state.menu.mode || 'normal';
            return {
                menu: { mode: state.menu.mode === 'min' ? beforeMode : 'min', beforeMode: beforeMode, hidden: state.menu.mode === 'min' ? false : true }
            };
        },
        "menu.show": function (state, action) {
            if (state.menu.waitForHidden) {
                clearTimeout(state.menu.waitForHidden);
            }
            console.log('menu.show');
            return { menu: { hidden: false, waitForHidden: 0 } };
        },
        "menu.hide": function (state, action) {
            if (state.menu.waitForHidden && action.hideImmediate) {
                clearTimeout(state.menu.waitForHidden);
                return { menu: { hidden: true, waitForHidden: 0 } };
            }
            var waitForHiden = setTimeout(function () {
                deferred.resolve({ type: "menu.hide", hideImmediate: true });
            }, 200);
            var deferred = new Deferred();
            action.payload = deferred;
            return { menu: { waitForHidden: waitForHiden } };
        },
        "menu.click": function (state, action) {
            var node = action.node;
            var url = node.Url;
            if (!url)
                return state;
            if (url.indexOf("[dispatch]:") >= 0) {
                var actionJson = url.substr("[dispatch]:".length);
                var action_1 = JSON.parse(actionJson);
                var handler = action_handlers[action_1.type];
                if (handler)
                    return handler.call(_this, state, action_1);
                return state;
            }
            return action_handlers.navigate.call(_this, state, {
                type: "navigate",
                module: url
            });
            return state;
        },
        "nav.click": function (state, action) {
        },
        "dialog.show": function (state, action) {
            action.visible = true;
            if (!action.deferred)
                action.deferred = new Deferred();
            action.transport = { '__transport__': 'dialog' };
            return ui_2.mergemo(state, {
                dialog: action
            });
        },
        "dialog.ok": function (state, action) {
            state.dialog.deferred.resolve({ status: "ok", result: state.dialog.transport.exports });
            return ui_2.mergemo(state, {
                dialog: { visible: false, deferred: null, $transport: null }
            });
        },
        "dialog.cancel": function (state, action) {
            state.dialog.deferred.resolve({ status: "cancel" });
            return ui_2.mergemo(state, {
                dialog: { visible: false, deferred: null }
            });
        },
        "navigate": function (state, action) {
            action.transport = { "__transport__": "app.navigate" };
            action.superStore = appStore;
            return __assign({}, state, { workarea: { pages: [action] } });
        },
        "auth.auth": function (state, action) {
            return { auth: { enable: true } };
        },
        "auth.success": function (state, action) {
            var _a = buildMenuModel(action.data), roots = _a.roots, nodes = _a.nodes;
            return {
                menu: {
                    data: nodes,
                    roots: roots
                },
                user: { data: action.data.User },
                auth: { data: action.data.Auth, enable: false }
            };
        }
    };
    function buildMenuModel(authData) {
        var menus = {};
        var perms = authData.Permissions;
        var roots = [];
        for (var i = 0, j = perms.length; i < j; i++) {
            var perm = perms[i];
            var node = menus[perm.Id] = buildMenuItem(perm, menus[perm.Id]);
            if (perm.ParentId) {
                var pnode = menus[perm.ParentId] || (menus[perm.ParentId] = { Id: perm.ParentId });
                if (!pnode.Children)
                    pnode.Children = [];
                //node.Parent = pnode;
                pnode.Children.push(node);
            }
            else {
                roots.push(node);
            }
        }
        return { roots: roots, nodes: menus };
    }
    function buildMenuItem(perm, item) {
        item || (item = { Id: perm.Id });
        item.ParentId = perm.ParentId;
        item.Name = perm.Name;
        item.Icon = perm.Icon || "mail";
        if (perm.Url)
            item.Url = perm.Url;
        else if (perm.ControllerName) {
            perm.Url = perm.ControllerName + '/' + (perm.ActionName || "");
        }
        return item;
    }
    var rszDelayTick;
    ui_1.attach(window, "resize", function () {
        if (appStore) {
            if (rszDelayTick)
                clearTimeout(rszDelayTick);
            rszDelayTick = setTimeout(function () {
                appStore.dispatch({ type: 'resize' });
            }, 200);
        }
    });
    axios.defaults.headers.common = { 'X-Requested-With': 'XMLHttpRequest', 'X-Requested-DataType': 'json', 'X-Response-DataType': 'json' };
    axios.interceptors.response.use(function (response) {
        if (response.status === '401') {
            setTimeout(function () { appStore.dispach({ type: 'user.signin' }); }, 0);
            throw response;
        }
        return response.data;
    }, function (err) {
        console.error(err);
        alert(err);
    });
    var api = {
        dialog: function (opts) {
            var deferred = new Deferred();
            var action = __assign({ type: "dialog", deferred: deferred }, opts);
            appStore.dispatch(action);
            return deferred.promise();
        },
        GET: function (url, data) {
            return axios.get(url, data);
        },
        POST: function (url, data) {
            return axios.post(url, data);
        },
        store: null
    };
    define("app", api);
    var view_type = ui_1.viewType();
    var defaultModel = {
        viewType: view_type,
        menu: {
            mode: view_type == 'xs' ? 'min' : 'normal',
            beforeMode: 'normal'
        },
        auth: {
            enable: true
        }
    };
    var appStore;
    var App = ui_2.$mountable(AppView, {
        model: defaultModel,
        onCreating: function (reduxParams) {
            appStore = api.store = reduxParams.store;
        },
        action_handlers: action_handlers
    });
    var $mount = App.$mount;
    App.$mount = function (props, targetElement, superStore, transport) {
        return new Promise(function (resolve, reject) {
            var authConfig = props.auth = utils_1.cloneObject(config.auth);
            authConfig.authview_resolve = resolve;
            authConfig.enable = true;
            $mount(props, targetElement);
        });
    };
    exports["default"] = App;
});
