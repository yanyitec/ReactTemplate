declare var require:any;
declare var Promise:Function;
let bootMsg = document.getElementById("bootMessage");
let showMessage = (message:string,color?:any)=>{
    if(!message) return;
    message += taskcount? ' ===> ' + parseInt((((donecount)*100)/taskcount).toString()).toString()+'% : ':'';
    color || (color='#999');
    bootMsg.innerHTML =`<li style="color:${color}">${message}</li>` + bootMsg.innerHTML;
}
let showError = (msg:string)=>{
    bootMsg.innerHTML +=`<li style="color:red">${msg}</li>` + bootMsg.innerHTML;
}

let sniffer = function(mod,index,value){
    donecount++;
    showMessage(mod.require_key);
}

let booter ={
    showMessage:showMessage,
    increaseTask:(count)=>taskcount+=count===undefined?1:count,
    decreaseTask:(count)=>taskcount-=count===undefined?1:count
};


let taskcount = 0;
let donecount=0;
let config:any;
showMessage('加载主配置...');
require(['config@conf/config'],sniffer).then((_config)=>{
    //taskcount+=1;
    config = _config[0];
    taskcount+=2;
    if(config.preloads) taskcount += config.preloads.length;
    return require.config(config = _config[0],{
        sniffer:sniffer,
        loadingSubConfig:(subs)=>{
            taskcount+= subs.length;
            showMessage('加载从配置...');
        }
    });
},showError)
//加载预加载项与入口模块
.then((_config)=>{
    config = _config;
    let entry = config.entry;
    if(!entry){
        showError("配置错误，请联系管理员。(未定义入口{entry:any})");
        throw new Error('配置中没有entry,该字段定义入口模块');
    }
    let entryName = entry.module || entry.url || entry;
    if(typeof entryName !=='string'){
        showError("配置错误，请联系管理员。(未能找到入口模块名{entry:any})");
        throw new Error('entryName = entry.module || entry.url || entry ，都不是字符串，无法加载entry模块');
    }
    let preloads = config.preloads;
    if(preloads===undefined) preloads= [entryName];
    else preloads.push(entryName);
    return require(preloads,sniffer);
},showError)
//启动入口模块
.then((preload_mods)=>{
    let App = preload_mods[preload_mods.length-1];
    if(!App.$mount){
        showError("启动模块错误，请联系管理员。(启动模块没有$mount函数)");
        throw new Error('启动模块必须具备$mount函数');
    }
    let appElement = document.getElementById("app");
    appElement.innerHTML="";
    let appProps = config.entry;
    if(typeof appProps!=='object'){
        appProps = {module:appProps};
    }
    appProps.boot = booter;
    let appPromise = App.$mount(appProps,appElement);
    if(!appPromise || typeof appPromise.then !=='function'){
        return (Promise as any).resolve(appPromise,"callbackSync");
    }else {
        return appPromise;
    }
},showError)
//就绪
.then((app)=>{
    document.getElementById("app").style.visibility="visible";
    document.body.removeChild(document.getElementById("boot"));
},showError);

