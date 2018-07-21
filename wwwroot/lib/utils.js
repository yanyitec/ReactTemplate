define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var utils = {};
    function deepClone(src) {
        if (!src)
            return src;
        var dest;
        if (Object.prototype.toString.call(src) === "[object Array]")
            dest = [];
        else
            dest = {};
        for (var n in src) {
            var value = src[n];
            if (typeof value === 'object') {
                dest[n] = deepClone(value);
            }
            else
                dest[n] = value;
        }
        return dest;
    }
    exports.deepClone = deepClone;
    utils.deepClone = deepClone;
    //合并model
    function mergeDiff(dest, src, prop) {
        if (prop === undefined) {
            if (dest === src || src === undefined)
                return dest;
            if (dest === undefined || dest === null || src === null)
                return src;
            if (src && src.__REPLACEALL__) {
                src.__REPLACEALL__ = undefined;
                return src;
            }
            var destT = typeof dest;
            var srcT = typeof src;
            var ds = void 0, isArr = false;
            if (destT === 'object') {
                //console.log(Object.prototype.toString.call(dest),dest);
                if (Object.prototype.toString.call(dest) === '[object Array]') {
                    //console.log("isArray");
                    isArr = true;
                    ds = [];
                }
                else {
                    isArr = false;
                }
            }
            else {
                dest = {};
            }
            if (!isArr) {
                if (Object.prototype.toString.call(src) === '[object Array]') {
                    ds = [];
                    isArr;
                }
                else if (!ds) {
                    ds = {};
                    if (srcT !== 'object')
                        src = {};
                }
            }
            for (var dn in dest) {
                ds[dn] = mergeDiff(dest, src, dn);
            }
            for (var sn in src) {
                if (ds[sn] === undefined)
                    ds[sn] = mergeDiff(dest, src, sn);
            }
            return ds;
        }
        var srcValue = src[prop];
        var destValue = dest[prop];
        if (srcValue === undefined || srcValue === destValue)
            return destValue;
        if (destValue === undefined || srcValue === null || srcValue instanceof RegExp)
            return srcValue;
        if (srcValue && srcValue.__REPLACEALL__) {
            srcValue.__REPLACEALL__ = undefined;
            return srcValue;
        }
        var srcValueType = typeof srcValue;
        if (srcValueType === 'number' || srcValueType === "string" || srcValueType === "boolean")
            return srcValue;
        //是对象，且不相同
        return mergeDiff(destValue, srcValue);
    }
    exports.mergeDiff = mergeDiff;
    utils.mergeDiff = mergeDiff;
    //事件
    var div = document.createElement("div");
    var _attach;
    var _detech;
    if (div.attachEvent) {
        _attach = function (elem, evt, handler) { return elem.attachEvent('on' + evt, handler); };
        _detech = function (elem, evt, handler) { return elem.detechEvent('on' + evt, handler); };
    }
    else {
        _attach = function (elem, evt, handler) { return elem.addEventListener(evt, handler, false); };
        _detech = function (elem, evt, handler) { return elem.removeEventListener(evt, handler, false); };
    }
    exports.attach = utils.attach = _attach;
    exports.detech = utils.detech = _detech;
    exports.getCookie = utils.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    };
    exports.setCookie = utils.setCookie = function (name, value, time) {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = exports.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    exports.delCookie = delCookie;
    utils.delCookie = delCookie;
    function getsec(str) {
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        if (str2 == "s")
            return str1 * 1000;
        else if (str2 == "h")
            return str1 * 60 * 60 * 1000;
        else if (str2 == "d")
            return str1 * 24 * 60 * 60 * 1000;
    }
    //获取盒模型
    exports.getBox = utils.getBox = function (elem) {
        if (!elem) {
            var w_1 = window.innerWidth || document.documentElement.clientWidth;
            var h_1 = window.innerHeight || document.documentElement.clientHeight;
            return { x: 0, y: 0, width: w_1, height: h_1 };
        }
        var x = 0, y = 0;
        var w = elem.clientWidth, h = elem.clientHeight;
        while (elem) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            if (elem === document.body)
                break;
            elem = elem.offsetParent;
        }
        return { x: x, y: y, width: w, height: h };
    };
    //媒体查询
    var viewportChangeHandlers = [];
    var viewports = {
        "lg": 1200,
        "md": 992,
        "sm": 768
    };
    exports.viewport = utils.viewport = function (onChange) {
        if (onChange && typeof onChange === 'function') {
            viewportChangeHandlers.push(onChange);
        }
        if (onChange === true)
            return view_port;
        return view_port.name;
    };
    var view_port;
    var viewportResizeHandler = function () {
        var w = window.innerWidth || document.documentElement.clientWidth;
        var h = Math.max(document.body.clientHeight, Math.max(window.innerHeight, document.documentElement.clientHeight));
        //console.log("rsz",window.innerHeight,document.documentElement.clientHeight,document.body.clientHeight,h);
        var vt;
        for (var t in viewports) {
            if (w >= viewports[t]) {
                vt = t;
                break;
            }
        }
        vt = { w: w, h: h, name: vt || 'xs' };
        if (!view_port || view_port.name != vt.name) {
            view_port = vt;
            for (var i = 0, j = viewportChangeHandlers.length; i < j; i++) {
                var handler = viewportChangeHandlers.shift();
                var rs = handler.call(window, vt);
                if (rs !== '#remove')
                    viewportChangeHandlers.push(handler);
            }
        }
        else
            view_port = vt;
    };
    exports.attach(window, 'resize', viewportResizeHandler);
    viewportResizeHandler();
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (strx) {
            return this.indexOf(strx) == 0;
        };
    }
    exports["default"] = utils;
});
