import fetch from "node-fetch";

export const urls: string[] = [
  "https://xsswzx.cdu.edu.cn/ispstu/com_user",
  "https://xsswzx.cdu.edu.cn/ispstu1-1/com_user",
  "https://xsswzx.cdu.edu.cn/ispstu1-2/com_user",
  "https://xsswzx.cdu.edu.cn/ispstu2/com_user",
  "https://xsswzx.cdu.edu.cn/ispstu2-1/com_user",
  "https://xsswzx.cdu.edu.cn/ispstu2-2/com_user",
];

export const getUrls = async () => {
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
