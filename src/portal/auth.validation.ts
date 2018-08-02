import {validation} from 'lib/validation';
export default validation(
//-----validation rules start
{
    "Username":{
        "required":{message:"请填写用户名"},
        "length":{min:2,max:20,message:"最少2个字符，最多20个字符"},
        "regex":{reg:"^\\s*[a-zA-Z][a-zA-Z0-9_]+\\s*$",message:"字母开头，字母数字或下划线的组合"}
    },
    "Password":{
        "required":{message:"请填写密码"},
        "length":{min:2,max:256,message:"最短2位，最长256位"}
    }
}
//-----validation rules end
);