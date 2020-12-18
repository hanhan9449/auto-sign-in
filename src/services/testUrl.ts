import got from "got";
import { logger } from "../index";

export async function testUrl(url: string, time = 10000) {
  let res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("请求超时了"));
      logger.error(url);
    }, time);

    let res = got(url);
    resolve(res);
  });
  return (res as any).statusCode;
}
