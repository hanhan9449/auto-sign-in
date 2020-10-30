import fetch from "node-fetch";

export const getUrls: () => Promise<string[]> = async () => {
  const magic = "https://xsswzx.cdu.edu.cn/isp/website.asp";
  const res = await fetch(magic);
  const text = await res.text();
  const urls = text.matchAll(/https:\/\/xsswzx\.cdu\.edu\.cn.*?(?=\/weblogin\.asp)/g);
  let result = [];
  for (const url of urls) {
    result.push(url.toString());
  }
  result.pop();
  return result;
};
