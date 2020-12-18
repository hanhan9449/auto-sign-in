import { CreditModel } from "../model/credit.model";
import { LoginModel } from "../model/login.model";
import fetch from "node-fetch";
import { logger } from "../index";
import got from "got";

export const registerToken = async (url: string, credit: CreditModel, loginModel: LoginModel) => {
  logger.info('正在注册token💗')
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
  logger.debug("服务器注册cookie", { text });
  if (text.includes("学号或密码错误")) {
    logger.error("学号或密码错误");
    process.exit(1);
  }
  logger.info('注册token成功💗')
};
