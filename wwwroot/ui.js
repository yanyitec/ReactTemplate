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
define(["require", "exports", "lib/react/react"], function (require, exports, React) {
    "use strict";
    exports.__esModule = true;
    var Loadable = /** @class */ (function (_super) {
        __extends(Loadable, _super);
        function Loadable(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { loadingText: props["loadingText" || "正在加载..."], isLoading: true };
            return _this;
        }
        Loadable.prototype.render = function () {
            var clientId = this.props.id;
            if (!clientId)
                clientId = "loadable_" + genId();
            var module = this.module = this.props.module;
            var parameters = this.parameters = this.props.parameters;
            var mask;
            if (this.state.isLoading) {
                mask = React.createElement("div", { className: 'loadable-mask' },
                    React.createElement("div", { className: 'loadable-bg' }),
                    React.createElement("div", { className: 'loadable-notice' }, this.state.loadingText));
            }
            return React.createElement("div", { className: 'loadable-container', id: clientId, ref: "loadable-container" },
                React.createElement("div", { className: 'loadable-content', ref: "loadable-content" }),
                mask);
        };
        Loadable.prototype.componentDidMount = function () {
            var _this = this;
            console.log("componentDidMount");
            var promise;
            var domElement = this.domElement = this.refs["loadable-content"];
            if (!domElement)
                return;
            if (!this.module)
                return;
            if (typeof this.module === 'string') {
                promise = require(this.module);
            }
            else {
                promise = this.module;
            }
            promise.done(function (value) {
                if (!value) {
                    return;
                }
                //let domElement=this.domElement = document.getElementById(this.clientId) as HTMLDivElement;
                if (!domElement)
                    return;
                if (typeof value === "string") {
                    domElement.innerHTML = value;
                    return _this.setState({ isLoading: false });
                }
                var renderTo = value.renderTo;
                if (typeof renderTo === 'function') {
                    var renderResult = renderTo(domElement, _this.parameters, domElement);
                    if (renderResult && renderResult.then) {
                        renderResult.then(function () {
                            _this.setState({ isLoading: false });
                        });
                        return;
                    }
                }
                _this.setState({ isLoading: false });
            });
        };
        Loadable.prototype.componentWillUnmount = function () {
        };
        return Loadable;
    }(React.Component));
    exports.Loadable = Loadable;
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
