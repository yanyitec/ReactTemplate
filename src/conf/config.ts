export default {
    //url解析规则
    resolves:{
        "^\\{Auth\\}/":"http://localhost:5000/Auth/"
        ,"^\\{Site\\}/":"http://localhost:5000/"
    },

    //预加载模块配置
    preloads:[
        
        //通信
        "axios@lib/axios"
    
        //react & redux
        ,"react@lib/react/react"
        ,"react-dom@lib/react/react-dom"
        ,"prop-types@lib/react/prop-types"
        ,"redux@lib/redux/redux"
        ,"react-redux@lib/redux/react-redux"
    
        // ant.design
        ,"moment@lib/antd/moment"
        ,"antd@lib/antd/antd"

        ,"lib/module"
        ,"lib/ui"
        
        ,"portal/auth"
        ,"portal/menu"
    ],
    //启动模块名/配置,这些配置可能会在启动过程中修改
    entry:'portal/app',
    //登录/界权设置
    auth:{
        url : "{Auth}/Auth"
    },

    
    release_version:"1.0.0",
    //ajax配置
    ajax:{
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Requested-Type': 'json',
            'X-Response-Type':'json'
        },
        url_resolve:'',//always总是，never从不，auto=自动
    }
}