import { LoginModel } from "./model/login.model";
import * as dotenv from "dotenv";
import { CreditModel } from "./model/credit.model";
import { getCredit, login, sign_in } from "./login";
import { urls } from "./constants";
import * as loggerUtil from "./logger.util";
import fetch from 'node-fetch'

export const logger = loggerUtil.init();
const main = async () => {
  dotenv.config();
  const loginModel: LoginModel = {
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
  };
  if (loginModel.username === "" || loginModel.password === "") {
    process.exit(1);
  }
  for (const url of urls) {
    const magic = "/weblogin.asp";
    const canUse = (await fetch(url + magic)).ok
    logger.info(JSON.stringify({url , canUse}))
    if (!canUse) {
      continue;
    }
    const credit: CreditModel = await getCredit(url);
    await login(url, credit, loginModel);
    // TODO: 自动重试3次，考虑用rxjs重新实现？
    const flag = await sign_in(url, credit.cookie, 3);
    if (flag) return 0;
  }
};

main().catch((err) => console.error(err));
