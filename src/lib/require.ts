/**
 * Name : RequireJS
 * Author : yiy
 * Description : umd 的一个实现
 * 
 * 
 */
//import {IDeferred,IPromise} from 'promise';
 //declare class Promise{
 //   constructor(executor:Function,sync?:boolean|string);
 //};
declare var Promise:Function;
//declare var IPromise;
/**
 * require的配置
 *
 * @export
 * @interface IRequireConfig
 */
interface IRequireConfig{
    resolves?:{[name:string]:string|string[]};
    bas:string;
    release_version?:string;
    
}

interface IResolveRule{
    name:string;
    regex:RegExp;
    replacements:string[];
}
interface IResolvedUrl{
    rule:IResolveRule;
    urls:string[];
}


/**
 * 一个require 等同用模块管理器
 *
 * @export
 * @interface IRequire
 */
interface IRequire{
    (modname:string|string[],...modnames:string[]):IPromise;

    resolveUrl(url:string):string[];
    /**
     * 配置该模块
     *
     * @param {IRequireConfig} config
     * @returns {IRequire}
     * @memberof IRequire
     */
    config(config?:IRequireConfig):IRequireConfig;
    
    
    
    /**
     * 查找模块
     *
     * @param {string} key
     * @returns {Module}
     * @memberof IRequire
     */
    each(filter:(mod:IModule)=>boolean):IRequire;

    find(fullname:string,mergeNames?:boolean):IModule|IModuleNames;


    /**
     * 根据key总是获取一个模块
     * 如果没有，就在当前模块创建一个
     *
     * @param {string} key
     * @returns {Module}
     * @memberof IRequire
     */
    ensure(key:string):IModule;

    
    
    /**
     * 发布版本号
     * 用来接在 url的后面，避免浏览器cache
     * 如果该值为 '#dev'
     * 则总是当前时间
     * @type {string}
     * @memberof IRequire
     */
    release_version:string;

    define:Function;

    $resolvedUrls:{[key:string]:IResolvedUrl};
    $resolveRules:{[key:string]:IResolveRule};
    $modules:IModule[];
    $bas_url:string;

}


enum ModuleStates{
    init,
    loading,
    loaded,
    completed,
    error
}
interface IModule extends IPromise{
    /**
         * 模块状态
         *
         * @type {ModuleStates}
         * @memberof Module
         */
        status:ModuleStates;
    
        /**
         * 当加载完成后
         *
         * @type {IRes}
         * @memberof Module
         */
        res:IRes;
        aliveUrl:string;
        key:string;
        /**
         * 模块名
         *
         * @type {string}
         * @memberof Module
         */
        aliases:string[];
        urls:string[];
        checkAlias(alias:string):boolean;
        load():IModule;
}
interface IModuleNames{
    key:string;
        shortName:string;
        name:string;
        prefix:string;
        aliases:string[];
        urls:string[];
}
interface IDefineContext{
    module?:IModule;
    exports?:any;
    onReady?:Function;
    modname?:string;
    deps?:string[];
}




interface IRes{
    url?:string,
    elementFactory?:(url:string)=>HTMLElement;
    element?:HTMLElement;
    
    [key:string]:any;
}

