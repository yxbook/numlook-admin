import request from '../request'
import requestURL from '../requestUrl'
import requestParam from '../requestParam'


// 登录
export function login(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/login'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 退出
export function logout() {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/logout'),
    data: requestParam()
  })
}

