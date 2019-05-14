import HttpRequest from '@/libs/axios'
const baseUrl = process.env.VUE_APP_SERVER_HOST + '/api'
const axios = new HttpRequest(baseUrl)
export default axios
