/**
 * Name : Promise/A+
 * Author : yiy
 * Description : Promise 实现 遵循promise/A+规范
 * 
 * Promise/A+规范原文:
 *  https://promisesaplus.com/#notes
 * 
 * Promise/A+规范译文:
 *  https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/#note-4
 * 
 * 参考资料:
 *  https://www.jianshu.com/p/459a856c476f
 */

 



/**
 * 是一个定义了 then 方法的对象或函数，也被称作“拥有 then 方法”；
 *
 * @export
 * @interface IThenable
 */
interface IThenable{
    then:(onFullfilled:(value:any)=>void,onRejected?:(reason:any)=>void)=>IThenable;
}


/**
 * promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；
 * 本实现
 * @export
 * @interface IPromise
 * @extends {IThenable} 拥有then 方法
 */
interface IPromise extends IThenable{
    done:(onFullfilled:(value:any)=>void)=>IPromise;
    fail:(onRejected:(value:any)=>void)=>IPromise;
    promise(target?:any):IPromise;
}

interface IPromiseOptions{
    useApply?:boolean;
    callbackSync?:boolean;
}

interface IResolvable{
    resolve:(value?:any)=>IResolvable;
    reject:(value?:any)=>IResolvable;
    fullfillable:(target?:any)=>IResolvable;
}

interface IDeferred extends IPromise,IResolvable{
    
}



