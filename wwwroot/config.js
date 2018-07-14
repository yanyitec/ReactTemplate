define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        //预加载模块配置
        preloads: [
            //全局对象/window 单例检测用
            "global"
            //通信
            ,
            "axios@lib/axios"
            //react & redux
            ,
            "react@lib/react/react",
            "react-dom@lib/react/react-dom",
            "prop-types@lib/react/prop-types",
            "redux@lib/redux/redux",
            "react-redux@lib/redux/react-redux"
            // ant.design
            ,
            "moment@lib/antd/moment",
            "antd@lib/antd/antd"
            //主应用
            ,
            "app"
        ]
    };
});
