import axios from 'axios';

export const coffeeApi = axios.create({
  baseURL: '/api/',
  timeout: 1000,
});