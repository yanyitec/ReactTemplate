let utils:any={};
export function cloneObject(src:any){
    if(!src) return src;
    let dest:any;
    if(Object.prototype.toString.call(src)==="[object Array]") dest = [];
    else dest = {};
    for(let n in src){
        let value = src[n];
        if(typeof value==='object'){
            dest[n] = cloneObject(value);
        }else dest[n] = value;
    }
    return dest;
}
utils.cloneObject = cloneObject;
//合并model
export function mergeDiff(dest,src,prop?:string) {
    if(prop===undefined){
        if(dest===src || src===undefined) return dest;
        if(dest===undefined || dest===null) return src;
        if(src && src.__RELACEALL__){src.__RELACEALL__=undefined; return src;}
        let destT  = typeof dest;
        let srcT = typeof src;
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
                isArr;
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
    if(destValue===undefined) return srcValue;

    if(srcValue === null || srcValue instanceof RegExp) return srcValue;
    if(srcValue && srcValue.__RELACEALL__){srcValue.__RELACEALL__=undefined;return srcValue;}
    let srcValueType = typeof srcValue;
    if(srcValueType==='number' || srcValueType==="string" || srcValueType==="boolean") return srcValue;
    //是对象，且不相同
    return mergeDiff(destValue,srcValue);
}
utils.mergeDiff = mergeDiff;

if(!(String.prototype as any).startsWith){
    (String.prototype as any).startsWith = function(strx){
        return  this.indexOf(strx)==0;
    } 
}
export default utils;