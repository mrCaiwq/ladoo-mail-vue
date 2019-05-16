import axios from '@/libs/api.request'
import _ from 'lodash'

export const login = ({ userName, password }) => {
  const data = {
    email: userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'users/my',
    method: 'get'
  })
}

export const getUserList = (params) => {
  params = _.omitBy(params, _.isNil)
  return axios.request({
    url: 'users',
    params: params,
    method: 'get'
  })
}

export const getUser = (id) => {
  return axios.request({
    url: `users/${id}`,
    method: 'get'
  })
}

export const createUser = (data) => {
  return axios.request({
    url: `users`,
    method: 'post',
    data
  })
}

export const logout = token => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
