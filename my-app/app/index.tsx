import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getUser = async () => {
    const user = await AsyncStorage.getItem('user');

    if (!user) {
      router.push({ pathname: '/login' });
    } else {
      router.push({ pathname: '/(tabs)' });
    }
  }

  useEffect(() => {
    if (isMounted) {
      getUser();
    }
  }, [isMounted]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </SafeAreaView>
  )
}
