"use strict";
/**
 * Name : Promise/A+
 * Author : yiy
 * Description : Promise 实现 遵循promise/A+规范
 *
 * Promise/A+规范原文:
 *  https://promisesaplus.com/#notes
 *
 * Promise/A+规范译文:
 *  https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/#note-4
 *
 * 参考资料:
 *  https://www.jianshu.com/p/459a856c476f
 */
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
(function (global, factory) {
    eval("typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports,global) :\n\ttypeof define === 'function' && define.amd ? define(['exports'], factory) :\n\t(factory(global.exports = {},global));");
})(this, function (exports, global) {
    if (!global) {
        try {
            global = window;
        }
        catch (ex) {
            global = {};
        }
    }
    var PromiseStates;
    (function (PromiseStates) {
        PromiseStates[PromiseStates["padding"] = 0] = "padding";
        PromiseStates[PromiseStates["fullfilled"] = 1] = "fullfilled";
        PromiseStates[PromiseStates["rejected"] = 2] = "rejected";
    })(PromiseStates || (PromiseStates = {}));
    // 获取异步函数
    // 如果有setImmediate，就用setImmediate
    // 否则，使用 setTimeout
    var _async;
    if (typeof setImmediate === "function")
        _async = setImmediate;
    else
        _async = setTimeout;
    var _noop = function () { };
    //几个重要的过程
    /**
     * Promise的解析过程
     *
     * @param {IPromise} promise
     * @param {IPromiseState} promiseState
     * @param {*} value
     * @param {IPromiseOptions} opts
     * @returns {IPromise}
     */
    function resolvePromise(promise, promiseState, value, opts) {
        // 2.3.2.4.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, 
        //              the first call takes precedence, and any further calls are ignored.
        // 如果已经完成，再次调用resolve就直接返回。不做任何操作
        if (promiseState.__promise_status !== PromiseStates.padding) {
            //console.warn("promise resolved/rejected more than once.",promise,this);
            return promise;
        }
        // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
        // resolve自己会循环引用，直接拒绝
        if (value === promise) {
            return settleValue(promise, promiseState, PromiseStates.rejected, new TypeError('不能resolve自己'), opts);
        }
        //如果要解析的值是 thenable
        if (value && typeof value.then === "function") {
            var called_1 = false;
            var that = value;
            try {
                //thenable检查
                //// 2.3.3.2 If retrieving the property x.then results in a thrown exception e, 
                //   reject promise with e as the reason.
                //let then :any = value.then;
                // 2.3.3.3 If then is a function, call it with x as this,
                //          first argument resolvePromise, and second argument rejectPromise
                that.then(function (thatValue) {
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(promise, promiseState, thatValue, opts);
                }, function (thatReason) {
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(promise, promiseState, thatReason, opts);
                });
                return promise;
            }
            catch (ex) {
                if (called_1)
                    return;
                called_1 = true;
                return settleValue(promise, promiseState, PromiseStates.rejected, ex, opts);
            }
        }
        return settleValue(promise, promiseState, PromiseStates.fullfilled, value, opts);
    }
    function rejectPromise(promise, promiseState, reason) {
        return settleValue(promise, promiseState, PromiseStates.rejected, reason, __assign({}, promiseState.__promise_options, { useApply: false }));
    }
    /**
     * 给promise设定终值
     *
     * @param {IPromise} promise
     * @param {IPromiseState} promiseState
     * @param {PromiseStates} status
     * @param {*} settledValue
     * @param {IPromiseOptions} opts
     * @returns
     */
    function settleValue(promise, promiseState, status, settledValue, opts) {
        // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, 
        //           or multiple calls to the same argument are made, 
        //           the first call takes precedence, and any further calls are ignored.
        if (promiseState.__promise_status !== PromiseStates.padding)
            return promise;
        promiseState.__promise_status = status;
        promiseState.__promise_settled_value = settledValue;
        var executeCallbacks = function () {
            var callbacks = status === PromiseStates.fullfilled
                ? promiseState.__promise_fullfill_callbacks
                : promiseState.__promise_reject_callbacks;
            if (callbacks) {
                var callback = void 0;
                while (callback = callbacks.shift()) {
                    if (opts && opts.useApply) {
                        callback.apply(promise, settledValue);
                    }
                    else
                        callback.call(promise, settledValue);
                }
            }
            promiseState.__promise_fullfill_callbacks = promiseState.__promise_reject_callbacks = null;
        };
        if (opts && opts.callbackSync)
            executeCallbacks();
        else
            _async(executeCallbacks, 0);
        return promise;
    }
    function createThenCallback(orignalCallback, resolveOrReject, useApply) {
        return function (settledValue) {
            var result = (useApply) ? orignalCallback.apply(null, arguments) : orignalCallback.call(null, settledValue);
            resolveOrReject(result);
            return result;
        };
    }
    function makeOpts(opts) {
        if (opts === false)
            opts = { "callbackSync": false };
        else if (opts === true)
            opts = { "callbackSync": true };
        else if (opts === "useApply")
            opts = { "useApply": true };
        else if (opts === "callbackSync")
            opts = { "callbackSync": true };
        return (opts || {});
    }
    /**
     * 核心的Promise类
     * 符合PromiseA+规范
     *
     * @export
     * @class PromiseA
     * @implements {IPromise}
     */
    var PromiseA = /** @class */ (function () {
        function PromiseA(executor, opts) {
            //if(executor===null)return;
            var promise = this;
            promise.__promise_options = makeOpts(opts);
            promise.__promise_status = PromiseStates.padding;
            promise.__promise_fullfill_callbacks = [];
            promise.__promise_reject_callbacks = [];
            //promise.then = makeThen(promise);
            promise.promise = function (target) {
                if (target === this)
                    return this;
                target || (target = {});
                target.then = function (onfullfill, onreject) { return promise.then(onfullfill, onreject); };
                target.done = function (onfullfill) { return promise.then(onfullfill); };
                target.fail = function (onreject) { return promise.then(null, onreject); };
                target.promise = promise.promise;
                return target;
            };
            if (executor) {
                try {
                    executor(function (value) { return resolvePromise(promise, promise, value, promise.__promise_options); }, function (reason) { return rejectPromise(promise, promise, reason); });
                }
                catch (ex) {
                    rejectPromise(promise, promise, ex);
                }
            }
        }
        //then:(onFullfilled:(value:any,param?:any)=>void,onRejected?:(reason:any,param?:any)=>void)=>IThenable;
        PromiseA.prototype.then = function (onFullfilled, onRejected) {
            var promiseState = this;
            var resolve;
            var reject;
            var thenPromise = new PromiseA(function (_resolve, _reject) {
                resolve = _resolve;
                reject = _reject;
            });
            var fullfillCallback = typeof onFullfilled !== 'function' ? null : function (settledValue) {
                var result = (promiseState.__promise_options.useApply) ? onFullfilled.apply(null, arguments) : onFullfilled.call(null, settledValue);
                resolve(result);
                return result;
            };
            if (fullfillCallback) {
                if (promiseState.__promise_fullfill_callbacks) {
                    promiseState.__promise_fullfill_callbacks.push(fullfillCallback);
                }
                else {
                    fullfillCallback(promiseState.__promise_settled_value);
                    return thenPromise;
                }
            }
            var rejectCallback = typeof onRejected !== 'function' ? null : function (settledValue) {
                var result = onRejected.call(null, settledValue);
                reject(settledValue);
                return result;
            };
            if (rejectCallback) {
                if (promiseState.__promise_reject_callbacks) {
                    promiseState.__promise_reject_callbacks.push(fullfillCallback);
                }
                else {
                    rejectCallback(promiseState.__promise_settled_value);
                    return thenPromise;
                }
            }
            return thenPromise;
        };
        PromiseA.prototype.done = function (onFullfilled) {
            if (this.__promise_fullfill_callbacks) {
                this.__promise_fullfill_callbacks.push(onFullfilled);
                return this;
            }
            if (this.__promise_status == PromiseStates.fullfilled) {
                if (this.__promise_options && this.__promise_options.useApply) {
                    onFullfilled.apply(null, this.__promise_settled_value);
                }
                else {
                    onFullfilled.call(null, this.__promise_settled_value);
                }
            }
            return this;
        };
        PromiseA.prototype.fail = function (onRejected) {
            if (this.__promise_reject_callbacks) {
                this.__promise_reject_callbacks.push(onRejected);
                return this;
            }
            onRejected.call(null, this.__promise_settled_value);
            return this;
        };
        /**
         *
         * 返回一个fullfilled状态的promise,其值为参数
         * @static
         * @param {*} value
         * @returns {IPromise}
         * @memberof PromiseA
         */
        PromiseA.resolve = function (value, opts) {
            return new PromiseA(function (fullfill, reject) {
                fullfill(value);
            }, opts);
            //fullfillPromise(promise.__promise_status=PromiseStates.fullfilled,promise.__promise_value=value,promise,sync===true||sync==='sync');
        };
        /**
         * 返回一个rejected状态的promise,其reason为参数值
         *
         * @static
         * @param {*} reason
         * @returns {IPromise}
         * @memberof PromiseA
         */
        PromiseA.reject = function (reason, opts) {
            return new PromiseA(function (fullfill, reject) {
                reject(reason);
            }, opts);
        };
        /**
         * 所有参数的promise都resolve了，promise才resolve
         *
         * 用法1：
         * let tasks = [promise,{},(resolve,reject)=>resolve(1)];
         * PromiseA.all(tasks);
         * 用法2：
         * PromiseA.all(promise,{},(resolve,reject)=>resolve(1));
         * 两种用法效果相同
         *
         * 用法3:
         * let tasks = [promise,{},(resolve,reject)=>resolve(1)];
         * PromiseA.all(tasks,(task,index,value)=>{
         *  //sniffer the mediate result
         * });
         * @static
         * @param {*} [_arg] 1 如果是函数，就当作Promise的executor构建Promise；2 如果是Promise，直接检查状态;3 其他的当作 ResolvedPromise去传递
         * @returns {IPromise}
         * @memberof PromiseA
         */
        PromiseA.all = function (_arg, _opts) {
            var arg = [];
            var opts;
            var sniffer;
            if (arguments.length >= 1 && typeof _arg === "object" && _arg.length !== undefined) {
                arg = _arg;
                sniffer = typeof _opts === 'function' ? _opts : null;
                opts = sniffer ? undefined : _opts;
            }
            else {
                arg = Array.prototype.slice.call(arguments);
                opts = "useApply";
            }
            if (arg.length == 0)
                return PromiseA.resolve([], opts);
            if (!sniffer && opts)
                sniffer = opts.sniffer;
            return new PromiseA(function (resolve, reject) {
                var results = [];
                var taskcount = arg.length;
                function done(value, i) {
                    //if(i!==undefined)
                    results[i] = value;
                    taskcount -= 1;
                    if (sniffer)
                        sniffer(arg[i], i, value);
                    if (taskcount === 0)
                        resolve(results);
                }
                for (var i = 0, j = arg.length; i < j; i++)
                    (function (item, i) {
                        var t = typeof item;
                        var p;
                        if (t === "function") {
                            p = new PromiseA(item);
                        }
                        else if (item && item.then && typeof item.then === 'function') {
                            p = item;
                        }
                        else {
                            p = PromiseA.resolve(item);
                        }
                        p.then(function (value) { return done(value, i); }, reject);
                    })(arg[i], i);
                // done(undefined,undefined);
            }, opts);
        };
        /**
         * 只要其中一个resolve了，整个promise就resolve
         * 参数用法参见 all
         *
         * @static
         * @param {*} [_arg]
         * @returns {IPromise}
         * @memberof PromiseA
         */
        PromiseA.race = function (_arg, _opts) {
            var arg = [];
            var opts;
            if (arguments.length >= 1 && typeof _arg === "object" && _arg.length !== undefined) {
                opts = _opts;
            }
            else {
                arg = Array.prototype.slice.call(arguments);
                opts = "useApply";
            }
            if (arg.length == 0)
                return PromiseA.resolve([], opts);
            return new PromiseA(function (resolve, reject) {
                for (var i = 0, j = arg.length; i < j; i++)
                    (function (item, i) {
                        var t = typeof item;
                        var p;
                        if (t === "function") {
                            p = new PromiseA(item);
                        }
                        else if (item && item.then && typeof item.then === 'function') {
                            p = item;
                        }
                        else {
                            p = PromiseA.resolve(item);
                        }
                        p.then(resolve, reject);
                    })(arg[i], i);
            }, opts);
        };
        PromiseA.defer = function (opts) {
            return new Deferred(opts);
        };
        PromiseA.Promise = PromiseA;
        return PromiseA;
    }());
    /**
     * 延迟对象
     * 基于Promise实现Deferred的
     * Deferred和Promise的关系
     * - Deferred 拥有 Promise
     * - Deferred 具备对 Promise的状态进行操作的特权方法（resolve reject）
     *
     * 参考jQuery.Deferred
     * url: http://api.jquery.com/category/deferred-object/
     *
     * @export
     * @class Deferred
     * @extends {PromiseA}
     * @implements {IDeferred}
     */
    var Deferred = /** @class */ (function (_super) {
        __extends(Deferred, _super);
        function Deferred(opts) {
            var _this = this;
            var defferredResolve;
            var defferredReject;
            _this = _super.call(this, function (resolve, reject) {
                defferredResolve = _this.resolve = resolve;
                defferredReject = _this.reject = reject;
            }, opts) || this;
            return _this;
        }
        Deferred.prototype.fullfillable = function (target) {
            if (target === this)
                return this;
            target || (target = {});
            target.resolve = this.resolve;
            target.reject = this.reject;
            target.fullfillable = this.fullfillable;
            return this;
        };
        Deferred.prototype.deferred = function (target) {
            var _this = this;
            if (target === this)
                return this;
            if (target instanceof Deferred)
                target || (target = {});
            target.deferred = this.deferred;
            target.resolve = this.resolve;
            target.reject = this.reject;
            target.fullfillable = this.fullfillable;
            target.then = function (onfullfill, onreject) { _this.then(onfullfill, onreject); return target; };
            target.done = function (onfullfill) { _this.done(onfullfill); return target; };
            target.fail = function (onreject) { _this.then(null, onreject); return target; };
            target.promise = this.promise;
            return target;
        };
        return Deferred;
    }(PromiseA));
    PromiseA.Deferred = Deferred;
    var Observable = /** @class */ (function () {
        function Observable() {
            var _this = this;
            this.subscribe = function (nameOrObserver, observer) {
                var t = typeof nameOrObserver;
                var name;
                if (t === 'string' || nameOrObserver === null) {
                    name = nameOrObserver || '';
                }
                else if (t === 'function') {
                    name = '';
                }
                else
                    throw new Error("observer must be a function");
                var events = _this.__observable_events || (_this.__observable_events = {});
                var observers = events[name] || (events[name] = []);
                observers.push(observer);
                if (!name)
                    _this.__observable_observers = observers;
                return _this;
            };
            this.unsubscribe = function (nameOrObserver, observer) {
                var t = typeof nameOrObserver;
                var name;
                if (t === 'string' || nameOrObserver === null) {
                    name = nameOrObserver || '';
                }
                else if (t === 'function') {
                    name = '';
                }
                else
                    throw new Error("observer must be a function");
                var events = _this.__observable_events;
                if (events) {
                    var observers = events[name];
                    if (observers) {
                        for (var i = 0, j = observers.length; i < j; i++) {
                            var existed = observers.shift();
                            if (existed !== observer)
                                observers.push(existed);
                        }
                    }
                }
                return _this;
            };
            this.notify = function (name, evt) {
                var observers;
                if (!name)
                    observers = _this.__observable_observers;
                else if (_this.__observable_events) {
                    observers = _this.__observable_events[name];
                }
                if (!observers)
                    return _this;
                for (var i = 0, j = observers.length; i < j; i++) {
                    var existed = observers.shift();
                    var result = existed.call(_this, evt);
                    if (result === false)
                        break;
                    if (result === null)
                        continue;
                    observers.push(existed);
                }
                return _this;
            };
        }
        return Observable;
    }());
    exports.PromiseA = exports.Promise = global.PromiseA = global.Promise = PromiseA;
    //if(!global.Promise) global.Promise = PromiseA;
    exports.Deferred = global.Deferred = Deferred;
    return exports["default"] = PromiseA.Promise = PromiseA.PromiseA = PromiseA;
});
