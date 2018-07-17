define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var utils = {};
    function cloneObject(src) {
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
                dest[n] = cloneObject(value);
            }
            else
                dest[n] = value;
        }
        return dest;
    }
    exports.cloneObject = cloneObject;
    utils.cloneObject = cloneObject;
    //合并model
    function mergeDiff(dest, src, prop) {
        if (prop === undefined) {
            if (dest === src)
                return dest;
            var destT = typeof dest;
            var srcT = typeof src;
            var ds = void 0, isArr = false;
            if (destT === 'object') {
                if (Object.prototype.toString.call(dest) === '[object Array]') {
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
        if (srcValue === null || srcValue instanceof RegExp)
            return srcValue;
        var srcValueType = typeof srcValue;
        if (srcValueType === 'number' || srcValueType === "string" || srcValueType === "boolean")
            return srcValue;
        //是对象，且不相同
        return mergeDiff(destValue, srcValue);
    }
    exports.mergeDiff = mergeDiff;
    utils.mergeDiff = mergeDiff;
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (strx) {
            return this.indexOf(strx) == 0;
        };
    }
    exports["default"] = utils;
});
