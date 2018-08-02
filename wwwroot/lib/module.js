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
        Loadable.prototype.ctype = function () {
            var ctype = this.props.ctype;
            if (ctype !== undefined)
                return ctype;
            var content = this.props.content;
            if (content !== undefined) {
                if (content._reactInternalInstance)
                    return 'v-node';
                if (content.tagName !== undefined && content.nodeType !== undefined)
                    return 'dom';
                if (typeof content === 'string')
                    return 'html';
                return 'text';
            }
            var url = this.props.url;
            if (url) {
                if (/(.html?$)|(.html?\?)/.test(url))
                    return 'iframe';
                if (/.js$/.test(url))
                    return 'module';
            }
        };
        Loadable.prototype.render = function () {
            var _this = this;
            var ctype = this.ctype();
            if (!ctype) {
                console.warn("无法确定ctype,不显示任何东西", this.props);
                return null;
            }
            var props = this.props;
            var vnode;
            if (props.Component) {
                if (this.loaded_content != props.Component) {
                    if (props.onContentChange)
                        setTimeout(function () { return props.onContentChange.call(_this.cnode, _this.loaded_content, ctype); }, 0);
                }
                var MyComponent = this.props.Component;
                return React.createElement(MyComponent, __assign({}, this.props.parameters, { ref: function (node) { return _this.loaded_content = node; } }));
            }
            if (ctype === 'v-node' || ctype === 'text') {
                var content = props.content || "";
                if (this.loaded_content != content) {
                    if (this.props.onContentChange)
                        setTimeout(function () { return props.onContentChange.call(_this.cnode, _this.props.content, ctype); }, 0);
                    this.loaded_content = content;
                }
                return React.createElement("div", null, content);
            }
            if (ctype === 'html') {
                var content = props.content || "";
                if (this.loaded_content != content) {
                    if (this.props.onContentChange)
                        setTimeout(function () { return props.onContentChange.call(_this.cnode, _this.props.content, ctype); }, 0);
                    this.loaded_content = content;
                }
                return React.createElement("div", { id: props.id || null, className: props.className || null, style: props.style || null, dangerouslySetInnerHTML: { __html: props.content } });
            }
            vnode = React.createElement("div", { id: props.id || null, className: props.className || null, style: props.style || null, ref: function (node) { return _this.cnode = node; } });
            if (ctype === 'dom') {
                this.componentDidMount = this.componentDidUpdate = function () {
                    var content = _this.props.content;
                    if (_this.cnode.firstChild != content) {
                        _this.cnode.innerHTML = "";
                        _this.cnode.appendChild(_this.props.content);
                        if (_this.props.onContentChange)
                            _this.props.onContentChange.call(_this.cnode, _this.props.content, ctype);
                    }
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
            if (this.loaded_url && this.loaded_url == this.props.url && this.props.tick == this.tick) {
                return;
            }
            this.tick = this.props.tick;
            require(this.loaded_url = this.props.url).then(function (mod) {
                var mod_element = document.createElement('div');
                _this.cnode.innerHTML = "";
                _this.cnode.appendChild(mod_element);
                var parameters = _this.props.parameters || {};
                if (_this.props.is_workarea)
                    parameters.__$is_workarea__ = true;
                if (mod.createInstance && mod.mount) {
                    mod.mount(parameters, mod_element, _this.props.super_store).then(function (store) {
                        store.$modname = _this.props.url;
                        _this.loaded_content = store;
                        if (_this.props.onContentChange)
                            _this.props.onContentChange.call(_this.cnode, store, 'store');
                    });
                }
                else if (typeof mod === 'function') {
                    _this.loaded_content = new mod(parameters, mod_element);
                    ReactDOM.render(_this.loaded_content, mod_element, _this.props.parameters);
                    if (_this.props.onContentChange)
                        _this.props.onContentChange.call(_this.cnode, _this.loaded_content, 'react');
                }
            });
        };
        Loadable.prototype.renderIframe = function () {
            var _this = this;
            if (this.loaded_url && this.loaded_url == this.props.url && this.props.tick == this.tick) {
                return;
            }
            this.tick = this.props.tick;
            var style = "border:0;padding:0;margin:0;";
            var width = this.props.width;
            if (width)
                style += "width:" + width + ";";
            else
                style += "width:100%;";
            var height = this.props.height;
            if (height)
                style += "height:" + height;
            //if(this.props.width)
            var html = "<iframe style='" + style + "' border='0' " + (height ? "height='" + height + "'" : "") + (width ? " width='" + width + "'" : " width='100%'") + "></iframe>";
            this.cnode.innerHTML = html;
            var iframe = this.cnode.firstChild;
            iframe.onload = function () {
                if (_this.props.onContentChange)
                    _this.props.onContentChange.call(iframe, iframe, "iframe");
            };
            var url = this.loaded_url = this.props.url;
            if (url.indexOf('?') < 0)
                url += '?';
            else
                url += '&';
            iframe.src = url += '_nocache=' + Math.random();
            var fill = function () {
                if (_this._w != _this.cnode.clientWidth)
                    iframe.width = (_this._w = _this.cnode.clientWidth) + 'px';
                if (_this._h != _this.cnode.clientWidth)
                    iframe.height = (_this._h = _this.cnode.clientHeight) + 'px';
            };
            //if(this.rszTimer) clearInterval(this.rszTimer);
            //this.rszTimer = setInterval(fill,100);
            //fill();
        };
        Loadable.prototype.renderPage = function () {
            var _this = this;
            if (this.loaded_url && this.loaded_url == this.props.url && this.props.tick == this.tick) {
                return;
            }
            axios.get(this.props.url).then(function (response) {
                _this.cnode.innerHTML = response.data;
                if (_this.props.onContentChange)
                    _this.props.onContentChange.call(_this.cnode, response.data, 'html');
            });
        };
        return Loadable;
    }(React.Component));
    exports.Loadable = Loadable;
    function define_module(Component) {
        var moduleArguments = Component;
        var createInstance = function (props, creation) {
            creation || (creation = {});
            //creation.super_store = superStore;
            (props || (props = {}));
            // 状态
            var state;
            if (typeof moduleArguments.state === 'function')
                state = moduleArguments.state(props);
            else
                state = moduleArguments.state;
            //props优先
            state = utils_1.mergeDiff(state, props);
            creation.state = state;
            creation.reducer = Component.$reducer || (Component.$reducer = createReducer(creation, moduleArguments));
            // 状态管理 store
            var store = creation.store = redux_1.createStore(creation.reducer, creation.state);
            store.super_store = creation.super_store;
            store.is_inDialog = creation.state.$inDialog;
            store.initialize = moduleArguments.initialize;
            var p = store;
            while (p) {
                if (!p.super_store)
                    break;
                else
                    p = p.super_store;
            }
            store.root = p;
            injectApi(Component, creation);
            var Wrap = Module.$Wrap || (Module.$Wrap = createWrapComponent(Component));
            var Redux = creation.Redux = createRedux(Wrap, moduleArguments, creation);
            var instance = creation.instance = React.createElement(react_redux_1.Provider, { store: store },
                React.createElement(Redux, null));
            creation.instance = instance;
            //if(moduleArguments.onCreating) moduleArguments.onCreating(creation);
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
                var creation = { super_store: superStore };
                var component = createInstance(props, creation);
                ReactDOM.render(component, element, function () {
                    resolve(creation.store);
                });
            });
        };
        return Module;
    }
    exports["default"] = define_module;
    function createReducer(creation, moduleArguments) {
        // 行为/事件处理 reducers
        var reducer;
        var action_handlers = creation.actions = __assign({}, moduleArguments.actions) || {};
        action_handlers["$module.init"] = function (state, action) {
            if (!action.state) {
                return { $mask: null };
            }
            action.state.$mask = null;
            return action.state;
        };
        /*action_handlers["$module.setState"]=(state,action)=>{
            let newState = action.state;
            if(newState!==undefined)return newState;
            if(action.path){
                let accessor = objectAccessor(action.path);
                newState = accessor.setValue({},action.value);
            }
            return newState;
        }*/
        action_handlers['$modal.show'] = function (state, modalAction) {
            if (state.$modal && state.$modal.status !== 'close') {
                throw new Error("already pop out a layer.");
            }
            var modalState = modalAction;
            var loadableState = modalAction;
            modalState.status = 'creating';
            modalState.__REPLACEALL__ = true;
            loadableState.super_store = creation.store;
            //加载完成
            modalAction.onContentChange = function (result, type) {
                creation.store.dispatch({ type: '$modal.load', load_content: result, ctype: type });
                //通知app更新导航条
                if (modalState.nav_name) {
                    creation.store.root().dispatch({ type: 'nav.push', text: modalState.nav_name, info: result });
                }
                if (modalState.onload) {
                    if (typeof modalState.onload.resolve === 'function')
                        modalState.onload.resolve(result);
                    else
                        modalState.onload(result);
                }
                //action.payload.resolve(result);
            };
            return { $modal: modalState };
        };
        action_handlers['$mask.show'] = function (state, action) {
            action.__REPLACEALL__ = true;
            action.type = action.icon;
            return { $mask: action };
        };
        action_handlers['$mask.hide'] = function (state, action) {
            if (state.$mask.onclose)
                state.$mask.onclose(state);
            return { $mask: null };
        };
        action_handlers['$modal.load'] = function (state, action) {
            return {
                $mask: null,
                $modal: {
                    status: 'load',
                    load_content: action.load_content,
                    ctype: action.ctype,
                    store: action.ctype == 'module' ? action.load_content : null
                }
            };
        };
        action_handlers['$modal.close'] = function (state, action) {
            var popState = state.$modal;
            var popStore = popState.store;
            var result = { status: action.status, state: popStore ? popStore.getState() : popState };
            if (popStore && popStore.__close_handlers) {
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
                    creation.store.root.dispatch({ type: 'nav.pop', id: id });
                }, 0);
            }
            return { $modal: null };
        };
        var customReducer = moduleArguments.reducer;
        if (customReducer) {
            reducer = function (oldState, action) {
                var newState = customReducer.call(creation.store, oldState, action);
                if (!newState || newState === oldState) {
                    var handler = action_handlers[action.type];
                    if (handler) {
                        newState = handler.call(creation.store, oldState, action);
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
                    newState = handler.call(creation.store, oldState, action);
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
                    creation.store.dispatch(result); });
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
    function injectApi(Component, creation) {
        var store = creation.store;
        store.context = { store: store };
        var apiContainer = Component.prototype;
        if (!Component.__api_injected) {
            Component.__api_injected = true;
            if (Component.api) {
                for (var n in Component.api) {
                    apiContainer[n] = Component.api[n];
                }
            }
            /*
            apiContainer.$moduleState = function(path,value){
                if(path===undefined) return this.context.store.getState();
                if(typeof path==='string'){
                    if(value===undefined) {
                        let state =  this.context.store.getState();
                        let accessor = objectAccessor(path);
                        return accessor.getValue(state);
                    }else {
                        this.context.store.dispatch({
                            type:"$module.setState",
                            path:path,
                            value:value
                        });
                    }
                }else{
                    this.context.store.dispatch({
                        type:"$module.setState",
                        state:path
                    });
                }
            }*/
            apiContainer.$closing = function (handler) {
                var store = this.context.store;
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
            apiContainer.$store = function () { return this.context.store; };
            apiContainer.$waiting = function (msg, state) {
                var self = this;
                if (state)
                    state.$mask = { content: msg };
                else
                    setTimeout(function () { return self.context.store.dispatch({ type: "$mask.show", content: msg }); }, 0);
            };
            apiContainer.$app = apiContainer.$root = function () {
                var p = this.context.store;
                while (p) {
                    if (!p.super_store)
                        break;
                    else
                        p = p.super_store;
                }
                this.$root = this.$app = function () { return p; };
            };
            apiContainer.$navigate = function (url, ctype, parameters) {
                if (parameters === undefined) {
                    parameters = ctype;
                    ctype = undefined;
                }
                return this.$app().navigate(url, ctype, parameters);
            };
            apiContainer.$modal = function (action) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    action.type = "$modal.show";
                    action.modalType = null;
                    if (action.callbackOnLoad)
                        action.onload = resolve;
                    else
                        action.onclose = resolve;
                    setTimeout(function () { return _this.context.store.dispatch(action); }, 0);
                });
            };
            apiContainer.$dialog = function (action) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    action.type = "$modal.show";
                    action.modalType = "dialog";
                    if (action.callbackOnLoad)
                        action.onload = resolve;
                    else
                        action.onclose = resolve;
                    setTimeout(function () { return _this.context.store.dispatch(action); }, 0);
                });
            };
            apiContainer.$messageBox = function (text, caption, icon) {
                if (icon === undefined) {
                    icon = caption;
                    caption = null;
                }
                return new Promise(function (resolve, reject) {
                    var action = {
                        type: "$mask.show",
                        caption: caption,
                        message: text,
                        icon: icon,
                        onclose: resolve
                    };
                    setTimeout(function () { return store.dispatch(action); }, 0);
                });
            };
            apiContainer.$confirm = function (text, caption, icon) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var action = {};
                    action.type = "$modal.show";
                    action.modalType = "dialog";
                    action.ctype = "html";
                    action.content = text;
                    if (action.callbackOnLoad)
                        action.onload = resolve;
                    else
                        action.onclose = resolve;
                    setTimeout(function () { return _this.context.store.dispatch(action); }, 0);
                });
            };
            apiContainer.$validate = function (data, validator, lngs, returnHtml) {
                var validStates = validator(data);
                lngs || (lngs = {});
                var html = "<ul>";
                var c = 0;
                for (var n in validStates) {
                    var vrs = validStates[n];
                    if (vrs !== true) {
                        html += "<li><label>" + (lngs[n] || n) + "</label><span>" + vrs + "</span></li>";
                        c++;
                    }
                }
                html += "</ul>";
                if (c) {
                    if (returnHtml === true)
                        return html;
                    return this.$messageBox(html, lngs["validation"] || "验证", "error");
                }
                return null;
            };
            apiContainer.$get = function (url, data, waiting) {
                if (waiting)
                    this.waiting(waiting);
                var me = this;
                return new Promise(function (resolve, reject) {
                    var urls = require.resolveUrl(url);
                    doAjax(me, "get", url, urls, [], data, waiting, resolve, reject);
                });
            };
            apiContainer.$post = function (url, data, waiting) {
                if (waiting)
                    this.waiting(waiting);
                var me = this;
                return new Promise(function (resolve, reject) {
                    var urls = require.resolveUrl(url);
                    doAjax(me, "post", url, urls, [], data, waiting, resolve, reject);
                });
            };
        }
        if (Component.api) {
            for (var n in Component.api) {
                store[n] = Component.api[n];
            }
        }
        var apiKeys = ["$waiting", "$app", "$root", "$navigate", "$modal", "$get", "$post", "$messageBox", "$confirm", "$dialog", "$validate"];
        for (var i in apiKeys) {
            var key = apiKeys[i];
            store[key] = apiContainer[key];
        }
    }
    function doAjax(me, method, rawUrl, urls, visited, data, waiting, resolve, reject) {
        var _this = this;
        var url = urls.shift();
        if (!url) {
            console.error("ajax失败，无法访问urls", visited);
            resolve({ message: "ajax失败，无法访问urls", urls: visited });
            return;
        }
        var fn = axios[method];
        fn.call(axios, url, data).then(function (result) {
            if (result.statusCode === 401) {
                me.$root().auth().then(function () {
                    me['$' + method].call(me, rawUrl, data, waiting);
                });
                return;
            }
            if (waiting)
                _this.waiting(false);
            handleAjaxResult(me, result, resolve, reject);
        }, function (e) {
            visited.push(url);
            doAjax(me, method, rawUrl, urls, visited, data, waiting, resolve, reject);
        });
    }
    function handleAjaxResult(me, result, resolve, reject) {
        if (!result.data) {
            console.warn("返回的数据格式不正确，缺乏data字段");
            me.$messageBox("服务器错误:" + result.message, "warning");
            reject(result);
            return;
        }
        var remoteData = result.data;
        if (remoteData.StatusText === 'error') {
            //let errorMessage = remoteData.Message
            me.$messageBox(remoteData.Message || "服务器返回一个错误，请联系管理员", "error").done(function () { return reject(remoteData); });
            return;
        }
        var complete = function () {
            if (remoteData.ClientAction) {
                me.context.store.dispatch(remoteData.ClientAction, remoteData.Data);
            }
            else {
                var viewData = remoteData.ViewData;
                if (viewData)
                    resolve("#useApply", [remoteData.Data, remoteData.ViewData]);
                else
                    resolve(remoteData.Data);
            }
        };
        if (remoteData.Message) {
            me.$messageBox(remoteData.Message, "success").done(complete);
        }
        else
            complete();
    }
    function createRedux(ModComponent, moduleArguments, creation) {
        // 状态到属性的映射 注入状态到属性中去 mapStateToProps
        var mapStateToProps = moduleArguments.mapStateToProps;
        if (!mapStateToProps) {
            mapStateToProps = function (state) {
                return state;
            };
        }
        // 消息分发映射 注入消息工厂函数 到属性中去 
        var mapDispatchToProps = moduleArguments.mapDispatchToProps;
        var action_handlers = creation.actions;
        if (action_handlers) {
            if (!mapDispatchToProps) {
                mapDispatchToProps = function (dispatch) {
                    var dispatchers = {};
                    for (var actionName in action_handlers) {
                        dispatchers[actionName] = (function (actionName, dispatch) {
                            return function (evtData) {
                                if (evtData.preventDefault) {
                                    return dispatch({ type: actionName, event: evtData });
                                }
                                var action;
                                try {
                                    evtData.type = actionName;
                                    action = evtData;
                                }
                                catch (ex) {
                                    action = __assign({}, evtData, { type: actionName });
                                }
                                dispatch(action);
                            };
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
                function WrapComponent(props) {
                    return _super.call(this, props) || this;
                }
                WrapComponent.prototype.render = function () {
                    var _this = this;
                    var state = this.props;
                    var store = this.context.store;
                    var waiting;
                    var maskState = state.$mask;
                    if (store.initialize) {
                        maskState = { type: null, message: null, exclusive: true };
                    }
                    if (maskState) {
                        var maskCss = void 0;
                        var popMessage = void 0;
                        if (maskState.type) {
                            var mtype = maskState.type || 'info';
                            maskCss = "mask " + mtype;
                            var lngs = { 'warning': "警告", 'success': "成功", 'error': '错误', "info": "信息" };
                            var icon = void 0;
                            switch (mtype) {
                                case "error":
                                    icon = React.createElement(antd_1.Icon, { type: "close-circle-o" });
                                    break;
                                case "info":
                                    icon = React.createElement(antd_1.Icon, { type: "info-circle-o" });
                                    break;
                                case "success":
                                    icon = React.createElement(antd_1.Icon, { type: "check-circle-o" });
                                    break;
                                case "warning":
                                    icon = React.createElement(antd_1.Icon, { type: "warning" });
                                    break;
                                default: icon = React.createElement(antd_1.Icon, { type: "info-circle-o" });
                            }
                            var cls = "pop-message-box";
                            var onclick_1 = function () {
                                _this.context.store.dispatch({ type: "$mask.hide" });
                            };
                            popMessage = React.createElement("div", { className: cls },
                                React.createElement("div", { className: 'pop-message-header' },
                                    React.createElement("div", { className: 'pop-message-icon' }, icon),
                                    React.createElement("div", { className: 'pop-message-caption' }, maskState.caption || lngs[mtype])),
                                React.createElement("div", { className: 'pop-message-body' },
                                    React.createElement("div", { className: 'pop-message-content', dangerouslySetInnerHTML: { __html: maskState.message } })),
                                React.createElement("div", { className: 'pop-message-footer' },
                                    React.createElement(antd_1.Icon, { type: "close", onClick: onclick_1 })));
                        }
                        else {
                            maskCss = "mask waiting";
                            popMessage = React.createElement("div", { className: 'pop-message' }, maskState.message ? maskState.message : "加载中...");
                        }
                        waiting = React.createElement("div", { className: maskCss, ref: function (node) { return _this.waitingElement = node; }, style: { position: 'absolute' } },
                            React.createElement("div", { className: 'mask-back' }),
                            React.createElement("div", { className: 'mask-front', ref: function (node) { return _this.waitingFrontElement = node; }, style: { position: 'absolute' } }, popMessage));
                    }
                    else {
                        if (this.waiting_timer) {
                            clearInterval(this.waiting_timer);
                            this.waiting_timer = 0;
                        }
                    }
                    if (store.initialize) {
                        var init = this.context.store.initialize;
                        store.initialize = null;
                        var rs = init.call(store, __assign({}, state));
                        if (rs) {
                            if (typeof rs.then === 'function') {
                                rs.then(function (newState) {
                                    store.dispatch({ type: "$module.init", state: newState });
                                }, function (e) {
                                    store.dispatch({ type: "$mask.show", icon: "error", message: e });
                                });
                            }
                            else {
                                state = utils_1.mergeDiff(state, rs);
                            }
                        }
                        else {
                            maskState = this.props.$mask;
                        }
                    }
                    if (maskState && maskState.exclusive) {
                        return React.createElement("div", { className: 'module', ref: function (node) { return _this.modElement = node; }, style: { position: "relative" } }, waiting);
                    }
                    var modalState = state.$modal, main_hidden = false;
                    var modal;
                    if (modalState && modalState.status !== 'close') {
                        var modalType = modalState.modalType;
                        if (modalType === 'dialog') {
                            modal = this.popDialog(modalState);
                        }
                        else if (modalType === 'layer') {
                            main_hidden = true;
                            modal = this.popLayer(modalState);
                        }
                        else {
                            var vp = utils_1.viewport();
                            if (vp === 'xs') {
                                modal = this.popLayer(modalState);
                                main_hidden = true;
                            }
                            else
                                modal = this.popDialog(modalState);
                        }
                        //state.pop['module.']
                    }
                    var componentInstance = React.createElement(Component, __assign({}, state));
                    store.page = this.context.page = componentInstance;
                    return React.createElement("div", { className: 'module', ref: function (node) { return _this.modElement = node; }, style: { position: "relative" } },
                        waiting,
                        React.createElement("div", { className: 'module-component', style: { display: main_hidden ? "none" : '' } }, componentInstance),
                        modal);
                };
                WrapComponent.prototype.popDialog = function (popState) {
                    var _this = this;
                    popState.$inDialog = true;
                    var contentView = React.createElement(Loadable, popState, null);
                    return React.createElement(antd_1.Modal, { title: popState.title, visible: true, onOk: function () {
                            _this.props["$modal.close"]({ status: 'ok' });
                        }, onCancel: function () { return _this.props["$modal.close"]({ status: 'cancel' }); }, confirmLoading: false }, contentView);
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
                                return;
                            }
                        }
                        _this.waitingElement.style.width = _this.modElement.offsetWidth + "px";
                        var x = (_this.waitingElement.offsetWidth - _this.waitingFrontElement.clientWidth) / 2;
                        if (!_this.x || Math.abs(_this.x - x) > 3) {
                            _this.x = x;
                        }
                        var y;
                        if (_this.props.__$is_workarea__) {
                            var h = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
                            y = (h - _this.waitingFrontElement.clientHeight) / 2;
                            y += Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                            if (_this.props.__$is_workarea__ == 'root') {
                                _this.waitingElement.style.height = h + 'px';
                            }
                            else {
                                _this.waitingElement.style.height = _this.modElement.offsetHeight + 'px';
                                var header = document.getElementById("layout-header");
                                if (header)
                                    y -= document.getElementById("layout-header").clientHeight;
                            }
                        }
                        else {
                            _this.waitingElement.style.height = _this.modElement.offsetHeight + 'px';
                            y = (_this.waitingElement.offsetHeight - _this.waitingFrontElement.clientHeight) / 2;
                        }
                        if (!_this.y || Math.abs(_this.y - y) > 3) {
                            _this.y = y;
                        }
                        _this.waitingFrontElement.style.left = _this.x + "px";
                        _this.waitingFrontElement.style.top = _this.y + "px";
                    };
                    this.waiting_timer = setInterval(cover, 100);
                    cover();
                };
                WrapComponent.prototype.componentWillUnmount = function () {
                    if (this.waiting_timer) {
                        clearInterval(this.waiting_timer);
                        this.waiting_timer = 0;
                    }
                    if (this.disposed)
                        return;
                    var store = this.context.store;
                    store.dispatch({ type: '$module.closing' });
                    if (store.super_store)
                        store.super_store.dispatch({ type: '$modal.closing' });
                    this.disposed = true;
                };
                return WrapComponent;
            }(React.Component)),
            _a.contextTypes = { store: PropTypes.object, page: PropTypes.object },
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
