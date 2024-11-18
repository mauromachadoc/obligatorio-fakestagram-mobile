import axios from "axios";

const api = axios.create({
  baseURL: `http://172.27.80.1:3001/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`
    }
  }

  return config;
});

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
}

export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
}

export const feed = async () => {
  const response = await api.get('/posts/feed');

  return response.data;
}

export const profileById = async (id: string) => {
  const response = await api.get(`/user/profile/${id}`);

  return response.data;
}

export const getNotifications = async () => {
  const response = await api.get(`/notifications`);

  return response.data;
}

export const updateProfile = async (id: string, data: any) => {
  const response = await api.put(`/user/profile/edit`, { ...data });

  return response.data;
}

export const addComment = async (postId: string, content: string) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });

  return response.data;
}


export const deleteComment = async (postId: string, commentId: string) => {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);

  return response.data;
}

export const fetchPost = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`);

  return response.data;
};

export default api;
