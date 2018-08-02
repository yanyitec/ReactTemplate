define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    //import {objectAccessor} from 'lib/utils';
    exports.Validators = {
        required: function (text, rule) {
            rule = rule || {};
            if (!text)
                return rule.message || "必填";
            var tp = typeof (text);
            if (tp === 'string') {
                text = text.replace(/(^\s+)|(\s+$)/g, '');
                if (!text)
                    return rule.message || "必填";
                else
                    return true;
            }
            if (tp === 'object') {
                if (Object.prototype.toString.call(text) == "[object Array]") {
                    if (text.length == 0)
                        return rule.message || "必填";
                    else
                        return true;
                }
                var hasOne = false;
                for (var n in text) {
                    hasOne = true;
                    break;
                }
                if (hasOne)
                    return true;
                return rule.message || "必填";
            }
        },
        length: function (text, rule) {
            rule = rule || {};
            var min = rule.min || 0;
            var max = rule.max;
            if (text)
                text = text.replace(/(^\s+)|(\s+$)/g, "");
            if (text.length < min)
                return rule.message;
            if (max && text.length > max)
                return rule.message;
            return true;
        },
        regex: function (text, rule) {
            rule = rule || {};
            var reg = rule.$RegExp;
            if (!reg)
                reg = rule.$RegExp = new RegExp(rule.reg);
            if (reg.test(text))
                return true;
            return rule.message || "格式不正确";
        }
    };
    function validation(obj) {
        var validate = function (field, text) {
            if (typeof field === 'object') {
                var validStates = {};
                for (var n in obj) {
                    validStates[n] = validate(n, field[n]);
                }
                return validStates;
            }
            var rules = obj[field];
            if (!rules)
                return null;
            var rs = true;
            for (var n in rules) {
                var rule = rules[n];
                var type = rule.type || n;
                var validator = exports.Validators[type];
                if (validator) {
                    rs = validator(text, rule);
                    if (rs !== true) {
                        break;
                    }
                }
            }
            return rs;
            //return objectAccessor(validStates).setValue({},rs);
        };
        return validate;
    }
    exports.validation = validation;
});