(function(global,factory){
    eval(`typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports,global) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory(global.exports = {},global));`);
})(this,(exports,global):IRequire=>{
    if(!global){  try{global = window;}catch(ex){global={}}}

    let requirejs:IRequire = function(modname:string|string[],_opts:IPromiseOptions|string|boolean|Function,...modnames:string[]):IPromise{
        const mod_m :IRequire = requirejs as IRequire;
        let useApply:boolean = false;
        let opts :any;
        if(typeof modname==="string"){ if(_opts)modnames.unshift(_opts as string);modnames.unshift(modname); useApply=true;}
        else{
            modnames = modname as string[];
            opts = _opts ;
        } 
        let mods : IModule[]=[];
        for(let i =0,j=modnames.length;i<j;i++){
            let modname = modnames[i];
            if(!modname){
                console.warn("空的模块名,跳过",arguments);
            }
            let mod :IModule;
            if(modname==="require") mod=requireModule;
            if(modname==="define") mod=defineModule;
            else if(modname==="exports") mod = new Module("",define_context?define_context.exports:"#undefined");
            else if(modname==="global") mod = new Module("",global);
            else mod = mod_m.ensure(modname);
            (mod as any).require_key = modname;
            mods.push(mod);
        }
 
        return (Promise as any).all(mods,opts || {useApply:useApply,callbackSync:false});
    } as IRequire;
    
    let modules = requirejs.$modules = [];

    let each : (func:(mod:Module)=>boolean)=>IRequire = requirejs.each = (func:(mod:Module)=>boolean):IRequire=>{
        for(let i =0,j=modules.length;i<j;i++){
            if(func(modules[i])===false) return requirejs;
        }
        return requirejs;
    }
    
    let find: (name:string,nameIfNotfound?:boolean)=>Module|ModuleNames = requirejs.find = (name:string,nameIfNotfound?:boolean):Module|ModuleNames =>{
        let module :Module;
        let mnames = new ModuleNames(name,(alias,type,names):boolean=>{
            each((mod)=>{
                if(mod.checkAlias(alias)){
                    module = mod;
                    return false;
                }
            });
            if(module) return false;
        });
        return module?module:(nameIfNotfound?mnames:null);
        
    }
    requirejs.ensure = (fullname:string):Module=>{
        
        let moduleOrName :Module|ModuleNames= find(fullname,true);
        if(moduleOrName instanceof Module) return moduleOrName as Module;
        let mod :Module = new Module(moduleOrName);
        modules[(moduleOrName as ModuleNames).key] = mod;
        modules.push(mod);
        mod.load();
        return mod;
    }

    
    let resolvedUrls : {[index:string]:IResolvedUrl}=requirejs.$resolvedUrls = {};
    let resolveRules :{[index:string]:IResolveRule} = requirejs.$resolveRules ={};
    let resolveUrl = requirejs.resolveUrl =(url:string,returnRule?:boolean):string[]=>{
        if(is_url(url)) return [url];
        let query:string;
        let at = url.indexOf('?');
        if(at>=0) {
            query = url.substr(at);
            url =url.substr(0,at-1);
        }
        let resolved:IResolvedUrl = resolvedUrls[url];
        if(!resolved){
            let matchedRule:IResolveRule;
            for(let k in resolveRules){
                let rule = resolveRules[k];
                if(rule.regex.test(url)) matchedRule = rule;
            }
            if(matchedRule){

                let urls = [];
                for(let m=0,n=matchedRule.replacements.length;m<n;m++){
                    let replacement = matchedRule.replacements[m];
                    let resolvedUrl = url.replace(matchedRule.regex,replacement);
                    if(!is_url(resolvedUrl)) resolvedUrl = bas_url + resolvedUrl;
                    urls.push(resolvedUrl);
                }
                resolved = resolvedUrls[url] = {rule:matchedRule,urls:urls};
            }else {
                resolved = resolvedUrls[url] = {rule:null,urls:[bas_url + url]};
            }
        }
        let result = [];
        for(let i =0,j=resolved.urls.length;i<j;i++){
            let finalUrl = resolved.urls[i];
            if(query) finalUrl += query;
            result.push(finalUrl);
        }
        return result;
    }
    function config_resolves(resolves:{[index:string]:string|string[]}){
        if(resolves['<APPEND>']==='</APPEND>'){
            resolvedUrls = {};
            resolveRules  ={}; 
        }
        for(let  n in resolves){
            let existed = resolveRules[n];
            if(!existed) existed =resolveRules[n] = {name:n,regex:new RegExp(n),replacements:[]};
            let urls = resolves[n];
            if(typeof urls==='string') urls = [urls];
            else if(!urls || !urls.push) throw new Error("resolves 's value must be string or string[]");
            for(let i =0,j=urls.length;i<j;i++){
                let url = urls[i];
                if(!array_exists(existed.replacements,url)) existed.replacements.push(url);
            }
        }
    }
    requirejs.config = (cfg:IRequireConfig):IRequireConfig=>{
        if(cfg.resolves) config_resolves(cfg.resolves);
        if(cfg.bas) {
            requirejs.$bas_url = cfg.bas;
            if(requirejs.$bas_url[requirejs.$bas_url.length-1]!='/') requirejs.$bas_url += '/';
        }
        if(cfg.release_version){
            requirejs.release_version = cfg.release_version;
        }
    
        return cfg;
    }
    let bas_url:string;
    let boot_url:string;
    try{
        let paths = location.pathname.split("/");
        paths.shift();
        paths.pop();
        let scripts = document.getElementsByTagName("script");
        for(let i =0,j= scripts.length;i<j;i++){
            let script = scripts[i];
            let requireBoot = trim(script.getAttribute("require-boot"));
            if(!requireBoot) continue;
            boot_url = requireBoot;break;
            /*
            if( is_url(requireBoot)){
                let ps = requireBoot.split('/');
                ps.pop();
                bas_url = ps.join('/') + '/';
                boot_url = requireBoot;
            }
            if(requireBoot[0]==='/' ){
                let ps = requireBoot.split('/');
                let filename = ps.pop();
                bas_url = location.protocol + "//" + location.hostname + ":" + location.port + ps.join('/') + '/';
                boot_url = bas_url + filename;
            }else {
                let ps = requireBoot.split('/');
                let filename = ps.pop();
                for(let m=0,n=ps.length;m<n;m++){
                    let pn = ps[i];
                    if(pn=='..') paths.pop();
                    else paths.push(pn);
                    
                }
                bas_url =  location.protocol + "//" + location.hostname + ":" + location.port +'/' + paths.join('/'); 
                if(bas_url[bas_url.length-1]!='/') bas_url += '/';
                boot_url = bas_url + filename;   
            }*/
        }
        
        if(!bas_url){
            let path = paths.join("/");
            bas_url =  location.protocol + "//" + location.hostname + ":" + location.port + path;
            if(bas_url[bas_url.length-1]!='/') bas_url += "/";
        }
        requirejs.$bas_url = bas_url;
        
        
    }catch(ex){
        console.trace("gen bas_url failed",ex);
        requirejs.$bas_url = '';
    }
    
    if(boot_url){
        setTimeout(()=>requirejs([boot_url]),0);
    }
    
    
    
    
    class ModuleNames implements IModuleNames{
        key:string;
        shortName:string;
        name:string;
        prefix:string;
        aliases:string[];
        urls:string[];
        constructor(key:string,onNameParsed?:(name:string,type:string,names:ModuleNames)=>boolean){
            if(!key) throw new Error('模块名必须是非空字符串');
            this.key = (key=trim(key));
            if(onNameParsed && onNameParsed(this.key,"keys",this)===false) return;
            let aliases :string[] = this.aliases = [key];
            //let urls:string[] = this.urls = [];
            
            let at = key.indexOf("@");
            let name:string;
            if(at>=0){
                let shortName = this.shortName = key.substr(0,at);
                if(onNameParsed && onNameParsed(shortName,"shortNames",this)===false) return;
                aliases.push(shortName);
                name = key.substr(at+1);
                //if(onNameParsed && onNameParsed(name,"names",this)===false) return;
            }else {
                name = key; 
            }
            
            let ext = extname(name);
            if(!ext){
                if(name!=key){
                    if(onNameParsed && onNameParsed(name,"names",this)===false) return;
                    aliases.push(name);
                }
                this.name = name;
                name += ".js";
            }
            let urls :string[];
            if(is_url(name)){
                urls = [name];
            }else {
                if(onNameParsed && onNameParsed(name,"names",this)===false) return;
                aliases.push(name);
                this.name = name;
                urls =  resolveUrl(name);
            }
            this.urls = urls;
            for(let i in urls){
                let url = urls[i];
                if(onNameParsed && onNameParsed(url,"urls",this)===false) return;
                aliases.push(url);
            }
            
            
            
        }
    }
    
    class Module implements IModule{
        value:any;
        
    
        /**
         *正准备尝试加载的urls
         * 会动态的改变
         *
         * @private
         * @type {string[]}
         * @memberof Module
         */
        private _loading_urls:string[];
        private _deferred:IDeferred;
    
        require :IRequire;
        /**
         * 模块状态
         *
         * @type {ModuleStates}
         * @memberof Module
         */
        status:ModuleStates;
    
        /**
         * 当加载完成后
         *
         * @type {IRes}
         * @memberof Module
         */
        res:IRes;
        aliveUrl:string;
        key:string;
        /**
         * 模块名
         *
         * @type {string}
         * @memberof Module
         */
        aliases:string[];
        urls:string[];
        
        constructor(name:string|ModuleNames,constValue?:any){
            
            let names :ModuleNames;
            

            if(constValue!==undefined){
                if(constValue==='#undefined') constValue = undefined;
                this.aliases=[name as string];
                let promise = (Promise as any).resolve(constValue);
                this.status = ModuleStates.completed;
                promise.promise(this);
            }else {
                if(name){
                    if(typeof name==="string"){
                        names = new ModuleNames(name);
                    }else names = name;
                    this.key = names.key;
                    this.aliases = names.aliases;
                    this.urls = names.urls;
                }
                this.status=ModuleStates.init;
                this._deferred = (Promise as any).defer();
                this._deferred.done((value)=>{
                    this.value = value;
                    this.status = ModuleStates.completed;
                }).fail((err)=>{
                    this.status = ModuleStates.error;
                });
                (this._deferred as any).promise(this);
            }
            
            
            
        }
        checkAlias(alias:string):boolean{
            const mod_aliases = this.aliases;
            for(let i =0,j=mod_aliases.length;i<j;i++){
                let alias1 = mod_aliases[i];
                if(alias===alias1)return true;
            }
            return false;
        }
    
        
        load():Module{
            if(this.status !== ModuleStates.init && this.status!==ModuleStates.error) {
                this._loading_urls = undefined;
                return this;
            }
            this.status = ModuleStates.loading;
            let loading_urls = this._loading_urls;
            if(!loading_urls) loading_urls = this._loading_urls = array_clone(this.urls);
            let visitedUrls:string[] = [];
            let release_version = requirejs.release_version|| Math.random().toString();
            loadModuleRes(loading_urls,release_version,this,visitedUrls,(result,error)=>{
                this._loading_urls=undefined;

                if(error) {
                     console.error(error);
                     this.status = ModuleStates.error;
                     //this._deferred.reject(error);
                }else {
                    let ctx:IDefineContext = define_context;
                    if(ctx){
                        ctx.module = this;
                        this.status = ModuleStates.loaded;
                        if(ctx.modname){
                            this.aliases.push(ctx.modname);
                            modules[ctx.modname] = this;
                        }
                        
                        ctx.onReady = (defineResult,dctx)=>{
                            this.status = ModuleStates.completed;
                            
                            (this._deferred as any).resolve(this.value = defineResult);
                        };
                    }else {
                        this.status = ModuleStates.completed;
                        (this._deferred as any).resolve(this.value = result);
                    }
                    define_context=undefined;
                    global.exports = {};
                }
                
                
            });
    
        }
        
        then:(onFullfilled:(value:any,param?:any)=>void,onRejected?:(reason:any,param?:any)=>void)=>IPromise;
        done:(onFullfilled:(value:any,param?:any)=>void,param?:any)=>IPromise;
        fail:(onRejected:(value:any,param?:any)=>void,param?:any)=>IPromise;
        promise:(target?:any)=>IPromise;
    
    }
    
    
    let define_context :IDefineContext;
    function define(name:string|string[]|Function,dependences:string[]|Function,defination:Function){
        let deps:string[];
        let nt = typeof name;

        let define_exports:any  = global.exports = {"__define_exports__":true};
        let dctx:IDefineContext = define_context = {
            exports: define_exports
        };
    
        if(nt==="function"){
            defination = name as Function;
            deps=[];
            name = undefined;
        }else if(nt==="object" && (name as string[]).length!==undefined && (name as string[]).push){
            deps = name as string[];
            defination = dependences as Function;
        }else if(nt==="string"){
            dctx.modname = name.toString();
            let dt = typeof dependences;
            if(dt==='function'){
                deps = [];
                defination=dependences as Function;
            }else if(dt==='object'){
                if(dependences.length!==undefined && (dependences as any).push){
                    deps = dependences as string[];
                }else {
                    let module = requirejs.find(name as string) as Module;
                    if(module instanceof Module && module.value===dependences){
                        if(!array_exists(module.aliases,name as string)) module.aliases.push(name as string);
                        modules[name as string] = module;
                        return;
                    }
                    let moduleNew = new Module(name as string,dependences===undefined?"#undefined":dependences);
                    modules.unshift(moduleNew);
                    modules[name.toString()] = moduleNew;
                    return ;
                    
                }
            }
        }
        dctx.deps = deps;
        //setTimeout(() => {
            requirejs(deps).done((values)=>{
                setTimeout(()=>{
                    let defineResult:any;
                    if(defination) {
                        defineResult = defination.apply(dctx.module ||{},values);
                        if(defineResult===undefined){
                            if(define_exports.default) defineResult = define_exports.default;
                            //else defineResult = define_exports;
                        }
                        if(!defineResult) defineResult = define_exports;
                        if(defineResult.default===undefined) defineResult.default = defineResult;
                        
                    }else defineResult = values;
                    if(dctx.onReady) dctx.onReady(defineResult,dctx);
                },0);
                
            });
        //}, 0);
        
    }
    (define as any).amd = true;
    requirejs.define = define;


    
    
    
    
    function loadModuleRes(urls:string[],rlz_version:string,mod:Module,visitedUrls:string[],callback:(result?:any,error?:any)=>void):void{
        let url = urls.shift();
        let ext = extname(url);
        let loader = ext=='.css'?loadStylesheet:loadScript;
        if(rlz_version){
            if(url.indexOf("?")>=0) url += '&';
            else url += '?';
            url += "v=" + rlz_version;
        }
        if(!url) callback(undefined,{message:"load failed",urls:visitedUrls});
        (loader({url:url}) as any).then(
            (res)=>callback({url:urls,visited:visitedUrls,res:res})
            ,()=> loadModuleRes(urls,rlz_version,mod,visitedUrls,callback)
        );
    }
    
    
    function loadScript(res:IRes):IPromise{
        res.elementFactory = (url:string):HTMLElement=>{
            let elem :HTMLScriptElement = document.createElement("script") as HTMLScriptElement;
            elem.type = res["type"]|| "text/javascript";
            elem.src= url;
            return elem;
        };
        return loadRes(res);
    }
    function loadStylesheet(res:IRes):IPromise{
        res.elementFactory = (url:string):HTMLElement=>{
            let elem :HTMLLinkElement = document.createElement("link") as HTMLLinkElement;
            elem.type = res["type"]|| "text/css";
            elem.rel="stylesheet";
            elem.href= url;
            return elem;
        };
        return loadRes(res);
    }
    let loadRes:(res:IRes)=>IPromise;
    loadRes = function (res:IRes):IPromise{
        let elem = res.element = res.elementFactory(res.url);
        let MyPromise:any = Promise;
        return new MyPromise((resolve,reject)=>{
            if((elem as any).onreadystatechange!==undefined){
                (elem as any).onreadystatechange = function(){
                    if((elem as any).readyState==4 || (elem as any).readyState=="complete" || (elem as any).readyState=="loaded"){
                        resolve(res);
                    }
                }
            }else elem.onload = ()=>{
                resolve(res);
            }
            (elem as any).onerror = reject;
            let head= getHead();
            head.appendChild(elem);
        },'callbackSync') as any;
        
        
    }
    
    let getHead:()=>HTMLHeadElement =():HTMLHeadElement =>{
        let head : HTMLHeadElement;
        let heads = document.getElementsByTagName("head");
        if(heads && heads.length) head = heads[0] as HTMLHeadElement;
        else if(document.documentElement && document.documentElement.firstChild) head = document.documentElement.firstChild as HTMLHeadElement; 
        else head = document.body as HTMLHeadElement;
        getHead = ()=>head;
        return head;
    }

    
    
    function array_exists(arr:any,item:any):boolean{
        for(let i=0,j=(arr as any[]).length;i<j;i++) {
            if((arr as any[])[i]===item)return true;
        }
        return false;
    }
    function array_clone(arr:any[]):any[]{
        let result = [];
        for(let i=0,j=(arr as any[]).length;i<j;i++) result.push((arr as any[])[i]);
        return result;
    }
    
    function is_url(name:string){
        return /^http(s?):\/\//.test(name);
    }
    function extname(url:string){
        let dotAt = url.lastIndexOf('.');
        if(dotAt<0) return '';
        let slashAt = url.indexOf('/',dotAt);
        if(slashAt>=0) return '';
        let ext= url.substring(dotAt) ;
        if(ext.length>3)return null;
        return ext;
    }
    
    function trim(text?:string){
        if(!text) return "";
        return text.toString().replace(/(^\s+)|(\s+$)/g,"");
    }

    let requireModule = new Module("require",requirejs);
    modules.push(requireModule);
    modules["require"] = requireModule;

    let defineModule = new Module("define",define);
    modules.push(defineModule);
    modules["define"] = defineModule;

    let globalModule = new Module("global",global);
    modules.push(globalModule);
    modules["global"] = globalModule;


    exports.define = global.define = define;
    exports.default = exports.require = global.require = requirejs;
    (requirejs as any).default = requirejs;
    return requirejs;
});
