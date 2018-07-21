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
define(["require", "exports", "lib/react/react", "lib/ui", "lib/module", "lib/antd/antd"], function (require, exports, React, ui_1, module_1, antd_1) {
    "use strict";
    exports.__esModule = true;
    var FormView = /** @class */ (function (_super) {
        __extends(FormView, _super);
        function FormView(props) {
            return _super.call(this, props) || this;
        }
        FormView.prototype.render = function () {
            return React.createElement(antd_1.Collapse, null,
                React.createElement(antd_1.Collapse.Panel, null,
                    React.createElement(ui_1.FieldsetView, { header: "\u57FA\u672C\u4FE1\u606F" },
                        React.createElement("div", null, this.props.Id),
                        React.createElement("div", { className: 'grid' },
                            React.createElement(ui_1.FieldView, { className: 'col-d4', name: 'Id', xs: 'false' }),
                            React.createElement(ui_1.FieldView, { className: 'col-d4', required: true, name: 'Name', inputType: 'DatePicker', xs: 'false' })))));
        };
        return FormView;
    }(React.Component));
    exports["default"] = module_1.$mountable(FormView, {});
});
