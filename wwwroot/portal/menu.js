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
            var _a = this.props, roots = _a.roots, defaultSelectedKeys = _a.defaultSelectedKeys, defaultOpenKeys = _a.defaultOpenKeys, mode = _a.mode, hidden = _a.hidden, className = _a.className, onMenuClick = _a.onMenuClick, onMenuToggleFold = _a.onMenuToggleFold, onMouseOut = _a.onMouseOut, onMouseOver = _a.onMouseOver;
            //let data= roots;
            var className1 = className || "";
            if (hidden)
                className1 += ' hidden';
            if (mode === 'fold')
                className1 += ' fold';
            var vt = ui_1.viewType();
            return react_1["default"].createElement("div", { id: this.props.id || "", style: { display: hidden ? 'none' : 'block' } },
                mode === 'min' || mode == 'horizontal' || vt === 'xs' ? null :
                    react_1["default"].createElement("div", { className: 'toggle-menu', onClick: onMenuToggleFold },
                        react_1["default"].createElement(antd_1.Icon, { type: mode === 'fold' ? 'menu-unfold' : 'menu-fold' })),
                react_1["default"].createElement(antd_1.Menu, { className: 'menus', defaultSelectedKeys: defaultSelectedKeys, defaultOpenKeys: defaultOpenKeys, mode: mode == 'min' ? 'vertical' : 'inline', onMouseOver: onMouseOver, onMouseOut: onMouseOut, theme: "dark", inlineCollapsed: mode == 'fold' ? true : false }, this._buildMenu(roots, onMenuClick)));
        };
        return MainMenuView;
    }(react_1.Component));
    exports["default"] = MainMenuView;
});
