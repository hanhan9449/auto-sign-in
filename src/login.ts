import fetch from "node-fetch";
import { CreditModel } from "./model/credit.model";
import { LoginModel } from "./model/login.model";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { logger } from "./index";

// 获取验证码和cookie
export const getCredit = async (url: string) => {
  const magic = "/weblogin.asp";
  const res = await fetch(url + magic);
  const text = await res.text();
  const code = text.match(/(?<=&nbsp;&nbsp;)\d{4}/)![0];
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
  const entrypoint = url + "/weblogin.asp";
  const res = await fetch(entrypoint, { method: "POST", body: form, headers });
  const text = await res.text();
  logger.debug("服务器注册cookie", { text });
  if (text.includes("学号或密码错误")) {
    logger.error("学号或密码错误");
    process.exit(1);
  }
};

export const sign_in = async (url: string, cookie: string, time: number) => {
  if (time < 0) {
    logger.error("登录超时，不再尝试该服务器", { url });
    process.exit(1);
  }
  dayjs().format();
  dayjs.locale("zh-cn");
  const nowDate = dayjs();
  nowDate.day();

  // 签到url
  const magic =
    url +
    "/project_addx.asp?id=2cac2bcd340407662b58f58d7d36208484167d55095a&id2=" +
    +encodeURI(`${nowDate.year()}年${nowDate.month()}月${nowDate.day()}日`);
  const headers = {
    cookie,
  };
  const res = await fetch(magic, { headers });
  const text = await res.text();
  logger.debug("自动登录服务", { text });

  if (text.includes("登记已存在")) {
    logger.warn("登记已存在");
    return true;
  } else if (text.includes("成功")) {
    logger.info("登记成功");
    return true;
  } else {
    // TODO: 将错误具体举出来
    logger.error("未知错误");
    logger.error(text);
    await sign_in(url, cookie, time - 1);
  }
  return false;
};
