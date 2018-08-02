let utils:any={};
export function deepClone(src:any){
    if(!src) return src;
    let dest:any;
    if(Object.prototype.toString.call(src)==="[object Array]") dest = [];
    else dest = {};
    for(let n in src){
        let value = src[n];
        if(typeof value==='object'){
            dest[n] = deepClone(value);
        }else dest[n] = value;
    }
    return dest;
}
utils.deepClone = deepClone;
//合并model
export function mergeDiff(dest,src,prop?:string) {
    if(prop===undefined){
        if(dest===src || src===undefined) return dest;
        if(dest===undefined || dest===null || src===null) return src;
        if(src && src.__REPLACEALL__){src.__REPLACEALL__=undefined; return src;}
        let destT  = typeof dest;
        let srcT = typeof src;
        if(srcT==='object' && Object.prototype.toString.call(src)==='[object Array]') return src;
        let ds,isArr=false;
        if(destT==='object'){
            //console.log(Object.prototype.toString.call(dest),dest);
            if(Object.prototype.toString.call(dest)==='[object Array]') {
                //console.log("isArray");
                isArr=true;
                ds=[];
            }else {
                isArr=false;
            }
        }else {
            dest={};
        }
        if(!isArr){
            if(Object.prototype.toString.call(src)==='[object Array]') {
                ds=[];
            }else if(!ds){ 
                ds={};
                if(srcT!=='object') src={};
            }
        }

        for(let dn in dest){
            ds[dn] =mergeDiff(dest,src,dn);
        }
        for(let sn in src){
            if(ds[sn]===undefined) ds[sn] =mergeDiff(dest,src,sn);
        }
        return ds;
    }
    let srcValue = src[prop];
    let destValue = dest[prop];
    if(srcValue===undefined || srcValue===destValue) return destValue;
    if(destValue===undefined || srcValue === null || srcValue instanceof RegExp) return srcValue;
    if(srcValue && srcValue.__REPLACEALL__){srcValue.__REPLACEALL__=undefined;return srcValue;}
    let srcValueType = typeof srcValue;
    if(srcValueType==='number' || srcValueType==="string" || srcValueType==="boolean") return srcValue;
    //是对象，且不相同
    return mergeDiff(destValue,srcValue);
}
utils.mergeDiff = mergeDiff;



//事件
let div:HTMLElement = document.createElement("div") as HTMLElement;
let _attach : (elem,evt,handler)=>void;
let _detech : (elem,evt,handler)=>void;
if((div as any).attachEvent){
    _attach = (elem,evt,handler)=>elem.attachEvent('on' + evt,handler);
    _detech = (elem,evt,handler)=>elem.detechEvent('on' + evt,handler);
}else {
    _attach = (elem,evt,handler)=>elem.addEventListener( evt,handler,false);
    _detech = (elem,evt,handler)=>elem.removeEventListener( evt,handler,false);
}
export let attach = utils.attach = _attach;
export let detech = utils.detech = _detech;

export let getCookie:(name:string)=>string = utils.getCookie = function (name:string)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else return null;
}

export let setCookie:(name:string,value?:any,time?:string)=>any =utils.setCookie=  function (name:string,value?:any,time?:string)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + (exp as any).toGMTString();
}
export function delCookie(name:string)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+(exp as any).toGMTString();
}
utils.delCookie = delCookie;

function getsec(str)
{
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")return str1*1000;
    else if (str2=="h")return str1*60*60*1000;
    else if (str2=="d")return str1*24*60*60*1000;
}

//获取盒模型
export let getBox =utils.getBox  = function(elem?:any){
    if(!elem){
        let w= window.innerWidth || document.documentElement.clientWidth;
        let h= window.innerHeight || document.documentElement.clientHeight;
        return {x:0,y:0,width:w,height:h};
    }
    let x=0,y=0;
    let w = elem.clientWidth,h=elem.clientHeight;
    while(elem){
        x+=elem.offsetLeft;
        y+=elem.offsetTop;
        if(elem===document.body)break;
        elem = elem.offsetParent;
    }
    return {x:x,y:y,width:w,height:h};
}

