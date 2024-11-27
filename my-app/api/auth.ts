import { setItem } from "@/helpers/asyncStorage";
import api from ".";

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);

  if (response.data.token) {
    await setItem('token', response.data.token);
  }

  return response.data;
}

export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);

  if (response.data.token) {
    await setItem('token', response.data.token);
  }

  return response.data;
}
