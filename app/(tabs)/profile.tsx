import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { getQuestions } from '@/services/DatabaseService';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const key = await SecureStore.getItemAsync('gemini_api_key');
    if (key) setApiKey(key);
    
    const questions = await getQuestions();
    setSavedCount(questions?.length || 0);
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    setSaving(true);
    await SecureStore.setItemAsync('gemini_api_key', apiKey.trim());
    setSaving(false);
    Alert.alert('Success', 'API Key updated successfully');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'white' }}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
            
            {/* Profile Header */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View style={{ width: 80, height: 80, backgroundColor: '#EFF6FF', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Ionicons name="person" size={40} color="#2563EB" />
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>My Study Profile</Text>
                <Text style={{ color: '#6B7280', marginTop: 4 }}>Independent Practice Mode</Text>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                <View style={{ flex: 1, backgroundColor: '#F0FDF4', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#DCFCE7' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#16A34A', textTransform: 'uppercase' }}>Stored</Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#14532D', marginTop: 4 }}>{savedCount}</Text>
                    <Text style={{ fontSize: 12, color: '#16A34A', marginTop: 2 }}>Questions</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#EFF6FF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#DBEAFE' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase' }}>Level</Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginTop: 4 }}>Pro</Text>
                    <Text style={{ fontSize: 12, color: '#2563EB', marginTop: 2 }}>Unlimited</Text>
                </View>
            </View>

            {/* API Key Management */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 12 }}>Gemini API Settings</Text>
                <View style={{ backgroundColor: '#F9FAFB', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                        Update your Google Gemini API key to keep generating questions.
                    </Text>
                    
                    <View style={{ position: 'relative', justifyContent: 'center' }}>
                        <TextInput
                            style={{ 
                                backgroundColor: 'white', 
                                borderWidth: 1, 
                                borderColor: '#E5E7EB', 
                                borderRadius: 16, 
                                padding: 16, 
                                paddingRight: 50,
                                fontSize: 16,
                                color: '#111827'
                            }}
                            placeholder="Enter your API Key..."
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

                    <TouchableOpacity 
                        onPress={handleSaveKey}
                        disabled={saving}
                        style={{ 
                            marginTop: 16, 
                            backgroundColor: '#111827', 
                            paddingVertical: 16, 
                            borderRadius: 16, 
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Update API Key</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Support Links */}
            <View style={{ gap: 12 }}>
                <TouchableOpacity 
                    onPress={() => router.push('/how-to-get-key')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 }}
                >
                    <Ionicons name="help-circle-outline" size={24} color="#374151" />
                    <Text style={{ marginLeft: 12, flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' }}>How to get API Key?</Text>
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
                
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 }}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#374151" />
                    <Text style={{ marginLeft: 12, flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' }}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
            </View>

            {/* Developer & App Info */}
            <View style={{ marginTop: 32, padding: 24, backgroundColor: '#111827', borderRadius: 28 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="information-circle-outline" size={24} color="white" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>Developer & App Info</Text>
                </View>

                <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Name</Text>
                        <Text style={{ color: 'white', fontWeight: '500' }}>MD. ABDUL MANNAN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Phone</Text>
                        <Text style={{ color: 'white', fontWeight: '500' }}>+880 1581263462</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Education</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 20 }}>
                            <Text style={{ color: 'white', fontWeight: '500', textAlign: 'right' }}>Honours in Economics</Text>
                            <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'right' }}>Chandpur Govt. College (Ongoing)</Text>
                        </View>
                    </View>
                    <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16, marginTop: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>App Version</Text>
                            <Text style={{ color: 'white', fontWeight: '500' }}>1.0.0 (Production)</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Made with ❤️</Text>
            </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
