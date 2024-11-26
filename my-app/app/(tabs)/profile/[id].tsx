import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { addFriend, profileById, removeFriend, updateProfile } from '@/api/user'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { getItem } from '@/helpers/asyncStorage';
import { useGlobalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { useData } from '@/contexts/userData';

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState({
    user: {
      id: '',
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
  } = useGlobalSearchParams()

  const navigation = useNavigation();

  const { setData } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userAdded, setUserAdded] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchProfile = async () => {
    const user = await getItem('user');

    const profile = await profileById(id || user?._id);

    setProfileInfo(profile);
    setUsername(profile.user.username);
    setProfilePicture(profile.user.profilePicture);
    setUserAdded(profile.user.friends.find(friend => friend._id === user._id));
    setData({
      title: profile.user.username,
    })
  };

  const handleEditProfile = async () => {
    try {
      const user = localStorage.getItem('user');
      await updateProfile(JSON.parse(user)._id, { username, profilePicture });
      setProfileInfo((prev) => ({
        ...prev,
        user: { ...prev.user, username, profilePicture },
      }));
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil');
    }
  };

  const handleAddUser = async () => {
    try {
      if (userAdded) {
        await removeFriend(user._id);

        setProfileInfo(prev => ({
          ...prev,
          user: {
            ...prev.user,
            friends: prev.user.friends.filter(friend => friend._id !== user._id)
          }
        }));
      } else {
        await addFriend(user._id);

        setProfileInfo(prev => ({
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

      return () => {
        navigation.setParams({ id: '' });
        setProfileInfo({
          user: {
            id: '',
            username: '',
            profilePicture: '',
            email: '',
            createdAt: '',
            friends: [],
          },
          posts: [],
        });
      };
    }, [id])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileInfo.user.profilePicture }} style={styles.avatar} />
        <View style={styles.info}>
          {isEditing ? (
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nuevo nombre de usuario"
              style={styles.input}
            />
          ) : (
            <Text style={styles.username}>{profileInfo.user.username}</Text>
          )}
          <Text style={styles.meta}>
            {profileInfo.posts.length} posts | {profileInfo.user.friends.length} friends
          </Text>
          {isEditing && (
            <TextInput
              value={profilePicture}
              onChangeText={setProfilePicture}
              placeholder="URL de la nueva foto de perfil"
              style={styles.input}
            />
          )}
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
    flex: 1,
    padding: 4,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
});

export default Profile;
