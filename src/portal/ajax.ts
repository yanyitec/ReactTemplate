import * as axios from 'lib/axios';
import {mergeDiff} from 'lib/utils';

declare var Deferred : any;



let ajaxDefaultOpts;
export function ajax(url,opts?:any):IThenable{
  opts = mergeDiff(ajaxDefaultOpts,opts);
  let url_resolve = opts.url_resolve;
  let urls;
  switch(url_resolve){
    case "always": urls = require.resolveUrl(url);break;
    case "never":urls = [url];break;
    default:
      if(url.indexOf("http://")==0|| url.indexOf("https://")==0) urls=[url];
      else urls = require.resolveUrl(url);
  }
  let deferred = new Deferred();
  doAjax(urls,deferred,0,opts);
  return deferred.promise();
}
function doAjax(urls:string[],deferred:IDeferred,index:number,opts:any){
  if(index>=urls.length) {
    console.error("urls is cannot connected",urls);
    deferred.reject({message:"所有的连接都无法访问",urls:urls});
    return;
  }
  let url = urls[index];
  opts.url = url;
  axios(opts).then((value)=>{
    deferred.resolve(value);
  },(e)=>{
    console.warn("ajax error:",e);
    doAjax(urls,deferred,index+1,opts);
  });  
}

export let getJson = (url,data?:any,opts?:any) :IThenable=>{
    url = makeUrl(url,data);
    opts = mergeDiff(opts,{
        method:'get',
        headers:{
        'X-Requested-Type': 'urlencoding',
        'X-Response-Type':'json'
        },
        transformResponse: [handleJsonResponse]
    });
    return ajax(url,opts);
}
export let postJson = (url,data?:any,opts?:any):IThenable=>{
    url = makeUrl(url,data);
    opts = mergeDiff(opts,{
        method:'post',
        data:JSON.stringify(data),
        headers:{
            'X-Requested-Type': 'urlencoding',
            'X-Response-Type':'json'
        },
        transformResponse: [handleJsonResponse]
    });
    return ajax(url,opts);
}

function makeUrl(url,data?:any):string[]{
    let query :string='';
    if(data){
        if(typeof data=='string') query = data as string;
        else {
        for(let n in data){
            if(query) query+='&';
            query += encodeURIComponent(n) +'='+encodeURIComponent(data[n]);
        }
        }
    }
    if(query){
        if(url.indexOf('?')<0) url += '?';
        else url +='&';
        url += query;
    }

    return url;
}  

function handleJsonResponse(response){
    if(response.status==='401'){
        appStore.dispach({type:'user.signin'});
        throw response;
    }
    return response.data;
}
let appStore:any;
export default function ajaxable(target,store,defaultOpts){
    target.ajax = ajax;
    target.getJson = getJson;
    target.postJson = postJson;
    ajaxDefaultOpts = defaultOpts;
    appStore = store;
}