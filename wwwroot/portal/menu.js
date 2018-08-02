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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/utils"], function (require, exports, react_1, antd_1, utils_1) {
    "use strict";
    exports.__esModule = true;
    var SubMenu = antd_1.Menu.SubMenu;
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
                    if (node.Children && node.Children.length) {
                        var subs = _this._buildMenu(node.Children, menuClickHandler);
                        result.push(react_1["default"].createElement(SubMenu, { key: node.Id, title: react_1["default"].createElement("span", null,
                                react_1["default"].createElement(antd_1.Icon, { type: node.Icon || "email" }),
                                name_1) }, subs));
                    }
                    else {
                        result.push(react_1["default"].createElement(antd_1.Menu.Item, { key: node.Id },
                            react_1["default"].createElement(antd_1.Icon, { type: node.Icon || "mail" }),
                            name_1));
                    }
                }
                return result;
            };
            _this.checkHeight = function () {
                var vh = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
                var header = document.getElementById("layout-header");
                var folder = document.getElementById("menu_fold_handler");
                var y = vh - (header ? header.clientHeight : 0) - (folder ? folder.clientHeight : 0);
                if (!_this.y || Math.abs(_this.y - y) > 3) {
                    _this.y = y;
                }
                _this.menuArea.style.height = _this.y + "px";
            };
            return _this;
        }
        MainMenuView.prototype.render = function () {
            var _this = this;
            var state = this.props;
            var header = document.getElementById('layout-header');
            if (!header)
                return null;
            var collapsed = state.collapsed;
            var hidden = state.hidden;
            if (state.mode === 'min') {
                if (collapsed === undefined)
                    collapsed = true;
                if (hidden === undefined)
                    hidden = true;
            }
            var vp = utils_1.viewport(true);
            var h = vp.h;
            var menuMode = collapsed && state.mode !== 'min' ? 'vertical' : 'inline';
            if (state.mode === 'min')
                menuMode = 'inline';
            else if (collapsed)
                menuMode = 'vertical';
            else if (state.mode === 'horizontal')
                menuMode = 'horizontal';
            var foldable = menuMode != 'vertical' && !collapsed && state.mode != 'min';
            if (state.mode == 'normal' || state.mode == 'fold' || !state.mode) {
                utils_1.attach(window, 'resize', this.checkHeight);
            }
            else {
                utils_1.detech(window, 'resize', this.checkHeight);
            }
            return react_1["default"].createElement("div", { id: this.props.id || "", className: this.props.className, style: { display: hidden ? 'none' : 'block', height: (state.mode == 'normal' || state.mode == 'fold') && !state.collapsed ? h + "px" : 'auto' } },
                foldable ?
                    react_1["default"].createElement("div", { className: 'fold-menu', id: 'menu_fold_handler', onClick: state.onMenuToggleFold },
                        react_1["default"].createElement(antd_1.Icon, { type: state.mode === 'fold' ? 'menu-unfold' : 'menu-fold' })) : null,
                react_1["default"].createElement("div", { className: 'menuArea', ref: function (node) { return _this.menuArea = node; }, style: { "overflowY": "auto" } },
                    react_1["default"].createElement(antd_1.Menu, { className: 'menus', defaultSelectedKeys: state.defaultSelectedKeys, defaultOpenKeys: state.defaultOpenKeys, mode: menuMode, onMouseOver: state.onMouseOver, onMouseOut: state.onMouseOut, theme: state.theme_type, inlineCollapsed: state.mode == 'fold' && menuMode != 'vertical' ? true : false, onOpenChange: this.checkHeight }, this._buildMenu(state.roots, state.onMenuClick))));
        };
        MainMenuView.prototype.componentDidMount = function () {
        };
        MainMenuView.prototype.componentWillUnmount = function () {
            utils_1.detech(window, 'resize', this.checkHeight);
        };
        return MainMenuView;
    }(react_1.Component));
    exports["default"] = MainMenuView;
});
