import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { feed } from '../../api/post';
import Post from '@/components/Post';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { removeItem } from '@/helpers/asyncStorage';
import { useData } from '@/contexts/userData';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);

  const { setData } = useData();

  const fetchFeed = async () => {
    const getFeed = await feed();

    setPosts(getFeed);
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
      setData({
        title: 'Inicio',
      })
    }, [])
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post
            id={item._id}
            imageUrl={item.imageUrl}
            description={item.caption}
            username={item.user.username}
            userId={item.user._id}
            comments={item.comments}
            likes={item.likes}
            profilePicture={item.user.profilePicture}
          />
        )}
        keyExtractor={(item) => item._id}
        style={styles.posts}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  posts: {
    flex: 1,
    width: '100%',
  },
});
