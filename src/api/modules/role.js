import request from '../request'
import requestURL from '../requestUrl'
import requestParam from '../requestParam'


// 角色数据
export function list() {
  return request({
    method: 'get',
    url: requestURL('/sys/role/list'),
    data: requestParam()
  })
}

// 角色分页 数据
export function listPage(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/role/listPage'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 获取角色所拥有的 资源 ID 列表
export function resourceIds(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/role/getResourceIds'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 添加角色
export function add(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/role/save'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 修改角色信息
export function update(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/role/update'),
    data: requestParam(params, 'post', true, 'json')
  })
}

// 删除 / 批量删除
export function batchDelete(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/role/delete'),
    data: requestParam(params, 'post', true, 'json')
  })
}
