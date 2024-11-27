import axios from "axios";
import { getItem, removeItem } from "@/helpers/asyncStorage";
import { router } from "expo-router";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${apiUrl}/api`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getItem('token');

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    console.log('Error with request:', error);
    return Promise.reject(error);
  }
);

export default api;
