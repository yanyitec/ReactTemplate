"use strict";
var bootMsg = document.getElementById("bootMessage");
var showMessage = function (message, color) {
    if (!message)
        return;
    message += taskcount ? ' ===> ' + parseInt((((donecount) * 100) / taskcount).toString()).toString() + '% : ' : '';
    color || (color = '#999');
    bootMsg.innerHTML = "<li style=\"color:" + color + "\">" + message + "</li>" + bootMsg.innerHTML;
};
var showError = function (msg) {
    bootMsg.innerHTML += "<li style=\"color:red\">" + msg + "</li>" + bootMsg.innerHTML;
};
var sniffer = function (mod, index, value) {
    donecount++;
    showMessage(mod.require_key);
};
var booter = {
    showMessage: showMessage,
    increaseTask: function (count) { return taskcount += count === undefined ? 1 : count; },
    decreaseTask: function (count) { return taskcount -= count === undefined ? 1 : count; }
};
var taskcount = 0;
var donecount = 0;
var config;
showMessage('加载主配置...');
require(['config@conf/config'], sniffer).then(function (_config) {
    //taskcount+=1;
    config = _config[0];
    taskcount += 2;
    if (config.preloads)
        taskcount += config.preloads.length;
    return require.config(config = _config[0], {
        sniffer: sniffer,
        loadingSubConfig: function (subs) {
            taskcount += subs.length;
            showMessage('加载从配置...');
        }
    });
}, showError)
    //加载预加载项与入口模块
    .then(function (_config) {
    config = _config;
    var entry = config.entry;
    if (!entry) {
        showError("配置错误，请联系管理员。(未定义入口{entry:any})");
        throw new Error('配置中没有entry,该字段定义入口模块');
    }
    var entryName = entry.module || entry.url || entry;
    if (typeof entryName !== 'string') {
        showError("配置错误，请联系管理员。(未能找到入口模块名{entry:any})");
        throw new Error('entryName = entry.module || entry.url || entry ，都不是字符串，无法加载entry模块');
    }
    var preloads = config.preloads;
    if (preloads === undefined)
        preloads = [entryName];
    else
        preloads.push(entryName);
    return require(preloads, sniffer);
}, showError)
    //启动入口模块
    .then(function (preload_mods) {
    var App = preload_mods[preload_mods.length - 1];
    if (!App.$mount) {
        showError("启动模块错误，请联系管理员。(启动模块没有$mount函数)");
        throw new Error('启动模块必须具备$mount函数');
    }
    var appElement = document.getElementById("app");
    appElement.innerHTML = "";
    var appProps = config.entry;
    if (typeof appProps !== 'object') {
        appProps = { module: appProps };
    }
    appProps.boot = booter;
    var appPromise = App.$mount(appProps, appElement);
    if (!appPromise || typeof appPromise.then !== 'function') {
        return Promise.resolve(appPromise, "callbackSync");
    }
    else {
        return appPromise;
    }
}, showError)
    //就绪
    .then(function (app) {
    document.getElementById("app").style.visibility = "visible";
    document.body.removeChild(document.getElementById("boot"));
}, showError);
