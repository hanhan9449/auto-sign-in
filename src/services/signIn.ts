import { logger } from "../index";
import dayjs from "dayjs";
import fetch from "node-fetch";
import got from "got";

export async function signIn(url: string, cookie: string) {
  logger.info('正在登记')
  const magic = "/project_addx.asp?id=2cac2bcd340407662b58f58d7d36208484167d55095a&id2=";

  const nowDate = dayjs();
  url = url.replace("/weblogin.asp", "");

  url += magic;
  url += encodeURI(`${nowDate.year()}年${nowDate.month()}月${nowDate.day()}日`);
  url += '&adds='+encodeURI('四川省成都市武侯区桂溪街道成达佳园')
  url += '&addsxy=104.07859,30.55403'
  const headers = {
    cookie,
  };
  const res = await fetch(url, { headers });
  const text = await res.text();
  logger.debug( text );
  if (text.includes("登记已存在")) {
    logger.warn("今日登记已存在🌸");
    return true;
  } else if (text.includes("成功")) {
    logger.info("登记成功");
    return true;
  } else {
    logger.error("未知错误");
    logger.error(text);
    return false
  }
}