(function(global,factory){
    eval(`typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports,global) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory(global.exports = {},global));`);
})(this,(exports,global)=>{
if(!global){  try{global = window;}catch(ex){global={}}}

enum PromiseStates{
    padding,
    fullfilled,
    rejected
}

interface IPromiseState{

    /**
     * 状态
     *
     * @type {PromiseStates}
     * @memberof IPromiseState
     */
    __promise_status:PromiseStates;

    /**
     * 终值
     *
     * @type {*}
     * @memberof IPromiseState
     */
    __promise_settled_value:any;

    /**
     * fullfill 回调
     *
     * @type {IExecution[]}
     * @memberof IPromiseState
     */
    __promise_fullfill_callbacks:Array<(value:any)=>any>;
    __promise_reject_callbacks:Array<(reason:any)=>any>;
    __promise_options?:IPromiseOptions;
}

// 获取异步函数
// 如果有setImmediate，就用setImmediate
// 否则，使用 setTimeout
let _async:(call:Function,delay?:number)=>void;
if(typeof setImmediate==="function") _async = setImmediate;
else _async = setTimeout;

let _noop = ()=>{};

//几个重要的过程



/**
 * Promise的解析过程
 *
 * @param {IPromise} promise
 * @param {IPromiseState} promiseState
 * @param {*} value
 * @param {IPromiseOptions} opts
 * @returns {IPromise}
 */
function resolvePromise(promise:IPromise,promiseState:IPromiseState,value:any,opts:IPromiseOptions):IPromise{
// 2.3.2.4.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, 
    //              the first call takes precedence, and any further calls are ignored.
    // 如果已经完成，再次调用resolve就直接返回。不做任何操作
    if(promiseState.__promise_status !== PromiseStates.padding) {
        //console.warn("promise resolved/rejected more than once.",promise,this);
        return promise;
    }
    // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
    // resolve自己会循环引用，直接拒绝
    if(value===promise) {
        return settleValue(promise,promiseState,PromiseStates.rejected,new TypeError('不能resolve自己'),opts);
    }
    //如果要解析的值是 thenable
    if(value && typeof value.then==="function"){
        let called :boolean = false;
        let that:IThenable = value;
        try{
            
            //thenable检查
            //// 2.3.3.2 If retrieving the property x.then results in a thrown exception e, 
            //   reject promise with e as the reason.
            //let then :any = value.then;
            // 2.3.3.3 If then is a function, call it with x as this,
            //          first argument resolvePromise, and second argument rejectPromise
            that.then((thatValue)=>{
                if(called)return ;called = true;
                resolvePromise(promise,promiseState, thatValue,opts);
            },(thatReason)=>{
                if(called)return ;called = true;
                resolvePromise(promise,promiseState, thatReason,opts);
            });
            
            return promise;
        }catch(ex){
            if(called)return ;called = true;
            return settleValue(promise,promiseState,PromiseStates.rejected,ex,opts);
        }
        
    }
    return settleValue(promise,promiseState,PromiseStates.fullfilled,value,opts);
}
function rejectPromise(promise:IPromise,promiseState:IPromiseState,reason:any):IPromise{
    return settleValue(promise,promiseState,PromiseStates.rejected,reason,{...promiseState.__promise_options,useApply:false});
}

/**
 * 给promise设定终值
 *
 * @param {IPromise} promise
 * @param {IPromiseState} promiseState
 * @param {PromiseStates} status
 * @param {*} settledValue
 * @param {IPromiseOptions} opts
 * @returns
 */
function settleValue(promise:IPromise,promiseState:IPromiseState,status:PromiseStates,settledValue:any,opts:IPromiseOptions){
    // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, 
    //           or multiple calls to the same argument are made, 
    //           the first call takes precedence, and any further calls are ignored.
    if(promiseState.__promise_status!==PromiseStates.padding)   return promise;
    
    promiseState.__promise_status = status;
    promiseState.__promise_settled_value = settledValue;
    
    let executeCallbacks = ()=>{
        let callbacks:Array<(settledValue:any)=>any> = status===PromiseStates.fullfilled
            ? promiseState.__promise_fullfill_callbacks
            : promiseState.__promise_reject_callbacks;
    
        if(callbacks) {
            let callback:(value:any)=>any;
            while(callback = callbacks.shift()){
                if(opts && opts.useApply){
                    callback.apply(promise,settledValue);
                }else callback.call(promise,settledValue);
            }  
        }
        promiseState.__promise_fullfill_callbacks = promiseState.__promise_reject_callbacks=null;
    }
    if(opts && opts.callbackSync) executeCallbacks();
    else _async(executeCallbacks,0);

    return promise;
}



function createThenCallback(orignalCallback:(settledValue:any)=>void,resolveOrReject:(value:any)=>void,useApply:boolean){
    return  function(settledValue:any):any{
        let result = (useApply) ? orignalCallback.apply(null,arguments):orignalCallback.call(null,settledValue);
        resolveOrReject(result);
        return result;
    };
}

function makeOpts(opts:IPromiseOptions|string|boolean):IPromiseOptions{
    if(opts===false) opts = {"callbackSync":false};
    else if(opts===true) opts = {"callbackSync":true};
    else if(opts==="useApply") opts = {"useApply":true};
    else if(opts==="callbackSync") opts = {"callbackSync":true};
    return (opts || {}) as IPromiseOptions;
}

/**
 * 核心的Promise类
 * 符合PromiseA+规范
 *
 * @export
 * @class PromiseA
 * @implements {IPromise}
 */
class PromiseA implements IPromise{

    /**
     * 状态
     *
     * @type {PromiseStates}
     * @memberof IPromiseState
     */
    __promise_status:PromiseStates;

    /**
     * 终值
     *
     * @type {*}
     * @memberof IPromiseState
     */
    __promise_settled_value:any;

    /**
     * fullfill 回调
     *
     * @type {IExecution[]}
     * @memberof IPromiseState
     */
    __promise_fullfill_callbacks:Array<(value:any)=>any>;
    __promise_reject_callbacks:Array<(reason:any)=>any>;
    __promise_options?:IPromiseOptions;

    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void,opts?:IPromiseOptions|string|boolean){
        
        //if(executor===null)return;
        const promise = this;
        promise.__promise_options = makeOpts(opts);
        promise.__promise_status = PromiseStates.padding;
        promise.__promise_fullfill_callbacks=[];
        promise.__promise_reject_callbacks=[];
        //promise.then = makeThen(promise);
        
        promise.promise = function(target?:any):IPromise{
            if(target===this)return this;
            target || (target={});
            
            target.then = (onfullfill,onreject)=>{return promise.then(onfullfill,onreject);};
            target.done = (onfullfill)=>{return promise.then(onfullfill);};
            target.fail = (onreject)=>{return promise.then(null,onreject);};
            target.promise = promise.promise;
            return target;
        }
        

        
        if(executor){
            try{
                executor((value)=>resolvePromise(promise,promise,value,promise.__promise_options),(reason)=>rejectPromise(promise,promise,reason));
            }catch(ex){
                rejectPromise(promise,promise,ex);
            }
        }
        
    }
    //then:(onFullfilled:(value:any,param?:any)=>void,onRejected?:(reason:any,param?:any)=>void)=>IThenable;
    then(onFullfilled:(value:any)=>void,onRejected?:(reason:any)=>void):IPromise{
        const promiseState:IPromiseState = this;
        let resolve: (value:any)=>void;
        let reject :(reason:any)=>void;
        let thenPromise = new PromiseA((_resolve,_reject)=>{
            resolve = _resolve;
            reject = _reject;
        });
        let fullfillCallback = typeof onFullfilled !=='function'?null:function(settledValue:any):any{
            let result = (promiseState.__promise_options.useApply) ? onFullfilled.apply(null,arguments):onFullfilled.call(null,settledValue);
            resolve(result);
            return result;
        };
        if(fullfillCallback){
            if(promiseState.__promise_fullfill_callbacks){
                promiseState.__promise_fullfill_callbacks.push(fullfillCallback);
            }else{
                fullfillCallback(promiseState.__promise_settled_value);
                return thenPromise;
            }
        }
        
        let rejectCallback = typeof onRejected !== 'function'?null:function(settledValue:any):any{
            let result = (promiseState.__promise_options.useApply) ? onRejected.apply(null,arguments):onRejected.call(null,settledValue);
            reject(result);
            return result;
        };
        if(rejectCallback){
            if(promiseState.__promise_reject_callbacks){
                promiseState.__promise_reject_callbacks.push(fullfillCallback);
            }else{
                rejectCallback(promiseState.__promise_settled_value);
                return thenPromise;
            }
        }
        
        return thenPromise;
    }

    done(onFullfilled:(settledValue:any)=>any):IPromise{ return this.then(onFullfilled)}

    fail(onRejected:(reason:any)=>any):IPromise{ return this.then(null,onRejected)}

    promise:(target?:any)=>IPromise;
    /**
     *
     * 返回一个fullfilled状态的promise,其值为参数
     * @static
     * @param {*} value
     * @returns {IPromise}
     * @memberof PromiseA
     */
    static resolve(value:any,opts?:IPromiseOptions|string|boolean):IPromise{
        
        return new PromiseA((fullfill,reject)=>{
            fullfill(value);
        },opts);
        //fullfillPromise(promise.__promise_status=PromiseStates.fullfilled,promise.__promise_value=value,promise,sync===true||sync==='sync');
    }


    /**
     * 返回一个rejected状态的promise,其reason为参数值
     *
     * @static
     * @param {*} reason
     * @returns {IPromise}
     * @memberof PromiseA
     */
    static reject(reason:any,opts?:IPromiseOptions|string|boolean):IPromise{
        return new PromiseA((fullfill,reject)=>{
            reject(reason);
        },opts);
    }


    /**
     * 所有参数的promise都resolve了，promise才resolve
     * 
     * 用法1：
     * let tasks = [promise,{},(resolve,reject)=>resolve(1)];
     * PromiseA.all(tasks);
     * 用法2：
     * PromiseA.all(promise,{},(resolve,reject)=>resolve(1));
     * 
     * 两种用法效果相同
     * @static
     * @param {*} [_arg] 1 如果是函数，就当作Promise的executor构建Promise；2 如果是Promise，直接检查状态;3 其他的当作 ResolvedPromise去传递
     * @returns {IPromise}
     * @memberof PromiseA
     */
    static all(_arg?:any,_opts?:IPromiseOptions|string|boolean):IPromise{
        let arg:any[] = [];
        let opts:IPromiseOptions|string|boolean;
        if(arguments.length>=1 && typeof _arg==="object" && _arg.length!==undefined){
            arg = _arg;
            opts = _opts;
        }else {
            arg = Array.prototype.slice.call(arguments);
            opts="useApply";
        }
        if(arg.length==0)return PromiseA.resolve([],opts);
        return new PromiseA((resolve,reject)=>{
            let results=[];
            let taskcount = arg.length;
            function done(value:any,i:number){
                //if(i!==undefined)
                results[i] = value;
                taskcount-=1;
                if(taskcount===0) resolve(results);
            }
            
            
            for(let i = 0,j=arg.length;i<j;i++)((item,i)=>{
                let t = typeof item;
                let p :IThenable;
                if(t==="function"){
                    p = new PromiseA(item);
                }else if(item && item.then && typeof item.then ==='function'){
                    p = item;
                }else {
                    p = PromiseA.resolve(item);
                }
                p.then((value)=>done(value,i),reject);
            })(arg[i],i);
           // done(undefined,undefined);
        },opts);

    }

    /**
     * 只要其中一个resolve了，整个promise就resolve
     * 参数用法参见 all
     *
     * @static
     * @param {*} [_arg]
     * @returns {IPromise}
     * @memberof PromiseA
     */
    static race(_arg?:any,_opts?:IPromiseOptions|string|boolean):IPromise{
        let arg:any[] = [];
        let opts:IPromiseOptions|string|boolean;
        if(arguments.length>=1 && typeof _arg==="object" && _arg.length!==undefined){
            opts=_opts;
        }else {
            arg = Array.prototype.slice.call(arguments);
            opts="useApply";
        }
        if(arg.length==0)return PromiseA.resolve([],opts);

        return new PromiseA((resolve,reject)=>{
            for(let i = 0,j=arg.length;i<j;i++)((item,i)=>{
                let t = typeof item;
                let p :IThenable;
                if(t==="function"){
                    p = new PromiseA(item);
                }else if(item && item.then && typeof item.then ==='function'){
                    p = item;
                }else {
                    p = PromiseA.resolve(item);
                }
                p.then(resolve,reject);
            })(arg[i],i);
        },opts);

    }
    static defer(opts?:IPromiseOptions|boolean|string):IDeferred{
        return new Deferred(opts);
    }

    static Promise:PromiseA = PromiseA as any;
    static Deferred:Deferred;
}




/**
 * 延迟对象
 * 基于Promise实现Deferred的
 * Deferred和Promise的关系
 * - Deferred 拥有 Promise
 * - Deferred 具备对 Promise的状态进行操作的特权方法（resolve reject）
 *
 * 参考jQuery.Deferred
 * url: http://api.jquery.com/category/deferred-object/
 *
 * @export
 * @class Deferred
 * @extends {PromiseA}
 * @implements {IDeferred}
 */
class Deferred extends PromiseA implements IDeferred{
    constructor(opts?:IPromiseOptions|string|boolean){
        let defferredResolve:(value?:any)=>IResolvable;
        let defferredReject:(value?:any)=>IResolvable;

        super((resolve:(value?:any)=>any,reject:(value?:any)=>any)=>{
            defferredResolve= this.resolve = resolve ;
            defferredReject = this.reject = reject;
        },opts);
        
    }
    resolve:(value?:any)=>IResolvable;
    reject:(value?:any)=>IResolvable;
    fullfillable(target?:any) : IResolvable{
        if(target===this)return this;
        target || (target={});
        target.resolve = this.resolve;
        target.reject = this.reject;
        target.fullfillable = this.fullfillable;
        return this;
    }
    deferred(target?:any):IDeferred{
        if(target===this)return this;
        if(target instanceof Deferred)
        target || (target={});
        target.deferred = this.deferred;
        target.resolve = this.resolve;
        target.reject = this.reject;
        target.fullfillable = this.fullfillable;
        target.then = (onfullfill,onreject)=>{this.then(onfullfill,onreject);return target;};
        target.done = (onfullfill)=>{this.done(onfullfill);return target;};
        target.fail = (onreject)=>{this.then(null,onreject);return target;};
        target.promise = this.promise;

        return target;
    }
}
PromiseA.Deferred = Deferred as any;






exports.PromiseA = exports.Promise = global.PromiseA = global.Promise = PromiseA;
//if(!global.Promise) global.Promise = PromiseA;
exports.Deferred = global.Deferred = Deferred;
return exports.default= (PromiseA as any).Promise = (PromiseA as any).PromiseA = PromiseA;
});

