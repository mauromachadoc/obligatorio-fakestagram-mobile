import React, { FC, useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { addComment, deleteComment } from "../api/post";
import { Comment } from "@/assets/images/Comment";
import { HeartIcon } from "@/assets/images/HeathIcon";

import { router } from "expo-router";
import { addLike, removeLike } from "@/api/post";
import { getItem } from "@/helpers/asyncStorage";
import AvatarIcon from "@/assets/images/userIcon";

interface CommentType {
  _id: string;
  content: string;
}

interface PostProps {
  id: string;
  imageUrl: string;
  description: string;
  username: string;
  comments: CommentType[];
  profilePicture: string;
  likes: string[];
}

const Post: FC<PostProps> = ({
  id,
  username,
  imageUrl,
  description,
  comments: commentsFromBack,
  profilePicture,
  userId: postUserId,
  likes: likesFromBack
}) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [likes, setLikes] = useState(likesFromBack.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<CommentType[]>(commentsFromBack);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [userId, setUserId] = useState('');

  const handleLike = async () => {
    if (isLiked) {
      await removeLike(id);
      setLikes(likes - 1);
    } else {
      await addLike(id);
      setLikes(likes + 1);
    }

    setIsLiked(!isLiked);
  };

  const isLikedByUser = async () => {
    const user = await getItem('user');

    if (user) {
      setUserId(user._id);
      const isLikedByUser = likesFromBack.includes(user._id);

      setIsLiked(isLikedByUser);
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const addedComment = await addComment(id, newComment);

      setComments([...comments, addedComment]);
      setNewComment("");
      setShowCommentInput(false);
    }
  };

  const handleGoToProfile = () => {
    router.push(`/profile/${postUserId}`);
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(id, commentId);
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    isLikedByUser();
  }, []);

  return (
    <View style={styles.post}>
      <TouchableOpacity style={styles.header} onPress={handleGoToProfile}>
        <AvatarIcon style={styles.avatar} color='black' customUrl={profilePicture} otherProfile />
        <Text style={styles.username}>{username}</Text>
      </TouchableOpacity>

      <Image style={styles.postImage} source={{ uri: `${API_URL}/${imageUrl}` }} />

      <View style={styles.content}>
        <View style={styles.actions}>
          <View style={styles.hearthIcon}>
            <TouchableOpacity onPress={handleLike}>
              <HeartIcon filled={isLiked} />
            </TouchableOpacity>
            <Text style={styles.hearthFont}>
              {likes}
            </Text>
          </View>
          <View style={styles.hearthIcon}>
            <TouchableOpacity onPress={toggleShowComments}>
              <Comment />
            </TouchableOpacity>
            <Text style={styles.hearthFont}>
              {comments.length}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          <Text style={styles.bold}>{username} </Text>
          <Text>{description}</Text>
        </Text>

        {showComments && (
          <>
            <FlatList
              data={comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <View style={styles.comment}>
                    <Text style={styles.bold}>{item.user.username} </Text>
                    <Text>{item.content}</Text>
                  </View>
                  {
                    item.user._id === userId && (
                      <TouchableOpacity onPress={() => handleDeleteComment(item._id)}>
                        <Text style={styles.deleteComment}>🗑️</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )}
            />
            <View style={styles.addComment}>
              <TextInput
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Agregar un comentario..."
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text style={styles.submitComment}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    width: "100%",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 400,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    paddingBottom: 10,
    gap: 10,
  },
  actionText: {
    fontSize: 24,
  },
  likes: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  deleteComment: {
    color: "red",
  },
  addComment: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  submitComment: {
    color: "#007BFF",
  },
  hearthIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hearthFont: {
    fontSize: 16,
  }
});

export default Post;
