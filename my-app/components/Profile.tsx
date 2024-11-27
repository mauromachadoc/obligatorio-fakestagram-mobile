import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, Alert, Pressable } from 'react-native';
import { addFriend, profileById, removeFriend, updateProfile } from '@/api/user'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { getItem, removeItem } from '@/helpers/asyncStorage';
import { useGlobalSearchParams, useNavigation, useFocusEffect, router } from 'expo-router';
import { useData } from '@/contexts/userData';
import ProfileButtons from '@/components/ProfileButtons';
import AvatarIcon from '@/assets/images/userIcon';
import { Ionicons } from '@expo/vector-icons';
import { Post, User } from '@/types';

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState<{
    user: User,
    posts: Post[],
  }>({
    user: {
      _id: '',
      username: '',
      profilePicture: '',
      email: '',
      createdAt: '',
      friends: [],
    },
    posts: [],
  });

  const {
    id,
  }: {
    id: string
  } = useGlobalSearchParams()

  const navigation = useNavigation();

  const { setData } = useData();

  const [userAdded, setUserAdded] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchProfile = async () => {
    const user = await getItem('user');

    if (!user) {
      router.navigate('/login');
      return;
    }

    const profile = await profileById(id || user?._id);

    setProfileInfo(profile);
    setUserAdded(profile.user.friends.find((friend: User) => friend._id === user._id));
    setData({
      title: profile.user.username,
    })
    navigation.setOptions({
      title: profile.user.username,
    })
  };

  const handleEditProfile = async () => {
    router.navigate('/editProfile');
  };

  const handleLogout = async () => {
    await removeItem('user');
    router.navigate('/login');
  }

  const handleAddUser = async () => {
    try {
      const user = await getItem('user');

      if (userAdded) {
        await removeFriend(profileInfo.user._id);

        setProfileInfo(prev => ({
          ...prev,
          user: {
            ...prev.user,
            friends: prev.user.friends.filter(friend => friend._id !== user._id)
          }
        }));
      } else {
        await addFriend(profileInfo.user._id);

        setProfileInfo((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            friends: [...prev.user.friends, user]
          }
        }));
      }

      setUserAdded((prev) => !prev);
    } catch (error) {
      console.error("Error al agregar amigo", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [id])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.avatar}>
          <AvatarIcon width={80} height={80} color='black' customUrl={profileInfo.user.profilePicture} otherProfile={!!id} />
        </View>

        <View style={styles.info}>
          <Text style={styles.meta}>
            {profileInfo.posts.length} posts | {profileInfo.user.friends.length} friends
          </Text>
          <ProfileButtons
            profileId={id}
            handleAddUser={handleAddUser}
            userAdded={userAdded}
            handleEditProfile={handleEditProfile}
          />
          {
            !id && (
              <Pressable onPress={handleLogout}>
                <Ionicons name="log-out" size={24} color="black" />
              </Pressable>
            )
          }
        </View>

      </View>
      <FlatList
        data={profileInfo.posts}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => {
          return (
            <View style={styles.postContainer}>
              <Image source={{ uri: `${API_URL}/${item.imageUrl}` }} style={styles.postImage} />
            </View>
          )
        }}
        style={styles.gallery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meta: {
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gallery: {
    marginTop: 16,
  },
  postContainer: {
    flex: 1 / 3,
    padding: 4,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
});

export default Profile;
