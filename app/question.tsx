
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Switch, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Share, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import MathRenderer from '@/components/MathRenderer';
import { generateQuestion } from '@/services/GeminiService';
import { saveQuestion } from '@/services/DatabaseService'; 

export default function QuestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const { subjectId, topicId, typeId } = params;

  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const [saved, setSaved] = useState(false);
  
  // Timer State
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1); // Default 60s
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    fetchQuestion();
    return () => stopTimer();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setShowAnswer(false);
    setSaved(false);
    stopTimer();
    
    try {
      const apiKey = await SecureStore.getItemAsync('gemini_api_key');
      if (!apiKey) {
        Alert.alert('Missing API Key', 'Please go to onboarding to set your API Key.');
        router.replace('/(onboarding)/apikey');
        return;
      }
      
      let data;
      try {
        data = await generateQuestion(apiKey, subjectId as string, topicId as string, typeId as string);
      } catch (err) {
         console.log("Gemini generation failed, using fallback", err);
         data = {
             question: "যখন মূল্য $10 থেকে $12 বৃদ্ধি পায় এবং চাহিদার পরিমাণ 100 থেকে 80 একক হ্রাস পায়, তখন **চাহিদার মূল্য স্থিতিস্থাপকতা** (price elasticity of demand) নির্ণয় করুন। সূত্র ব্যবহার করুন: $$E_d = \\frac{\\% \\Delta Q_d}{\\% \\Delta P}$$",
             answer: "**ধাপ ১:** পরিমাণের শতকরা পরিবর্তন: $\\frac{80-100}{100} \\times 100 = -20\\%$\n\n**ধাপ ২:** মূল্যের শতকরা পরিবর্তন: $\\frac{12-10}{10} \\times 100 = 20\\%$\n\n**ধাপ ৩:** স্থিতিস্থাপকতা নির্ণয়: $E_d = \\frac{-20\\%}{20\\%} = -1$\n\n**সিদ্ধান্ত:** চাহিদার মূল্য স্থিতিস্থাপকতা $-1$, যা **একক স্থিতিস্থাপক চাহিদা** নির্দেশ করে। মূল্যের 1% বৃদ্ধি চাহিদার পরিমাণে 1% হ্রাস ঘটায়।",
             math: true
         };
      }

       const finalData = (data && data.question) ? data : {
           question: "What is the primary objective of **Macroeconomics**?",
           answer: "Macroeconomics aims to understand the behavior of the economy as a whole, focusing on variables like GDP, inflation, and unemployment.",
           math: false
       };

       setQuestionData(finalData);
       
       if (timerEnabled) {
           setTimeLeft(1);
           setTimerRunning(true);
           startTimer();
       }

    } catch (error: any) {
      console.error("Fetch Error:", error);
      
      const isKeyError = error.message?.includes("API_KEY_INVALID") || 
                         error.message?.includes("API_KEY_EXPIRED") ||
                         error.message?.includes("forbidden") ||
                         error.message?.includes("403");

      if (isKeyError) {
        Alert.alert(
          'API Key Error', 
          'Your Gemini API Key seems to be invalid or expired. Would you like to update it now?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Update Key', onPress: () => router.push('/(onboarding)/apikey') }
          ]
        );
      } else {
        Alert.alert('Status', 'Failed to generate question. Using sample question instead.');
      }
      
      setQuestionData({
          question: "**GDP (Gross Domestic Product)** কী এবং ব্যয় পদ্ধতি (expenditure approach) ব্যবহার করে এটি কীভাবে গণনা করা হয়? সূত্র লিখুন।",
          answer: "**GDP** হলো একটি নির্দিষ্ট সময়ে একটি দেশের সীমানার মধ্যে উৎপাদিত সকল চূড়ান্ত পণ্য ও সেবার মোট আর্থিক মূল্য।\n\n**ব্যয় পদ্ধতির সূত্র:**\n$$GDP = C + I + G + (X - M)$$\n\nযেখানে:\n- $C$ = ভোক্তা ব্যয় (Consumer spending)\n- $I$ = বিনিয়োগ (Investment)\n- $G$ = সরকারি ব্যয় (Government spending)\n- $X$ = রপ্তানি (Exports)\n- $M$ = আমদানি (Imports)\n\nএই পদ্ধতি অর্থনীতিতে সকল ব্যয়ের সমষ্টি নির্ণয় করে।",
          math: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
      if (!questionData || saved) return;
      
      await saveQuestion({
           topic: topicId as string,
           question: questionData.question,
           answer: questionData.answer,
           type: typeId as string,
           math: questionData.math,
           options: questionData.options
      });
      setSaved(true);
      Alert.alert("Saved", "Question saved to your collection.");
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
       
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    setTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShowAnswer = () => {
    if (timerEnabled && timeLeft > 0) {
        Alert.alert('Time Remaining', 'Answer is locked until timer ends!');
        return;
    }
    setShowAnswer(true);
    stopTimer();
  };
  const [viewMode, setViewMode] = useState<'question' | 'answer'>('question');

  const onShowAnswer = () => {
    if (timerEnabled && timeLeft > 0) {
        Alert.alert('Time Remaining', 'Answer is locked until timer ends!');
        return;
    }
    setViewMode('answer');
    stopTimer();
  };

  if (loading) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontWeight: '500' }}>Generating Question...</Text>
          </View>
      );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
        {/* Header with Timer Control */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="timer-outline" size={20} color={timerEnabled ? '#2563EB' : 'gray'} />
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', color: timerEnabled ? '#2563EB' : '#9CA3AF' }}>
                    {formatTime(timeLeft)}
                </Text>
                <Switch 
                    value={timerEnabled} 
                    onValueChange={(val) => {
                        setTimerEnabled(val);
                        if (val) {
                            setTimerRunning(true);
                            startTimer();
                        } else {
                            stopTimer();
                        }
                    }}
                    trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                    thumbColor={timerEnabled ? '#2563EB' : '#F3F4F6'}
                />
            </View>

            <TouchableOpacity onPress={handleSave} disabled={saved}>
                <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={26} color={saved ? "#2563EB" : "black"} />
            </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View style={{ flexDirection: 'row', padding: 4, backgroundColor: '#f9fafb', marginHorizontal: 24, marginTop: 20, marginBottom: 10, borderRadius: 16 }}>
            <TouchableOpacity 
                onPress={() => setViewMode('question')}
                style={{ 
                    flex: 1, 
                    paddingVertical: 12, 
                    alignItems: 'center', 
                    borderRadius: 12, 
                    backgroundColor: viewMode === 'question' ? 'white' : 'transparent',
                    shadowColor: viewMode === 'question' ? '#000' : 'transparent',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: viewMode === 'question' ? 2 : 0
                }}
            >
                <Text style={{ fontWeight: 'bold', color: viewMode === 'question' ? '#2563EB' : '#9CA3AF' }}>Question</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={onShowAnswer}
                style={{ 
                    flex: 1, 
                    paddingVertical: 12, 
                    alignItems: 'center', 
                    borderRadius: 12, 
                    backgroundColor: viewMode === 'answer' ? 'white' : 'transparent',
                    shadowColor: viewMode === 'answer' ? '#000' : 'transparent',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: viewMode === 'answer' ? 2 : 0
                }}
            >
                <Text style={{ fontWeight: 'bold', color: viewMode === 'answer' ? '#16a34a' : '#9CA3AF' }}>Answer</Text>
            </TouchableOpacity>
        </View>

        {/* Content Area - Full Screen & High Visibility */}
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
            {viewMode === 'question' ? (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 10 }}>The Question</Text>
                    <View style={{ flex: 1 }}>
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            {questionData?.math ? (
                                <MathRenderer content={questionData.question} fullHeight={true} />
                            ) : (
                                <Text style={{ fontSize: 22, color: '#111827', lineHeight: 32, fontWeight: '500', marginBottom: 20 }}>
                                    {questionData?.question}
                                </Text>
                            )}
                            
                            {/* MCQ Options */}
                            {questionData?.options && questionData.options.length > 0 && (
                                <View style={{ gap: 12, marginTop: 10, paddingBottom: 20 }}>
                                    {questionData.options.map((opt: string, idx: number) => (
                                        <View 
                                            key={idx} 
                                            style={{ 
                                                backgroundColor: '#F9FAFB', 
                                                padding: 16, 
                                                borderRadius: 16, 
                                                borderWidth: 1, 
                                                borderColor: '#E5E7EB',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#D1D5DB' }}>
                                                <Text style={{ fontWeight: 'bold', color: '#4B5563' }}>{String.fromCharCode(65 + idx)}</Text>
                                            </View>
                                            <Text style={{ fontSize: 18, color: '#374151', flex: 1 }}>{opt}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 10 }}>The Solution</Text>
                    <View style={{ flex: 1 }}>
                        {questionData?.math ? (
                            <MathRenderer content={questionData.answer} fullHeight={true} />
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{ fontSize: 22, color: '#111827', lineHeight: 32, fontWeight: '500' }}>
                                    {questionData?.answer}
                                </Text>
                            </ScrollView>
                        )}
                    </View>
                </View>
            )}
        </View>

        {/* Action Buttons */}
        <View style={{ padding: 24, paddingBottom: insets.bottom + 10, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
                onPress={() => Share.share({ message: `${questionData?.question}\n\nAnswer: ${questionData?.answer}` })}
                style={{ flex: 1, backgroundColor: '#f9fafb', paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' }}
            >
                <Ionicons name="share-social-outline" size={20} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => {
                    setViewMode('question');
                    fetchQuestion();
                }}
                style={{ 
                    flex: 4,
                    backgroundColor: '#111827', 
                    paddingVertical: 18, 
                    borderRadius: 20, 
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 10,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Next Question</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  );
}
