import request from '../request'
import requestURL from '../requestUrl'
import requestParam from '../requestParam'


// 根据管理员ID 获取对应资源列表
export function resouce(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/resource'),
    data: requestParam(params, 'get', true, 'json')
  })
}

// 获取所有菜单列表 树形结构
export function all() {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/all'),
    data: requestParam()
  })
}


// 添加 一级菜单 / 二级列表
export function add(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/save'),
    data: requestParam(params, 'post', true, 'json')
  })
}


// 删除指定菜单
export function deleteMenu(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/delete'),
    data: requestParam(params, 'post', true, 'json')
  })
}


// 修改菜单信息
export function update(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/update'),
    data: requestParam(params, 'json', true, 'json')
  })
}


// 一级菜单列表
export function parents(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/menus/parentList'),
    data: requestParam()
  })
}


