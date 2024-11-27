import axios from "axios";
import { getItem } from "@/helpers/asyncStorage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${apiUrl}/api`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getItem('token');
    
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    console.log(config);
    return config;
  },
  (error) => {
    console.log('Error with request:', error);
    return Promise.reject(error);
  }
);

export default api;
