
//import {objectAccessor} from 'lib/utils';
export let Validators = {
    required:function(text,rule){
        rule = rule ||{};
        if(!text) return rule.message || "必填";
        let tp = typeof (text);
        if(tp ==='string'){
            text = text.replace(/(^\s+)|(\s+$)/g,'');
            if(!text) return rule.message || "必填";
            else return true;
        }
        if(tp==='object'){
            if(Object.prototype.toString.call(text)=="[object Array]"){
                if(text.length==0) return rule.message || "必填";
                else return true;
            }
            let hasOne =false;
            for(let n in text) {
                hasOne=true;break;
            }
            if(hasOne) return true;
            return rule.message || "必填";
        }
        

    },
    length:function(text,rule){
        rule=rule || {};
        let min = rule.min || 0;
        let max = rule.max;
        if(text) text = text.replace(/(^\s+)|(\s+$)/g,"");
        if(text.length<min) return rule.message;
        if(max && text.length>max) return rule.message;
        return true;
    },
    regex:function(text,rule){
        rule=rule || {};
        let reg = rule.$RegExp;
        if(!reg)  reg = rule.$RegExp = new RegExp(rule.reg);
        if(reg.test(text)) return true;
        return rule.message || "格式不正确";
    }
};

export function validation(obj:any){
    let validate = function(field:string|{[index:string]:any},text:string){
        if(typeof field==='object'){
            let validStates = {};
            for(let n in obj){
                validStates[n] = validate(n,field[n]);
            }
            return validStates;
        }
        let rules = obj[field as string];
        if(!rules)return null;
        let rs=true;
        for(let n in rules){
            let rule = rules[n];
            let type = rule.type || n;
            let validator = Validators[type];
            if(validator) {
                rs = validator(text,rule);
                if(rs!==true){
                    break;
                }
            }
        }
        
        return rs;
        //return objectAccessor(validStates).setValue({},rs);
    }
    return validate;
}

