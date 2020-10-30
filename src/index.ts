import {LoginModel} from "./model/login.model";
import * as dotenv from "dotenv";
import {CreditModel} from "./model/credit.model";
import {getCredit, login, sign_in} from "./login";
import {getUrls} from "./constants";
import * as loggerUtil from "./logger.util";
import fetch from "node-fetch";

export const logger = loggerUtil.init();
const main = async () => {
  dotenv.config();
  const loginModel: LoginModel = {
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
  };
  if (loginModel.username === "" || loginModel.password === "") {
    logger.error("你的github secrets中USERNAME或PASSWORD为空");
    process.exit(1);
  }
  const urls = await getUrls();
  logger.debug(urls)
  const canIUse = async (url: string) => {
    const result = await Promise.race([
      fetch(url),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("request timeout")), 3000);
      }),
    ]);
    return (result as fetch.Response).ok;
  };
  for (const url of urls) {
    const entrypoint = url + "/weblogin.asp";
    try {
      const canUse = await canIUse(entrypoint);
      logger.info(JSON.stringify({url, canUse}));
    } catch (e) {
      logger.error(e)
      continue
    }
    const credit: CreditModel = await getCredit(url);
    await login(url, credit, loginModel);
    // TODO: 自动重试3次，考虑用rxjs重新实现？
    const flag = await sign_in(url, credit.cookie, 3);
    if (flag) return 0;
  }
};

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
