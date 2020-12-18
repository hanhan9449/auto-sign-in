import {LoginModel} from "../model/login.model";
import {logger} from "../index";

export function getLoginModel() {
  const loginModel: LoginModel = {
    username: process.env.USERNAME ?? '',
    password: process.env.PASSWORD ?? ''
  }
  if (loginModel.username === '' || loginModel.password === '') {
    logger.error('你的github secrets中未设置USERNAME或PASSWORD')
    process.exit(1)
  }
  return loginModel
}