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
    logger.info(`正在尝试使用'${url}'`)
    try {
      const canUse = await testUrl(url);
    } catch (e) {
      logger.error(e);
      continue;
    }
    const credit: CreditModel = await getCredit(url);
    await registerToken(url, credit, loginModel);
    try {
      await signIn(url, credit.cookie);
      process.exit(0);
    } catch (e) {}
  }
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
