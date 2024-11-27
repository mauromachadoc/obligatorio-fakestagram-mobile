import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface NotificationProps {
  profilePic: string | null;
  type: string;
  createdAt: string;
  userFrom: {
    username: string;
    _id: string;
  };
  postId?: {
    imageUrl: string;
  }
}

const Notification: React.FC<NotificationProps> = ({ profilePic, type, createdAt, userFrom, postId }) => {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const notificationsType = {
    POST_COMMENT: 'comment',
    POST_LIKE: 'like',
    USER_FOLLOW: 'follow',
  };

  const message = {
    [notificationsType.POST_COMMENT]: 'comentó en tu post',
    [notificationsType.POST_LIKE]: 'le gustó tu post',
    [notificationsType.USER_FOLLOW]: 'te ha seguido',
  };

  const navigateToProfile = () => {
    router.push(`/profile/${userFrom._id}`);
  };



  return (
    <TouchableOpacity style={styles.notification} onPress={navigateToProfile}>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      ) : (
        <FontAwesome name="user-circle" size={40} color="black" style={styles.profilePicFallback} />
      )}
      <View style={styles.content}>
        <Text style={styles.message}>
          <Text style={styles.username}>{userFrom.username}</Text> {message[type]}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
      {
        postId && (
          <Image source={{ uri: `${apiUrl}/${postId.imageUrl}` }} style={{ width: 40, height: 40 }} />
        )
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profilePicFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#262626',
  },
  username: {
    fontWeight: 'bold',
    color: '#262626',
  },
  time: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 3,
  },
});

export default Notification;
