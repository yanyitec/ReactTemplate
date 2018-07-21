define(["require", "exports", "lib/axios", "lib/utils"], function (require, exports, axios, utils_1) {
    "use strict";
    exports.__esModule = true;
    var ajaxDefaultOpts;
    function ajax(url, opts) {
        opts = utils_1.mergeDiff(ajaxDefaultOpts, opts);
        var url_resolve = opts.url_resolve;
        var urls;
        switch (url_resolve) {
            case "always":
                urls = require.resolveUrl(url);
                break;
            case "never":
                urls = [url];
                break;
            default:
                if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0)
                    urls = [url];
                else
                    urls = require.resolveUrl(url);
        }
        var deferred = new Deferred();
        doAjax(urls, deferred, 0, opts);
        return deferred.promise();
    }
    exports.ajax = ajax;
    function doAjax(urls, deferred, index, opts) {
        if (index >= urls.length) {
            console.error("urls is cannot connected", urls);
            deferred.reject({ message: "所有的连接都无法访问", urls: urls });
            return;
        }
        var url = urls[index];
        opts.url = url;
        axios(opts).then(function (value) {
            deferred.resolve(value);
        }, function (e) {
            console.warn("ajax error:", e);
            doAjax(urls, deferred, index + 1, opts);
        });
    }
    exports.getJson = function (url, data, opts) {
        url = makeUrl(url, data);
        opts = utils_1.mergeDiff(opts, {
            method: 'get',
            headers: {
                'X-Requested-Type': 'urlencoding',
                'X-Response-Type': 'json'
            },
            transformResponse: [handleJsonResponse]
        });
        return ajax(url, opts);
    };
    exports.postJson = function (url, data, opts) {
        url = makeUrl(url, data);
        opts = utils_1.mergeDiff(opts, {
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'X-Requested-Type': 'urlencoding',
                'X-Response-Type': 'json'
            },
            transformResponse: [handleJsonResponse]
        });
        return ajax(url, opts);
    };
    function makeUrl(url, data) {
        var query = '';
        if (data) {
            if (typeof data == 'string')
                query = data;
            else {
                for (var n in data) {
                    if (query)
                        query += '&';
                    query += encodeURIComponent(n) + '=' + encodeURIComponent(data[n]);
                }
            }
        }
        if (query) {
            if (url.indexOf('?') < 0)
                url += '?';
            else
                url += '&';
            url += query;
        }
        return url;
    }
    function handleJsonResponse(response) {
        if (response.status === '401') {
            appStore.dispach({ type: 'user.signin' });
            throw response;
        }
        return response.data;
    }
    var appStore;
    function ajaxable(target, store, defaultOpts) {
        target.ajax = ajax;
        target.getJson = exports.getJson;
        target.postJson = exports.postJson;
        ajaxDefaultOpts = defaultOpts;
        appStore = store;
    }
    exports["default"] = ajaxable;
});
