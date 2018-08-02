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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/utils", "lib/module", "portal/menu", "lib/ui", "portal/auth.validation", "./auth1"], function (require, exports, react_1, antd_1, utils_1, module_1, menu_1, ui_1, auth_validation_1, auth1_1) {
    "use strict";
    exports.__esModule = true;
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
    var AuthView = /** @class */ (function (_super) {
        __extends(AuthView, _super);
        function AuthView(props) {
            return _super.call(this, props) || this;
        }
        AuthView.prototype.render = function () {
            var state = this.props;
            return react_1["default"].createElement("form", null,
                react_1["default"].createElement(ui_1.Field, { label: "\u7528\u6237\u540D", name: "Username", validStates: this.props.validStates },
                    react_1["default"].createElement(antd_1.Input, { name: "Username", onChange: this.props["auth.ValueChanged"] })),
                react_1["default"].createElement(ui_1.Field, { label: "\u5BC6\u7801", name: "Password", validStates: this.props.validStates },
                    react_1["default"].createElement(antd_1.Input, { name: "Password", onChange: this.props["auth.ValueChanged"] })),
                react_1["default"].createElement(ui_1.Field, { label: "\u8BB0\u4F4F\u6211", name: "RememberMe" },
                    react_1["default"].createElement(antd_1.Checkbox, { name: "Password", onChange: this.props["auth.ValueChanged"] })),
                react_1["default"].createElement(ui_1.Field, null,
                    react_1["default"].createElement(antd_1.Button, { onChange: this.props["auth.Submit"] })));
        };
        return AuthView;
    }(react_1["default"].Component));
    var AppView = /** @class */ (function (_super) {
        __extends(AppView, _super);
        function AppView(props) {
            return _super.call(this, props) || this;
        }
        AppView.prototype.componentDidMount = function () {
        };
        AppView.prototype.render = function () {
            var state = this.props;
            var _a = this.props, menu = _a.menu, dialog = _a.dialog, auth = _a.auth, workarea = _a.workarea, nav = _a.nav, user = _a.user, customActions = _a.customActions, viewport = _a.viewport;
            var layoutLogo;
            if (viewport === 'xs') {
                layoutLogo = react_1["default"].createElement("div", { id: 'layout-logo' },
                    react_1["default"].createElement("a", { className: menu.mode === 'min' ? 'toggle collapsed' : 'toggle', onClick: this.props["menu.toggleMin"] },
                        react_1["default"].createElement(antd_1.Icon, { type: menu.mode == 'min' ? "menu-unfold" : "menu-fold" })));
            }
            else {
                layoutLogo = react_1["default"].createElement("div", { id: 'layout-logo' },
                    react_1["default"].createElement("a", { className: menu.mode === 'min' ? 'toggle collapsed' : 'toggle', onClick: this.props["menu.toggleMin"], onMouseEnter: menu.mode === 'min' ? this.props["menu.show"] : null, onMouseOut: menu.mode === 'min' ? this.props["menu.hide"] : null },
                        react_1["default"].createElement(antd_1.Icon, { type: menu.mode == 'min' ? "caret-down" : "caret-up" })),
                    react_1["default"].createElement("div", { className: 'logo-image' },
                        react_1["default"].createElement("img", { src: 'images/logo.png', onClick: this.props["menu.toggleMin"] })));
            }
            var contentMode = menu.mode;
            if (menu.collapsed || menu.mode === 'min')
                contentMode = 'collapsed';
            var authArea;
            if (auth)
                authArea = react_1["default"].createElement(auth1_1["default"], __assign({}, this.props.auth));
            return react_1["default"].createElement("div", { id: 'layout' },
                react_1["default"].createElement("div", { id: 'layout-header' },
                    state.logo_hidden ? null : react_1["default"].createElement("span", { id: 'layout-logo' },
                        react_1["default"].createElement("img", { src: "themes/" + state.theme + "/images/logo.png" })),
                    react_1["default"].createElement("span", { id: 'layout-menu-toggle', onClick: this.props["menu.toggleCollapsed"], onMouseOver: this.props["menu.show"], onMouseOut: this.props["menu.hide"] },
                        react_1["default"].createElement(antd_1.Icon, { type: "appstore" }))),
                react_1["default"].createElement(menu_1["default"], __assign({ id: 'layout-menu-main' }, menu, { className: contentMode, onMenuClick: this.props["menu.click"], onMenuToggleFold: this.props["menu.toggleFold"], onMouseOver: this.props["menu.show"], onMouseOut: this.props["menu.hide"] })),
                react_1["default"].createElement("div", { id: 'layout-content', className: contentMode },
                    react_1["default"].createElement("div", { id: 'layout-body' },
                        viewport != 'xs' ? react_1["default"].createElement("div", { id: 'layout-nav' },
                            react_1["default"].createElement(NavView, { nav: nav, menu: menu, onNavClick: this.props["nav.click"], simple: viewport == 'sm' })) : null,
                        workarea ? react_1["default"].createElement(module_1.Loadable, __assign({}, workarea, { id: "layout-workarea", is_workarea: true })) : null)));
        };
        return AppView;
    }(react_1.Component));
    exports.AppView = AppView;
    var handle_resize = function (state) {
        var vp = utils_1.viewport();
        if (vp === 'xs') {
            return {
                viewport: vp,
                logo_hidden: true,
                menu: { mode: 'min', beforeMode: state.menu.beforeMode || state.menu.mode, hidden: true, collapsed: true }
            };
        }
        else if (vp === 'sm') {
            return {
                viewport: vp,
                logo_hidden: false,
                menu: {
                    mode: 'fold'
                }
            };
        }
        else {
            return {
                viewport: vp,
                logo_hidden: false,
                menu: {
                    mode: state.menu.beforeMode || 'normal'
                }
            };
        }
    };
    var actions = {
        "auth.ValueChanged": function (state, action) {
            var text = action.event.target.value;
            var name = action.event.target.name;
            state.credence[name] = text;
            var valid = auth_validation_1["default"](name, text);
            state.validStates[name] = valid;
            return state;
        },
        "auth.Submit": function (state, action) {
            if (!this.$validate(state.validStates))
                return state;
            this.$waiting("正在登陆中...");
            var api = this;
            var auth_url = "auth/auth";
            action.payload = new Promise(function (resolve, reject) {
                api.$post(auth_url, state.credence).then(resolve, reject);
            });
        },
        "app.navigate": function (state, action) {
            var workarea = __assign({}, action);
            workarea.__REPLACEALL__ = true;
            workarea.super_store = appStore;
            workarea.ctype = 'module';
            workarea.tick = new Date().valueOf();
            //action.superStore = appStore;
            return {
                menu: { hidden: state.menu.mode == 'min' ? true : state.menu.hidden },
                workarea: workarea
            };
        },
        "app.resize": function (state, action) {
            if (rszDelayTick) {
                clearTimeout(rszDelayTick);
                rszDelayTick = 0;
            }
            return handle_resize(state);
        },
        "menu.toggleFold": function (state, action) {
            var mode = state.menu.mode === 'fold' ? 'normal' : 'fold';
            return {
                menu: { mode: mode, hidden: false, beforeMode: mode }
            };
        },
        "menu.toggleCollapsed": function (state, action) {
            return {
                menu: { collapsed: !state.menu.collapsed, hidden: !state.menu.collapsed }
            };
        },
        "menu.show": function (state, action) {
            if (state.menu.mode === 'min' || !state.menu.collapsed)
                return state;
            if (state.menu.waitForHidden) {
                clearTimeout(state.menu.waitForHidden);
            }
            return { menu: { hidden: false, waitForHidden: 0 } };
        },
        "menu.hide": function (state, action) {
            if (state.menu.mode === 'min' || !state.menu.collapsed)
                return state;
            if (state.menu.waitForHidden && action.hideImmediate) {
                clearTimeout(state.menu.waitForHidden);
                return { menu: { hidden: true, waitForHidden: 0 } };
            }
            var waitForHiden = setTimeout(function () {
                deferred.resolve({ type: "menu.hide", hideImmediate: true });
            }, 100);
            var deferred = new Deferred();
            action.payload = deferred;
            return { menu: { waitForHidden: waitForHiden } };
        },
        "menu.click": function (state, action) {
            var node = action;
            var url = node.Url;
            if (!url)
                return state;
            if (url.indexOf("[dispatch]:") >= 0) {
                var actionJson = url.substr("[dispatch]:".length);
                var action_1 = JSON.parse(actionJson);
                var handler = actions[action_1.type];
                if (handler)
                    return handler.call(this, state, action_1);
                return state;
            }
            return actions['app.navigate'].call(this, state, {
                type: "app.navigate",
                url: url,
                forceRefresh: true,
                super_store: appStore,
                ctype: 'module'
            });
        },
        "nav.click": function (state, action) {
        },
        "dialog.show": function (state, action) {
            action.enable = true;
            if (!action.deferred)
                action.deferred = new Deferred();
            action.$transport = { '__transport__': 'dialog' };
            action.$superStore = action.superStore;
            action.__REPLACEALL__ = true;
            return {
                dialog: action
            };
        },
        "dialog.ok": function (state, action) {
            var result = state.dialog.$transport.getModalResult ? state.dialog.$transport.getModalResult() : state.dialog.$transport.exports;
            state.dialog.deferred.resolve({ status: "ok", data: result });
            return {
                dialog: { enable: false, deferred: null, $transport: null, $store: null, $superStore: null, __REPLACEALL__: true }
            };
        },
        "dialog.cancel": function (state, action) {
            state.dialog.deferred.resolve({ status: "cancel" });
            return {
                dialog: { enable: false, deferred: null, $transport: null, $store: null, $superStore: null, __REPLACEALL__: true }
            };
        },
        "auth.auth": function (state, action) {
            return { auth: { enable: true } };
        },
        "auth.success": function (state, action) {
            var _a = buildMenuModel(action), roots = _a.roots, nodes = _a.nodes;
            var newState = handle_resize(state);
            var newMenu = newState.menu || (newState.menu = {});
            newMenu.data = nodes;
            newMenu.roots = roots;
            newState.user = { data: action.User };
            newState.auth = { data: action.Auth, enable: false };
            return newState;
        }
    };
    AppView.actions = actions;
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
            menus[node.Url] = node;
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
    utils_1.attach(window, "resize", function () {
        if (appStore) {
            if (rszDelayTick)
                clearTimeout(rszDelayTick);
            rszDelayTick = setTimeout(function () {
                appStore.dispatch({ type: 'app.resize' });
            }, 200);
        }
    });
    var apiProvider = function (appStore) {
        return {
            dialog: function (opts) {
                var deferred = new Deferred();
                var action = __assign({ type: "dialog.show", deferred: deferred }, opts);
                appStore.dispatch(action);
                return deferred.promise();
            },
            navigate: function (urlOrOpts, data) {
                var action = urlOrOpts;
                if (typeof urlOrOpts === 'string') {
                    var state = this.getState();
                    var node = state.menu.data[urlOrOpts];
                    if (!node)
                        throw new Error(urlOrOpts + " is not in menu/permissions");
                    action = __assign({}, node);
                }
                //if(action.module===undefined)action.module = action.Url;
                action.type = "app.navigate";
                action.ctype = 'module';
                if (!action.url)
                    action.url = action.Url;
                action.innerProps = data;
                this.dispatch(action);
            },
            winAlert: function (msg) {
                alert(msg);
            }
        };
    };
    var view_type = utils_1.viewport();
    var defaultModel = {
        viewport: view_type,
        menu: {
            mode: view_type == 'xs' ? 'min' : 'normal',
            beforeMode: 'normal'
        },
        auth: {
            enable: true
        }
    };
    AppView.state = defaultModel;
    AppView.initialize = function (props) {
        appStore = this;
        appStore.$modname = "app";
        exports.$app = appStore;
        define("app", appStore);
    };
    var appStore;
    var App = module_1.__module__(AppView);
    exports.$app = appStore;
    exports["default"] = App;
});
