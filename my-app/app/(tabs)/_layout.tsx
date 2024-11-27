import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withDecay } from 'react-native-reanimated';
import Header from '@/components/Header';
import { HomeIcon } from '@/assets/images/Home';
import AvatarIcon from '@/assets/images/userIcon';
import { getItem } from '@/helpers/asyncStorage';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            paddingBottom: 0,
            height: 50,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AvatarIcon width={30} height={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
