import api from ".";

export const getNotifications = async () => {
  const response = await api.get(`/user/notifications`);

  return response.data;
}
