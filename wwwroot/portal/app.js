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
define(["require", "exports", "lib/module", "lib/react/react", "lib/antd/antd", "portal/auth", "portal/auth.validation", "portal/menu", "conf/config", "../lib/utils"], function (require, exports, module_1, react_1, antd_1, auth_1, auth_validation_1, menu_1, config_1, utils_1) {
    "use strict";
    exports.__esModule = true;
    var AppView = /** @class */ (function (_super) {
        __extends(AppView, _super);
        function AppView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AppView.prototype.render = function () {
            var appState = this.props;
            var authView = appState.auth.visible === true ? react_1["default"].createElement(auth_1["default"], __assign({}, this.props)) : null;
            //if(authView || !appState.access_token) return authView;
            var menu = appState.menu;
            var user = appState.user.principal;
            var workarea = appState.workarea;
            var vp = utils_1.viewport();
            var contentMode = menu.mode;
            if (menu.collapsed || menu.mode === 'min')
                contentMode = 'collapsed';
            var header = null;
            if (user) {
                header = react_1["default"].createElement("div", { id: 'layout-header' },
                    appState.logo_hidden ? null : react_1["default"].createElement("span", { id: 'layout-logo' },
                        react_1["default"].createElement("img", { src: "themes/" + appState.theme + "/images/logo.png" })),
                    react_1["default"].createElement("span", { id: 'layout-menu-toggle', onClick: this.props["menu.toggleCollapsed"], onMouseOver: this.props["menu.show"], onMouseOut: this.props["menu.hide"] },
                        react_1["default"].createElement(antd_1.Icon, { type: "appstore" })),
                    vp == 'xs' ? react_1["default"].createElement(NavXSView, { nav: appState.nav, menu: menu, onNavClick: this.props["nav.click"] }) : null,
                    vp == 'xs' || vp == 'sm' ? buildMinQuicks(user, appState.customActions, this.props) : buildNormalQuicks(user, appState.customActions, this.props));
            }
            return react_1["default"].createElement("div", { id: 'layout' },
                authView,
                header,
                menu && menu.roots ? react_1["default"].createElement(menu_1["default"], __assign({ id: 'layout-menu-main' }, menu, { className: contentMode, onMenuClick: this.props["menu.click"], onMenuToggleFold: this.props["menu.toggleFold"], onMouseOver: this.props["menu.show"], onMouseOut: this.props["menu.hide"] })) : null,
                react_1["default"].createElement("div", { id: 'layout-content', className: contentMode },
                    react_1["default"].createElement("div", { id: 'layout-body' },
                        vp != 'xs' ? react_1["default"].createElement("div", { id: 'layout-nav' },
                            react_1["default"].createElement(NavView, { nav: this.props.nav, menu: menu, onNavClick: this.props["nav.click"], simple: vp == 'sm' })) : null,
                        workarea ? react_1["default"].createElement(module_1.Loadable, __assign({}, workarea, { id: "layout-workarea", is_workarea: true })) : null)));
        };
        AppView.actions = {
            "auth.visible": function (state, action) {
                return { auth: { visible: true, message: action.message }, $mask: null };
            },
            "auth.text_changed": function (state, action) {
                var text = action.event.target.value;
                var name = action.event.target.name;
                var credence = {};
                credence[name] = text;
                var validStates = {};
                validStates[name] = auth_validation_1["default"](name, text);
                ;
                return { auth: { credence: credence, validStates: validStates } };
            },
            "auth.check_changed": function (state, action) {
                var cked = action.event.target.checked;
                var name = action.event.target.name;
                var credence = {};
                credence[name] = cked;
                //let validStates = {};validStates[name] = authValidate(name,text);;
                return { auth: { credence: credence } };
            },
            "auth.submit": function (state, action) {
                var credence = state.auth.credence;
                var valid = this.$validate(credence, auth_validation_1["default"], {}, true);
                if (valid)
                    return { auth: { message: valid } };
                try {
                    if (state.auth.credence.RememberMe) {
                        localStorage.setItem("credence", JSON.stringify(credence));
                    }
                    else {
                        localStorage.setItem("credence", null);
                    }
                }
                catch (ex) {
                    console.warn("本地存储credenc失败");
                }
                //if(valid){
                //    action.payload = new Promise((resolve)=>{
                //        valid.then(()=>resolve({type:"auth.visible"}));
                //    });
                //    return state;
                //}
                var api = this;
                var auth_url = config_1["default"].auth.url;
                action.payload = new Promise(function (resolve) {
                    api.$post(auth_url, credence).then(function (authData, data) {
                        if (authData && authData.AccessToken) {
                            resolve({ type: "auth.success", authData: authData });
                        }
                        else {
                            resolve({ type: "auth.visible", message: authData ? authData.message : null });
                        }
                    }, function (e) {
                        console.warn("auth failed", e);
                        resolve({ type: "auth.visible" });
                    });
                });
                return { auth: { visible: false, message: null }, $mask: { content: "登陆中...", __REPLACEALL__: true } };
            },
            "auth.success": function (state, action) {
                var authData = action.authData;
                var credence = state.auth.credence;
                credence.AccessToken = authData.AccessToken;
                try {
                    if (state.auth.credence.RememberMe) {
                        localStorage.setItem("credence", JSON.stringify(credence));
                    }
                }
                catch (ex) {
                    console.warn("本地存储credenc失败");
                }
                var newState = handle_resize(state);
                var store = this.context.store;
                if (store.__resolve) {
                    var resolve_1 = store.__resolve;
                    setTimeout(function () { return resolve_1(authData); }, 0);
                }
                store.__resolve = store.__reject = null;
                var nodes = {};
                var roots = [];
                buildMenuModel(authData.Principal.Permissions, nodes, roots);
                for (var i in authData.Principal.Roles) {
                    var role = authData.Principal.Roles[i];
                    buildMenuModel(role.Permissions, nodes, roots);
                }
                newState.__$is_workarea__ = "root";
                newState.access_token = authData.AccessToken;
                newState.auth = { visible: false };
                newState.user = { principal: authData.Principal };
                newState.menu.roots = roots;
                newState.menu.nodes = nodes;
                newState.nav = { data: null };
                newState.$mask = null;
                return newState;
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
                return AppView.actions['app.navigate'].call(this, state, {
                    type: "app.navigate",
                    url: url,
                    forceRefresh: true,
                    super_store: appStore,
                    ctype: 'module'
                });
            },
            "app.resize": function (state, action) {
                return handle_resize(state);
            },
            "app.navigate": function (state, action) {
                var workarea = __assign({}, action);
                workarea.__REPLACEALL__ = true;
                workarea.super_store = appStore;
                workarea.ctype = 'module';
                workarea.tick = new Date().valueOf();
                var nav = state.menu.nodes[action._menuId || action.Url || action.url];
                //action.superStore = appStore;
                return {
                    menu: { hidden: state.menu.mode == 'min' ? true : state.menu.hidden },
                    workarea: workarea,
                    nav: { data: nav }
                };
            },
            "nav.click": function (state, action) {
                var navData = action.event;
                return AppView.actions["menu.click"].call(this, state, navData);
            }
        };
        AppView.state = {
            __$is_workarea__: "root",
            theme: "light-blue",
            auth: {
                credence: {},
                validStates: {}
            },
            user: {},
            menu: {},
            nav: null
        };
        AppView.initialize = function (props) {
            var store = appStore = this.context.store;
            var credence;
            try {
                var json = localStorage.getItem("credence");
                if (json) {
                    credence = JSON.parse(json);
                    props.auth.credence = credence;
                }
            }
            catch (ex) {
                console.warn("本地获取credence失败", ex);
            }
            utils_1.attach(window, 'resize', function () { store.dispatch({ type: "app.resize" }); });
            return new Promise(function (resolve, reject) {
                store.auth().then(resolve, reject);
            });
        };
        AppView.api = {
            "auth": function () {
                var _this = this;
                var store = this.context.store;
                var auth_url = config_1["default"].auth.url;
                return new Promise(function (resolve, reject) {
                    var state = store.getState();
                    store.__resolve = resolve;
                    store.__reject = reject;
                    if (!state.auth.credence.Username || state.auth.credence.Password) {
                        store.dispatch({ type: "auth.visible" });
                        return;
                    }
                    _this.$post(auth_url, state.auth.credence).then(function (authData) {
                        if (authData && authData.AccessToken) {
                            store.dispatch({ type: "auth.success", authData: authData });
                        }
                        else {
                            store.dispatch({ type: "auth.visible" });
                        }
                    }, function (e) {
                        console.warn("auth failed", e);
                        store.dispatch({ type: "auth.visible" });
                    });
                });
            },
            "navigate": function (url, data) {
                var action = {
                    type: "app.navigate",
                    state: data,
                    url: url,
                    ctype: "module"
                };
                this.context.store.dispatch(action);
                return null;
            }
        };
        return AppView;
    }(react_1["default"].Component));
    exports.AppView = AppView;
    var appStore;
    function buildMenuModel(perms, nodes, roots) {
        for (var i = 0, j = perms.length; i < j; i++) {
            var perm = perms[i];
            var node = nodes[perm.Id] = buildMenuItem(perm, nodes[perm.Id]);
            if (!perm.IsMenu)
                continue;
            if (perm.ParentId) {
                var pnode = nodes[perm.ParentId] || (nodes[perm.ParentId] = { Id: perm.ParentId, _menuId: perm.ParentId });
                if (!pnode.Children)
                    pnode.Children = [];
                //node.Parent = pnode;
                pnode.Children.push(node);
            }
            else {
                roots.push(node);
            }
            nodes[node.Url] = nodes[node.Id] = node;
        }
    }
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
    function buildMenuItem(perm, item) {
        item || (item = { Id: perm.Id, _menuId: perm.Id });
        item.ParentId = perm.ParentId;
        item.Name = perm.Name;
        item.Icon = perm.Icon || "mail";
        if (perm.Url)
            item.Url = perm.Url;
        else if (perm.ControllerName && perm.ActionName) {
            item.Url = perm.ControllerName + '/' + perm.ActionName;
        }
        return item;
    }
    function buildNormalQuicks(user, customActions, props) {
        var userDiv, customDiv;
        if (user) {
            var userMenuItems = [
                react_1["default"].createElement(antd_1.Menu.Item, { key: "10000", onClick: props["auth.visible"] },
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
                        react_1["default"].createElement("a", null, user.DisplayName || user.Username || ' ')),
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
    function buildMinQuicks(user, customActions, props) {
        var customActionItems, customDiv;
        if (user) {
            customActionItems = [
                react_1["default"].createElement(antd_1.Menu.Item, { key: "10000" },
                    react_1["default"].createElement(antd_1.Icon, { type: "idcard", onClick: props["auth.visible"] }),
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
    function NavView(appProps) {
        var props = appProps.nav;
        var nodes = appProps.menu.nodes;
        if (!props || !nodes)
            return null;
        var node = props.data;
        var onNavClick = appProps["onNavClick"];
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
            var dropdown = react_1["default"].createElement(antd_1.Dropdown, { overlay: menu, placement: "bottomLeft" },
                react_1["default"].createElement("span", null,
                    node.Icon ? react_1["default"].createElement(antd_1.Icon, { type: node.Icon }) : null,
                    node.Name));
            return react_1["default"].createElement(antd_1.Breadcrumb.Item, { key: node.Id, onClick: function () { return onNavClick(node); } },
                react_1["default"].createElement("span", null,
                    node.Icon ? react_1["default"].createElement(antd_1.Icon, { type: node.Icon }) : null,
                    node.Name));
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
        var nodes = appProps.menu.nodes;
        if (!props || !nodes || !props.data)
            return null;
        var node = props.data;
        var onNavClick = appProps["onNavClick"];
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
    exports["default"] = module_1.__module__(AppView);
});
