import { LoginModel } from "./model/login.model";
import * as dotenv from "dotenv";
import { CreditModel } from "./model/credit.model";
import { getUrls } from "./services/getUrls";
import * as loggerUtil from "./logger.util";
import fetch from "node-fetch";
import { getCredit } from "./services/getCredit";
import { signIn } from "./services/signIn";
import { registerToken } from "./services/registerToken";
import { testUrl } from "./services/testUrl";
import { getLoginModel } from "./services/getLoginModel";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";

export const logger = loggerUtil.init();
dotenv.config();
dayjs().format();
dayjs.locale("zh-cn");

async function main() {
  const loginModel = getLoginModel();
  const urls = await getUrls();
  for (const url of urls) {
    logger.info(`正在尝试使用'${url}'`);
    let timer = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("超时"));
      }, 10000);
    });
    let tasks = new Promise(async (resolve, reject) => {
      let credit = await getCredit(url);
      await registerToken(url, credit, loginModel);
      await signIn(url, credit.cookie);
      process.exit(0);
    });
    try {
      await Promise.race([timer, tasks]);
    } catch (e) {}
  }
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
