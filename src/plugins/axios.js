import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp({});
app.use(VueAxios, axios);

const instance = axios.create({
  baseURL: process.env.DASHBOARD_BACKEND_URL ? process.env.DASHBOARD_BACKEND_URL : 'http://localhost:8000/api/v1',
  withCredentials: false, 
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

instance.interceptors.request.use(function (config) {

  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  return Promise.reject(error);
});

export default instance;

