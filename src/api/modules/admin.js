import request from '../request'
import requestURL from '../requestUrl'
import requestParam from '../requestParam'


// 管理员 分页数据
export function list(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/list'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 添加管理员
export function add(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/save'),
    data: requestParam(params, 'post', true,'json')
  })
}

// 修改管理员信息
export function update(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/update'),
    data: requestParam(params, 'delete', true,'json')
  })
}

// 删除 / 批量删除
export function batchDelete(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/admin/delete'),
    data: requestParam(params, 'post', true,'json')
  })
}
