
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { initDatabase } from "@/services/DatabaseService";
import * as SecureStore from 'expo-secure-store';

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await initDatabase();
      setIsReady(true);
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const checkAuth = async () => {
      try {
        const apiKey = await SecureStore.getItemAsync('gemini_api_key');
        const inOnboarding = segments[0] === '(onboarding)';
        
        // Only redirect to onboarding if no API key is found
        if (!apiKey && !inOnboarding) {
          router.replace('/(onboarding)/apikey');
        } else if (apiKey && inOnboarding) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error("Setup check failed", e);
      }
    };

    checkAuth();
  }, [isReady, segments[0]]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)/apikey" />
        <Stack.Screen name="question" />
        <Stack.Screen name="how-to-get-key" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
