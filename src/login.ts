import fetch from "node-fetch";
import { CreditModel } from "./model/credit.model";
import { LoginModel } from "./model/login.model";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { logger } from "./index";

// 获取验证码和cookie
export const getCredit = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  const code = (text.match(/(?<=&nbsp;&nbsp;)\d{4}/) as any)[0];
  const cookie = res.headers.raw()["set-cookie"][0];
  logger.debug({ code, cookie });
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
  const res = await fetch(url, { method: "POST", body: form, headers });
  const text = await res.text();
  if (text.includes("学号或密码错误")) {
    logger.error("学号或密码错误");
    process.exit(1);
  }
};

// TODO: use url
export const sign_in = async (cookie: string) => {
  dayjs().format();
  dayjs.locale("zh-cn");
  const nowDate = dayjs();
  nowDate.day();

  const magic =
    "https://xsswzx.cdu.edu.cn/ispstu1-2/com_user/project_addx.asp?id=2cac2bcd340407662b58f58d7d36208484167d55095a&id2=" +
    +encodeURI(`${nowDate.year()}年${nowDate.month()}月${nowDate.day()}日`);
  const headers = {
    cookie,
  };
  const res = await fetch(magic, { headers });
  const text = await res.text();

  if (text.includes("登记已存在")) {
    logger.warn("登记已存在");
  } else if (text.includes("成功")) {
    logger.info("登记成功");
  } else {
    // TODO
    logger.error("未知错误");
    logger.error(text)
  }
};
