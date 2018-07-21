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
define(["require", "exports", "lib/react/react", "lib/utils", "lib/antd/antd"], function (require, exports, react_1, utils_1, antd_1) {
    "use strict";
    exports.__esModule = true;
    function eachChildren(node, handler, deep) {
        if (!node || !node.props)
            return;
        var children = node.props.children;
        if (!children)
            return;
        if (!deep)
            deep = 1;
        if (children.length !== undefined && typeof children.push === 'function') {
            var nextDeep = deep + 1;
            for (var i = 0, j = children.length; i < j; i++) {
                var child = children[i];
                var rs = handler(child, i, node, deep);
                if (rs === false || rs === 'break')
                    return;
                if (rs === 'continue')
                    continue;
                eachChildren(children[i], handler, nextDeep);
            }
        }
        else {
            var rs = handler(children, 0, node, deep);
            if (rs === false || rs === 'break' || rs === 'continue')
                return;
            eachChildren(children, handler, deep + 1);
        }
    }
    exports.eachChildren = eachChildren;
    function registerComponent(name, component) {
        if (antd_1["default"][name])
            throw new Error("aleady has a component named " + name);
        antd_1["default"][name] = component;
    }
    exports.registerComponent = registerComponent;
    var Center = /** @class */ (function (_super) {
        __extends(Center, _super);
        function Center() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Center.prototype.render = function () {
            return react_1["default"].createElement("div", __assign({ ref: 'elem' }, this.props), this.props.children);
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
                var pPos = utils_1.getBox(ctr.offsetParent);
                var _a = utils_1.getBox(target), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                x = x - pPos.x;
                y = y - pPos.y;
                var adjust = parseInt(_this.props.adjust) || 0;
                var vType = utils_1.viewport();
                if (vType === 'xs')
                    adjust = 0;
                var top = y + (height - ctr.clientHeight) / 2 + adjust;
                if (_this.props.mintop) {
                    var min = parseInt(_this.props.mintop);
                    if (vType === 'xs')
                        min = 0;
                    if (top < min)
                        top = min;
                }
                if (top < 50 && vType !== 'xs')
                    top = 50;
                ctr.style.left = x + (width - ctr.clientWidth) / 2 + "px";
                ctr.style.top = top + "px";
            };
            setTimeout(rsz, 0);
            utils_1.attach(window, 'resize', rsz);
        };
        Center.prototype.componentWillUnmount = function () {
            var ctr = this.refs["elem"];
            utils_1.detech(window, 'resize', ctr.__rsz);
        };
        return Center;
    }(react_1["default"].Component));
    exports.Center = Center;
    var FieldView = /** @class */ (function (_super) {
        __extends(FieldView, _super);
        function FieldView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FieldView.prototype.render = function () {
            var state = this.props;
            if (state.disabled === true)
                return null;
            var field = state.field || {};
            var inputType = field.inputType || state.inputType || 'Input';
            var name = field.name || state.name;
            var cls = field.css;
            if (cls === undefined) {
                cls = '';
                if (this.props.className)
                    cls += ' ' + this.props.className;
                cls += ' ' + inputType;
                cls += ' ' + name;
                cls += ' field';
                field.css = cls;
            }
            if (state.valid)
                cls += ' ' + state.valid;
            var input = antd_1["default"][inputType];
            var label;
            if (field.info) {
                label = react_1["default"].createElement(antd_1.Tooltip, { title: field.info },
                    react_1["default"].createElement("label", { className: 'field-label' },
                        field.text || state.text || name,
                        state.required ? react_1["default"].createElement("span", { className: 'required' }, "*") : null));
            }
            else {
                label = react_1["default"].createElement("label", { className: 'field-label' },
                    field.text || this.props.text || name,
                    state.required ? react_1["default"].createElement("span", { className: 'required' }, "*") : null);
            }
            //field.className = "field-input";
            return react_1["default"].createElement("div", { className: cls },
                label,
                react_1["default"].createElement("span", { className: 'field-input' }, react_1["default"].createElement(input, state)));
        };
        return FieldView;
    }(react_1.Component));
    exports.FieldView = FieldView;
    var FieldsetView = /** @class */ (function (_super) {
        __extends(FieldsetView, _super);
        function FieldsetView(props) {
            var _this = _super.call(this, props) || this;
            _this.onToggle = function () {
                _this.setState({ expended: !_this.state.expended });
            };
            _this.state = {
                expended: false
            };
            return _this;
        }
        FieldsetView.prototype.render = function () {
            var _this = this;
            var state = this.props;
            var fields = state.fields || {};
            var hasHidden = false;
            var canCollapse = false;
            var vp = utils_1.viewport();
            var alloweds = state.allowedFieldnames;
            var visibles = state.visibleFieldnames;
            var showAll = state.showAllAllowedFields;
            var fieldcount = 0;
            eachChildren(this, function (child, index, parent, deep) {
                if (deep > 3 || !child)
                    return false;
                if (child.type !== FieldView)
                    return;
                var cprops = child.props;
                var name = cprops.name;
                var field = fields[name];
                if (!field) {
                    fieldcount += 1;
                    return;
                }
                cprops.field = field;
                if (alloweds && !alloweds[name]) {
                    cprops.disabled = true;
                }
                if ((visibles && !visibles[name]) || (cprops[vp] === false)) {
                    if (showAll !== true && !_this.state.expended) {
                        hasHidden = true;
                        cprops.disabled = true;
                    }
                    else {
                        canCollapse = true;
                        fieldcount += 1;
                    }
                }
                return null;
            });
            if (fieldcount === 0 && !hasHidden)
                return null;
            var addition = null;
            if (hasHidden) {
                addition = react_1["default"].createElement("div", { key: 'fieldset-goggle', className: 'fieldset-goggle', onClick: this.onToggle },
                    react_1["default"].createElement(antd_1.Icon, { type: "down" }));
            }
            else if (canCollapse) {
                addition = react_1["default"].createElement("div", { key: 'fieldset-goggle', className: 'fieldset-goggle', onClick: this.onToggle },
                    react_1["default"].createElement(antd_1.Icon, { type: "up" }));
            }
            return react_1["default"].createElement("div", { className: 'grid' },
                this.props.children,
                addition);
        };
        return FieldsetView;
    }(react_1.Component));
    exports.FieldsetView = FieldsetView;
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
