import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HowToGetKey() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const steps = [
    {
      title: "1. Google AI Studio",
      desc: "Go to Google AI Studio (aistudio.google.com) and sign in with your Google account.",
      icon: "logo-google",
      link: "https://aistudio.google.com/app/apikey"
    },
    {
      title: "2. Create API Key",
      desc: "Click on 'Get API key' in the sidebar, then click 'Create API key in new project'.",
      icon: "add-circle-outline"
    },
    {
      title: "3. Copy & Paste",
      desc: "Copy the generated key and paste it into the Profile settings in this app.",
      icon: "copy-outline"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16, color: '#111827' }}>Getting your API Key</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View style={{ backgroundColor: '#EFF6FF', padding: 20, borderRadius: 24, marginBottom: 32 }}>
              <Text style={{ color: '#1E40AF', fontSize: 15, lineHeight: 22 }}>
                  Google Gemini allows you to generate questions for free within certain limits. Follow these steps to get your personal key.
              </Text>
          </View>

          {steps.map((step, index) => (
              <View key={index} style={{ marginBottom: 32, flexDirection: 'row', gap: 20 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={step.icon as any} size={24} color="#374151" />
                  </View>
                  <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 }}>{step.title}</Text>
                      <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>{step.desc}</Text>
                      {step.link && (
                          <TouchableOpacity 
                            onPress={() => Linking.openURL(step.link)}
                            style={{ marginTop: 12, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' }}
                          >
                              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Open AI Studio</Text>
                          </TouchableOpacity>
                      )}
                  </View>
              </View>
          ))}

          <View style={{ marginTop: 40, alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB', borderRadius: 24 }}>
              <Ionicons name="shield-checkmark" size={32} color="#10B981" />
              <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#111827' }}>Privacy First</Text>
              <Text style={{ marginTop: 4, color: '#6B7280', textAlign: 'center', fontSize: 13 }}>
                  Your API key is stored only on this device and is never sent to our servers.
              </Text>
          </View>
      </ScrollView>
    </View>
  );
}
