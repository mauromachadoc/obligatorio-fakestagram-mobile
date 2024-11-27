import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Post from '@/components/Post';
import { Post as PostType } from '@/types';
import { feed } from '@/api/post';
import { router, useFocusEffect } from 'expo-router';
import { getItem, removeItem } from '@/helpers/asyncStorage';
import { useData } from '@/contexts/userData';

const HomeScreen = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setData } = useData();


  const fetchFeed = async () => {
    const getFeed = await feed();

    setPosts(getFeed);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const user = getItem('user');

      if (!user) {
        removeItem('user');
        router.navigate('/login')
      }

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
        renderItem={({ item }: { item: PostType }) => (
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
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </GestureHandlerRootView>
  );
};

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

export default HomeScreen;
