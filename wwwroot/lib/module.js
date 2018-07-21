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
define(["require", "exports", "lib/react/react", "lib/react/react-dom", "lib/redux/redux", "lib/redux/react-redux", "lib/utils", "lib/react/prop-types", "lib/axios", "lib/antd/antd"], function (require, exports, React, ReactDOM, redux_1, react_redux_1, utils_1, PropTypes, axios, antd_1) {
    "use strict";
    exports.__esModule = true;
    var Loadable = /** @class */ (function (_super) {
        __extends(Loadable, _super);
        function Loadable(props) {
            return _super.call(this, props) || this;
        }
        Loadable.prototype.render = function () {
            var _this = this;
            var ctype = this.props.ctype;
            var vnode;
            if (ctype === 'v-node' || ctype === 'text') {
                if (this.props.loaded)
                    this.props.loaded.call(this.cnode, ctype, this.props.content);
                return React.createElement("div", null, this.props.content || null);
            }
            vnode = React.createElement("div", { ref: function (node) { return _this.cnode = node; } });
            if (ctype === 'html') {
                this.componentDidMount = this.componentDidUpdate = function () {
                    _this.cnode.innerHTML = _this.props.content;
                    if (_this.props.loaded)
                        _this.props.loaded.call(_this.cnode, 'html', _this.cnode);
                };
                return vnode;
            }
            if (ctype === 'dom') {
                this.componentDidMount = this.componentDidUpdate = function () {
                    _this.cnode.innerHTML = "";
                    _this.cnode.appendChild(_this.props.content);
                    if (_this.props.loaded)
                        _this.props.loaded.call(_this.cnode, 'dom', _this.props.content);
                };
                return vnode;
            }
            if (ctype === 'iframe') {
                this.componentDidMount = this.componentDidUpdate = this.renderIframe;
                return vnode;
            }
            if (ctype === 'module') {
                this.componentDidMount = this.componentDidUpdate = this.renderModule;
                return vnode;
            }
            return vnode;
        };
        Loadable.prototype.componentDidMount = function () {
        };
        Loadable.prototype.componentDidUpdate = function () {
        };
        Loadable.prototype.renderModule = function () {
            var _this = this;
            if (this.loadedUrl && this.loadedUrl == this.props.url && this.props.tick == this.tick) {
                return;
            }
            this.tick = this.props.tick;
            require(this.loadedUrl = this.props.url).then(function (mod) {
                if (mod.createInstance && mod.mount) {
                    var mod_element = document.createElement('div');
                    _this.cnode.innerHTML = "";
                    _this.cnode.appendChild(mod_element);
                    mod.mount(_this.props.mod_state, mod_element, _this.props.super_store).then(function (store) {
                        store.$modname = _this.props.url;
                        if (_this.props.loaded)
                            _this.props.loaded.call(_this.cnode, 'module', store);
                    });
                }
            });
        };
        Loadable.prototype.renderIframe = function () {
            var _this = this;
            if (this.loadedUrl && this.loadedUrl == this.props.url && this.props.tick == this.tick) {
                return;
            }
            this.tick = this.props.tick;
            this.cnode.innerHTML = "<iframe></iframe>";
            var iframe = this.cnode.firstChild;
            iframe.onload = function () {
                if (_this.props.loaded)
                    _this.props.loaded.call(iframe, 'iframe', iframe);
            };
            var url = this.loadedUrl = this.props.url;
            if (url.indexOf('?') < 0)
                url += '?';
            else
                url += '&';
            iframe.src = url += '_nocache=' + Math.random();
            var fill = function () {
                if (_this._w != _this.cnode.offsetWidth)
                    iframe.width = (_this._w = _this.cnode.offsetWidth) + 'px';
                if (_this._h != _this.cnode.offsetHeight)
                    iframe.height = (_this._h = _this.cnode.offsetHeight) + 'px';
            };
            if (this.rszTimer)
                clearInterval(this.rszTimer);
            this.rszTimer = setInterval(fill, 100);
            fill();
        };
        Loadable.prototype.renderPage = function () {
            var _this = this;
            if (this.loadedUrl && this.loadedUrl == this.props.url && !this.props.forceRefresh) {
                return;
            }
            axios.get(this.props.url).then(function (response) {
                _this.cnode.innerHTML = response.data;
                if (_this.props.loaded)
                    _this.props.loaded.call(_this.cnode, 'iframe', _this.cnode);
            });
        };
        return Loadable;
    }(React.Component));
    exports.Loadable = Loadable;
    function define_module(Component, moduleArguments) {
        moduleArguments || (moduleArguments = {});
        var createInstance = function (props, superStore, creation) {
            creation || (creation = {});
            creation.$super_store = superStore;
            (props || (props = {}));
            // 状态
            var state;
            if (typeof moduleArguments.state === 'function')
                state = moduleArguments.state(props);
            else
                state = moduleArguments.state;
            //props优先
            state = utils_1.mergeDiff(state, props);
            if (!state.$mod)
                state.$mod = {};
            creation.$state = state;
            creation.$reducer = Component.$reducer || (Component.$reducer = createReducer(creation, moduleArguments));
            // 状态管理 store
            var store = creation.$store = createMyStore(Component, creation, moduleArguments);
            var Wrap = Module.$Wrap || (Module.$Wrap = createWrapComponent(Component));
            var Redux = creation.Redux = createRedux(Wrap, moduleArguments);
            var instance = creation.instance = React.createElement(react_redux_1.Provider, { store: store },
                React.createElement(Redux, null));
            creation.instance = instance;
            if (moduleArguments.onCreating)
                moduleArguments.onCreating(creation);
            return instance;
        };
        var Module = Component;
        // 默认都在context上挂上store
        Module.contextTypes = { store: PropTypes.object };
        // 接口
        // 默认都在context上挂上store
        Module.createInstance = createInstance;
        Module.mount = function (props, element, superStore) {
            return new Promise(function (resolve, reject) {
                if (moduleArguments.mount_async) {
                    moduleArguments.mount_async({
                        args: moduleArguments,
                        props: props,
                        element: element,
                        superStore: superStore
                        //transport:transport
                    }).then(function (opts) {
                        if (!opts || !opts.element || !opts.args)
                            return;
                        var creation = {};
                        var component = createInstance(opts.props, opts.superStore, creation);
                        ReactDOM.render(component, element, function () {
                            resolve(creation.$store);
                        });
                    }, function (opts) {
                        if (!opts || !opts.element || !opts.args)
                            return;
                        var creation = {};
                        var component = createInstance(opts.props, opts.superStore, creation);
                        ReactDOM.render(component, element, function () {
                            resolve(creation.$store);
                        });
                    });
                }
                else {
                    var creation_1 = {};
                    var component = createInstance(props, superStore, creation_1);
                    ReactDOM.render(component, element, function () {
                        resolve(creation_1.$store);
                    });
                }
            });
        };
        return Module;
    }
    exports["default"] = define_module;
    function createReducer(creation, moduleArguments) {
        // 行为/事件处理 reducers
        var reducer;
        var action_handlers = moduleArguments.action_handlers || {};
        action_handlers['pop.create'] = function (state, loadableAction) {
            if (state.$mod.pop && state.$mod.pop.status !== 'close') {
                throw new Error("already pop out a layer.");
            }
            loadableAction.status = 'creating';
            loadableAction.__REPLACEALL__ = true;
            loadableAction.super_store = creation.$store;
            //加载完成
            loadableAction.loaded = function (type, result) {
                creation.$store.dispatch({ type: 'pop.load', load_content: result, ctype: type });
                //通知app更新导航条
                if (loadableAction.nav_text) {
                    creation.$store.root().dispatch({ type: 'nav.push', text: loadableAction.nav_text, info: result });
                }
                if (loadableAction.onload) {
                    if (typeof loadableAction.loaded.resolve === 'function')
                        loadableAction.onload.resolve(result);
                    else
                        loadableAction.onload(result);
                }
                //action.payload.resolve(result);
            };
            return { $mod: { pop: loadableAction, waiting: true } };
        };
        action_handlers['pop.load'] = function (state, action) {
            return { $mod: { waiting: false, pop: {
                        status: 'load',
                        load_content: action.load_content,
                        ctype: action.ctype,
                        store: action.ctype == 'module' ? action.load_content : null
                    } } };
        };
        action_handlers['pop.close'] = function (state, action) {
            var popState = state.$mod.pop;
            var popStore = popState.store;
            var status = action.data;
            var result = { status: status, store: popStore };
            if (popStore.__close_handlers) {
                for (var i = 0, j = popStore.__close_handlers.length; i < j; i++) {
                    var handler = popStore.__close_handlers.shift();
                    handler.call(popStore, result);
                }
            }
            var onclose = popState.onclose;
            var id = popState.id;
            if (onclose) {
                setTimeout(function () {
                    if (typeof onclose.resolve === 'function')
                        onclose.resolve(result);
                    else if (typeof onclose === 'function')
                        onclose(result);
                    creation.$store.root().dispatch({ type: 'nav.pop', id: id });
                }, 0);
            }
            return { $mod: { pop: null } };
        };
        var customReducer = moduleArguments.reducer;
        if (customReducer) {
            reducer = function (oldState, action) {
                var newState = customReducer.call(creation.$store, oldState, action);
                if (!newState || newState === oldState) {
                    var handler = action_handlers[action.type];
                    if (handler) {
                        newState = handler.call(creation.$store, oldState, action);
                    }
                    else {
                        console.warn('disatch a unknown action. state will keep the same.', action);
                        newState = oldState;
                    }
                }
                return afterReducer(oldState, newState, action);
            };
        }
        else {
            reducer = function (oldState, action) {
                var newState;
                var handler = action_handlers[action.type];
                if (handler) {
                    newState = handler.call(creation.$store, oldState, action);
                }
                else {
                    console.warn('disatch a unknown action. state will keep the same.', action);
                    newState = oldState;
                }
                return afterReducer(oldState, newState, action);
            };
        }
        var afterReducer = function (oldState, newState, action) {
            if (!newState) {
                console.error('reducer must return a state.', action);
                new Error('reducer must return a state.');
            }
            if (action.payload && typeof action.payload.then === 'function') {
                action.payload.then(function (result) { if (result)
                    creation.$store.dispatch(result); });
            }
            if (newState.__REPLACEALL__) {
                newState.__REPLACEALL__ = undefined;
                return newState;
            }
            newState = oldState != newState ? utils_1.mergeDiff(oldState, newState) : oldState;
            if (newState.__REPLACEALL__)
                newState.__REPLACEALL__ = undefined;
            return newState;
        };
        return reducer;
    }
    function createMyStore(Component, creation, moduleArguments) {
        var store = creation.$store = redux_1.createStore(creation.$reducer, creation.$state);
        store.super_store = creation.$super_store;
        store.$inDialog = creation.$state.$inDialog;
        store.__close_handlers;
        store.closing = function (handler) {
            if (!store.__close_handlers)
                store.__close_handlers = [];
            store.__close_handlers.push(handler);
            return function () {
                for (var i = 0, j = store.__close_handlers.length; i < j; i++) {
                    var h = store.__close_handlers.shift();
                    if (h !== handler)
                        store.__close_handlers.push(h);
                }
            };
        };
        store.root = function () {
            var p = store;
            while (p) {
                if (!p.super_store)
                    return p;
                else
                    p = p.super_store;
            }
        };
        store.pop = function (param) {
            return new Promise(function (resolve, reject) {
                var action = {
                    type: 'pop.create',
                    mod_state: param.data,
                    url: param.url,
                    ctype: 'module'
                };
                if (param.fireOnLoaded)
                    action.onload = resolve;
                else
                    action.onclose = resolve;
                setTimeout(function () { return store.dispatch(action); }, 0);
            });
        };
        var api = Component.$api;
        if (!api) {
            if (typeof moduleArguments.apiProvider === 'function')
                api = Component.$api = moduleArguments.apiProvider(store);
        }
        if (api) {
            for (var n in api) {
                if (store[n] === undefined) {
                    store[n] = api[n];
                }
                else {
                    console.warn('already has the same name member in store ' + n);
                }
            }
        }
        return store;
    }
    function createRedux(ModComponent, moduleArguments) {
        // 状态到属性的映射 注入状态到属性中去 mapStateToProps
        var mapStateToProps = moduleArguments.mapStateToProps;
        if (!mapStateToProps) {
            mapStateToProps = function (state) {
                return state;
            };
        }
        // 消息分发映射 注入消息工厂函数 到属性中去 
        var mapDispatchToProps = moduleArguments.mapDispatchToProps;
        var action_handlers = moduleArguments.action_handlers;
        if (action_handlers) {
            if (!mapDispatchToProps) {
                mapDispatchToProps = function (dispatch) {
                    var dispatchers = {};
                    for (var actionName in action_handlers) {
                        dispatchers[actionName] = (function (actionName, dispatch) {
                            return function (evtData, extra) { return dispatch({ type: actionName, data: evtData, extra: extra }); };
                        })(actionName, dispatch);
                    }
                    return dispatchers;
                };
            }
            else {
                var map = mapDispatchToProps;
                throw new Error("Not implement.");
            }
        }
        return react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ModComponent);
    }
    var createWrapComponent = function (Component) {
        var _a;
        return _a = /** @class */ (function (_super) {
                __extends(WrapComponent, _super);
                function WrapComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WrapComponent.prototype.render = function () {
                    var _this = this;
                    var state = this.props.$mod;
                    var waiting;
                    if (state.isWaiting) {
                        waiting = React.createElement("div", { className: 'waiting', ref: function (node) { return _this.waitingElement = node; }, style: { position: 'absolute' } },
                            React.createElement("div", { className: 'waiting-back' }),
                            React.createElement("div", { className: 'waiting-front', ref: function (node) { return _this.waitingFrontElement = node; }, style: { position: 'absolute' } },
                                React.createElement("div", { className: 'waiting-message' }, state.waiting_message)));
                    }
                    else {
                        if (this.waiting_timer) {
                            clearInterval(this.waiting_timer);
                            this.waiting_timer = 0;
                        }
                    }
                    var pop, main_hidden = false;
                    if (state.pop && state.pop.status !== 'close') {
                        if (state.pop.popType === 'dialog') {
                            pop = this.popDialog(state.pop);
                        }
                        else if (state.pop.popType === 'layer') {
                            main_hidden = true;
                            pop = this.popLayer(state.pop);
                        }
                        else {
                            var vp = utils_1.viewport();
                            if (vp === 'xs') {
                                pop = this.popLayer(state.pop);
                                main_hidden = true;
                            }
                            else
                                pop = this.popDialog(state.pop);
                        }
                        //state.pop['module.']
                    }
                    return React.createElement("div", { className: 'module', ref: function (node) { return _this.modElement = node; } },
                        waiting,
                        React.createElement("div", { className: 'module-component', style: { display: main_hidden ? "none" : '' } },
                            React.createElement(Component, __assign({}, this.props))),
                        pop);
                };
                WrapComponent.prototype.popDialog = function (popState) {
                    var _this = this;
                    popState.$inDialog = true;
                    var contentView = React.createElement(Loadable, popState, null);
                    return React.createElement(antd_1.Modal, { title: this.props.title, visible: true, onOk: function () { return _this.props["pop.close"]('ok'); }, onCancel: function () { return _this.props["pop.close"]('cancel'); }, confirmLoading: false }, contentView);
                };
                WrapComponent.prototype.popLayer = function (popState) {
                    return React.createElement(Loadable, popState, null);
                };
                WrapComponent.prototype.componentDidMount = function () { this.checkWaiting(); };
                WrapComponent.prototype.componentDidUpdate = function () { this.checkWaiting(); };
                WrapComponent.prototype.checkWaiting = function () {
                    var _this = this;
                    if (this.waiting_timer)
                        clearInterval(this.waiting_timer);
                    if (!this.waitingElement || !this.waitingFrontElement || !this.modElement)
                        return;
                    var cover = function () {
                        if (++_this.tick_count === 200) {
                            _this.tick_count = 0;
                            var p = _this.modElement;
                            while (p) {
                                if (p === document.body) {
                                    break;
                                }
                            }
                            if (!p) {
                                clearInterval(_this.waiting_timer);
                            }
                        }
                        _this.waitingElement.style.width = _this.modElement.offsetWidth + "px";
                        _this.waitingElement.style.height = _this.modElement.offsetHeight + 'px';
                        var x = (_this.modElement.offsetWidth - _this.waitingElement.clientWidth) / 2;
                        var y = (_this.modElement.offsetHeight - _this.waitingElement.clientHeight) / 2;
                        _this.waitingFrontElement.left = x + "px";
                        _this.waitingFrontElement.top = y + "px";
                    };
                    this.waiting_timer = setInterval(cover, 100);
                    cover();
                };
                WrapComponent.prototype.componentWillUnmount = function () {
                    alert('destory');
                    if (this.waiting_timer)
                        clearInterval(this.waiting_timer);
                    var store = this.context.store;
                    store.dispatch({ type: 'module.closing' });
                    if (store.super_store)
                        store.super_store.dispatch({ type: 'pop.closing' });
                };
                return WrapComponent;
            }(React.Component)),
            _a.contextTypes = {
                store: PropTypes.object
            },
            _a;
    };
    exports.$mountable = define_module;
    exports.__module__ = define_module;
    define_module.__module__
        = define_module.$module
            = define_module.$mountable
                = define_module;
    define_module.Loadable = Loadable;
});
