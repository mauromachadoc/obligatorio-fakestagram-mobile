import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, TouchableOpacity } from 'react-native';
import { DataProvider } from '@/contexts/userData';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DataProvider>
        <Stack screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="createPost"
            options={({ navigation }) => ({
              headerBackTitle: 'Cerrar',
              title: 'Crear Post',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                  <Text style={{ marginLeft: 10, color: '#007AFF', fontSize: 20 }}>Subir Post</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="editProfile"
            options={({ navigation }) => ({
              headerBackTitle: 'Cerrar',
              title: 'Editar Perfil',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                  <Text style={{ marginLeft: 10, color: '#007AFF', fontSize: 16 }}>Editar Perfil</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack>
      </DataProvider>
    </ThemeProvider>
  );
}
