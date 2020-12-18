import fetch from "node-fetch";
import { logger } from "../index";
import { CreditModel } from "../model/credit.model";
import got from "got";

/**
 * 获取验证码和cookie
 * @param url
 */
export const getCredit = async (url: string) => {
  logger.info('正在获取验证码😁‍')
  const res = await got(url, {
    headers: {
      "User-Agent":
        "User-Agent: ozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    },
  });
  const text = res.body;
  const code = text.match(/(?<=&nbsp;&nbsp;)\d{4}/)?.[0];
  const cookie = res.headers["set-cookie"]?.[0];
  if (!code || !cookie) {
    logger.error('获取验证码失败🦧')
    logger.debug({ code, cookie });
  }
  logger.info('获取验证码成功😁')
  return { code, cookie } as CreditModel;
};
