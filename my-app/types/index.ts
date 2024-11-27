export type Comment = {
  _id: string;
  content: string;
  user: {
    username: string;
    _id: string;
  };
};

export type Likes = {
  _id: string;
  user: {
    _id: string;
  };
};

export type User = {
  _id: string;
  username: string;
  email: string;
  friends: Array<User>;
  createdAt: string;
  profilePicture: string;
};

export type Post = {
  _id: string;
  imageUrl: string;
  caption: string;
  user: User;
  comments: Array<Comment>;
  likes: Array<Likes>;
};

export type Notification = {
  _id: string;
  fromUserId: User;
  type: string;
  postId: string;
  read: boolean;
  createdAt: string;
};
