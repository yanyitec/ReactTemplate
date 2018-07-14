export default {
    //启动模块名/配置,这些配置可能会在启动过程中修改
    entry:{
        module:'app',
        auth:{
            visible:true
        },
        menu:{
          data:[],
          collapsed:false
        },
       
        workarea:{
          pages:[]
        },
        user:{},
        dialog:{width:100}
    },
    //登录/界权设置
    auth:{
        url : "api/auth"
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

        ,"lib/ui"
        ,"lib/auth"
    ],
    //ajax配置
    ajax:{}
}