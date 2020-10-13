import fetch from "node-fetch";
import { CreditModel } from "./model/credit.model";
import { LoginModel } from "./model/login.model";

// 获取验证码和cookie
export const getCredit = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  const code = (text.match(/(?<=&nbsp;&nbsp;)\d{4}/) as any)[0];
  const cookie = res.headers.raw()["set-cookie"][0];
  return { code, cookie } as CreditModel;
};
// 登陆
export const login = async (url: string, credit: CreditModel, loginModel: LoginModel) => {
  let form = new URLSearchParams();
  form.append("username", loginModel.username);
  form.append("userpwd", loginModel.password);
  form.append("code", credit.code);
  form.append("login", "login");
  form.append("checkcode", "1");
  form.append("rank", "0");
  form.append("action", "login");
  form.append("m5", "1");

  let headers = {
    cookie: credit.cookie,
  };
  await fetch(url, { method: "POST", body: form, headers });
};

export const sign_in = async (cookie: string) => {
  const magic =
    "https://xsswzx.cdu.edu.cn/ispstu1-2/com_user/project_addx.asp?id=2cac2bcd340407662b58f58d7d36208484167d55095a&id2=2020%E5%B9%B410%E6%9C%8813%E6%97%A5";
  const headers = {
    cookie,
  };
  const res = await fetch(magic, { headers });
  const text = await res.text();
  return !text.includes("登记已存在");

};