//媒体查询
let viewportChangeHandlers:Array<(type)=>void>=[];
let viewports = {
    "lg":1200,
    "md":992,
    "sm":768
};
export interface IViewport{
    w:number;
    h:number;
    name:string;
}
export let viewport =utils.viewport =  function(onChange?:((type)=>void)|boolean):string| IViewport{
    if(onChange && typeof onChange ==='function') {
        viewportChangeHandlers.push(onChange);
    }
    if((onChange as boolean)===true) return view_port;
    return view_port.name;
    
}
let view_port;
let viewportResizeHandler = ()=>{
    let w= window.innerWidth || document.documentElement.clientWidth;
    let h= Math.max(document.body.clientHeight,Math.max(window.innerHeight ,document.documentElement.clientHeight));
    //console.log("rsz",window.innerHeight,document.documentElement.clientHeight,document.body.clientHeight,h);
    let vt;
    for(let t in viewports){
        if(w>=viewports[t]) {
            vt=t;break;
        }
    }
    vt={w:w,h:h,name:vt||'xs'};
    
    if(!view_port || view_port.name!=vt.name){
        view_port = vt;
        for(let i=0,j=viewportChangeHandlers.length;i<j;i++){
            let handler = viewportChangeHandlers.shift();
            let rs = handler.call(window,vt);
            if(rs!=='#remove') viewportChangeHandlers.push(handler);
        }
    }else view_port = vt;
};
attach(window,'resize',viewportResizeHandler);
viewportResizeHandler();

export interface IAccessor{
    setValue($root:object,value:any):object;
    getValue($root:object):any;
}
let objectAccessors:{[pathname:string]:IAccessor} = {};
export function objectAccessor(path:string):IAccessor{
    let accessor:IAccessor = objectAccessors[path];
    if(!accessor) {
        accessor = objectAccessors[path] = genAccessor(path);
    }
    return accessor;
}
utils.objectAccessor = objectAccessor;

function genAccessor(path:string):IAccessor{
    let set_codes = ["var curr=$root;if(!curr) $root = curr={};var next;"];
    let get_codes = ["var curr=$root;if(!curr)return undefined;"];
    let paths = path.split('.');
    for(let i=0,j=paths.length-1;i<j;i++){
        let sub = paths[i];
        set_codes.push(`next=curr["${sub}"];if(!next) next=curr["${sub}"]={};curr=next;`);
        get_codes.push(`curr = curr["${sub}"];if(!curr) return undefined;`);
    }
    set_codes.push(`curr["${paths[paths.length-1]}"]=$value;return $root;`);
    get_codes.push(`return curr["${paths[paths.length-1]}"];`);
    let setCode = set_codes.join("\n");
    let setter:($root:object,$value:any)=>object = new Function("$root","$value",setCode) as ($root:object,$value:any)=>object;
    let getCode = get_codes.join("\n");
    let getter:($root:object)=>any = new Function("$root",getCode) as ($root:object)=>any;
    return {
        setValue:setter,
        getValue:getter
    };
}


export function is_array(obj:any):boolean{
    return Object.prototype.toString.call(obj) =="[object Array]";
}
utils.is_array = is_array;
export function array_remove(arr:any[],item:any){
    for(let i =0,j=arr.length;i<j;i++){
        let exist = arr.shift();
        if(exist!==item) arr.push(exist);
    }
}
utils.array_remove = array_remove;

export function array_filter(arr:any[],predicator:Function){
    let result :any[]= [];
    for(let i =0,j=arr.length;i<j;i++){
        let exist = arr.shift();
        if(predicator(exist)===true) result.push(exist);
    }
    return result;
}
utils.array_remove = array_remove;



if(!(String.prototype as any).startsWith){
    (String.prototype as any).startsWith = function(strx){
        return  this.indexOf(strx)==0;
    } 
}
export default utils;