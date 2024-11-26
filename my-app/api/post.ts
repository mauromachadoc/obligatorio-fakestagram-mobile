import api from ".";

export const feed = async () => {
  const response = await api.get('/posts/feed');

  return response.data;
}

export const addComment = async (postId: string, content: string) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });

  return response.data;
}

export const addPost = async (data: any) => {
  const response = await api.post('/posts/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export const deleteComment = async (postId: string, commentId: string) => {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);

  return response.data;
}

export const addLike = async (postId: string) => {
  const response = await api.post(`/posts/${postId}/like`);

  return response.data;
}

export const removeLike = async (postId: string) => {
  const response = await api.delete(`/posts/${postId}/like`);

  return response.data;
}
