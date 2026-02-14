
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function ApiKeyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);

  const validateAndSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API Key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));

      if (apiKey.length < 20) {
        setError('Invalid API Key format');
        setLoading(false);
        return;
      }

      await SecureStore.setItemAsync('gemini_api_key', apiKey.trim());
      router.replace('/(tabs)');
      
    } catch (e) {
      setError('Failed to save API Key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'white' }}
    >
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
          
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <View style={{ width: 64, height: 64, backgroundColor: '#EFF6FF', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Ionicons name="key" size={32} color="#2563EB" />
              </View>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' }}>Welcome!</Text>
              <Text style={{ color: '#6B7280', textAlign: 'center', paddingHorizontal: 16, fontSize: 15, lineHeight: 22 }}>
                  To start generating exam questions, please enter your Google Gemini API Key.
              </Text>
          </View>

          <View style={{ gap: 16 }}>
              <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>API Key</Text>
                  <View style={{ position: 'relative', justifyContent: 'center' }}>
                      <TextInput
                          style={{ 
                              backgroundColor: '#F9FAFB', 
                              borderWidth: 1, 
                              borderColor: error ? '#EF4444' : '#E5E7EB', 
                              borderRadius: 16, 
                              padding: 16, 
                              paddingRight: 50,
                              fontSize: 16,
                              color: '#111827'
                          }}
                          placeholder="Paste AIzaS..."
                          value={apiKey}
                          onChangeText={setApiKey}
                          autoCapitalize="none"
                          autoCorrect={false}
                          secureTextEntry={!showKey}
                      />
                      <TouchableOpacity 
                          onPress={() => setShowKey(!showKey)}
                          style={{ position: 'absolute', right: 16 }}
                      >
                          <Ionicons name={showKey ? "eye-off" : "eye"} size={22} color="#9CA3AF" />
                      </TouchableOpacity>
                  </View>
                  {error ? <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{error}</Text> : null}
              </View>

              <TouchableOpacity 
                  onPress={validateAndSave}
                  disabled={loading}
                  style={{ 
                      marginTop: 16, 
                      backgroundColor: '#111827', 
                      paddingVertical: 18, 
                      borderRadius: 16, 
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5
                  }}
              >
                  {loading ? (
                      <ActivityIndicator color="white" />
                  ) : (
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Start Learning</Text>
                  )}
              </TouchableOpacity>

              <TouchableOpacity 
                  onPress={() => router.push('/how-to-get-key')}
                  style={{ marginTop: 8 }}
              >
                  <Text style={{ color: '#2563EB', textAlign: 'center', fontSize: 14, fontWeight: '500' }}>Where do I find my API Key?</Text>
              </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
