import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const Index: React.FC = () => {

    const isAuthenticated = false;
    if (!isAuthenticated) {
        router.push({ pathname: '/login' });
    }

    return (
        <View>
            <Text>Welcome to the App!</Text>
        </View>
    );
};

export default Index;