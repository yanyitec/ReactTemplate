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
define(["require", "exports", "lib/react/react", "lib/antd/antd", "lib/ui"], function (require, exports, react_1, antd_1, ui_1) {
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
            return _this;
        }
        MainMenuView.prototype.render = function () {
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
            //let data= roots;
            var className1 = state.className || "";
            if (collapsed)
                className1 += ' collapsed';
            if (state.mode === 'fold')
                className1 += ' fold';
            var vt = ui_1.viewport(true);
            var h = vt.h - header.clientHeight;
            var menuMode = collapsed && state.mode !== 'min' ? 'vertical' : 'inline';
            if (state.mode === 'min')
                menuMode = 'inline';
            else if (collapsed)
                menuMode = 'vertical';
            else if (state.mode === 'horizontal')
                menuMode = 'horizontal';
            var foldable = state.foldable && menuMode != 'vertical' && !collapsed;
            return react_1["default"].createElement("div", { id: this.props.id || "", style: { display: hidden ? 'none' : 'block', height: (state.mode == 'normal' || state.mode == 'fold') && !state.collapsed ? h + "px" : 'auto' }, className: className1 },
                foldable ?
                    react_1["default"].createElement("div", { className: 'fold-menu', onClick: state.onMenuToggleFold },
                        react_1["default"].createElement(antd_1.Icon, { type: state.mode === 'fold' ? 'menu-unfold' : 'menu-fold' })) : null,
                react_1["default"].createElement(antd_1.Menu, { className: 'menus', defaultSelectedKeys: state.defaultSelectedKeys, defaultOpenKeys: state.defaultOpenKeys, mode: menuMode, onMouseOver: state.onMouseOver, onMouseOut: state.onMouseOut, theme: state.theme_type, inlineCollapsed: state.mode == 'fold' && menuMode != 'vertical' ? true : false }, this._buildMenu(state.roots, state.onMenuClick)));
        };
        return MainMenuView;
    }(react_1.Component));
    exports["default"] = MainMenuView;
});
