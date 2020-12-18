import fetch from "node-fetch";
import { logger } from "../index";
import got from "got";

export const getUrls: () => Promise<string[]> = async () => {
  const index = "https://xsswzx.cdu.edu.cn/isp/website.asp";
  logger.info("正在获取登录url列表");

  const res = await got(index);
  const text = res.body;
  const urls = [...text.matchAll(/https:\/\/xsswzx\.cdu\.edu\.cn.*?(?=\/weblogin\.asp)/g)]
    .map((o) => o.toString())
    .map((s) => s + "/weblogin.asp");
  if (urls.length === 0) {
    logger.error("获取失败");
    process.exit(1);
  }
  logger.info("获取成功");
  logger.debug(urls);
  return urls;
};
