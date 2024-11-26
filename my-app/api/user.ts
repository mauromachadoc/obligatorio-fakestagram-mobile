import api from ".";

export const profileById = async (id: string) => {
  const response = await api.get(`/user/profile/${id}`);

  return response.data;
}
export const updateProfile = async (id: string, data: any) => {
  const response = await api.put(`/user/profile/edit`, { ...data });

  return response.data;
}

export const addFriend = async (id: string) => {
  const response = await api.post(`/user/add-friend/${id}`);

  return response.data;
}

export const removeFriend = async (id: string) => {
  const response = await api.delete(`/user/remove-friend/${id}`);

  return response.data;
}
