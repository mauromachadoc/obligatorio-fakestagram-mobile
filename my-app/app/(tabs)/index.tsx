import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { feed } from '../../api/post';
import Post from '@/components/Post';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    const getFeed = await feed();
    setPosts(getFeed);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

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
