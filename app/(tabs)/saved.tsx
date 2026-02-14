
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { getQuestions, deleteQuestion } from '@/services/DatabaseService';
import MathRenderer from '@/components/MathRenderer';

export default function SavedQuestionsScreen() {
  const insets = useSafeAreaInsets();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'question' | 'answer'>('question');

  useFocusEffect(
    useCallback(() => {
        loadQuestions();
    }, [])
  );

  const loadQuestions = async () => {
      setLoading(true);
      const data = await getQuestions();
      setQuestions(data as any[]);
      setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteQuestion(id);
    loadQuestions();
    setSelectedQuestion(null);
  };

  const openQuestion = (question: any) => {
      setSelectedQuestion(question);
      setViewMode('question');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        className="mb-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center" 
        onPress={() => openQuestion(item)}
    >
        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Ionicons name="document-text" size={20} color="#2563EB" />
        </View>
        <View className="flex-1">
            <Text className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">{item.topic}</Text>
            <Text className="text-gray-900 font-semibold" numberOfLines={1}>
                {item.question.replace(/\$|\*\*|_/g, '').trim() || 'Question'}
            </Text>
            <Text className="text-[10px] text-gray-400 mt-1">
                {item.type} • {new Date(item.date).toLocaleDateString()}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          <Text className="text-2xl font-bold text-gray-900">Saved Stash</Text>
          <Text className="text-gray-500 text-sm mt-1">Your collection of AI generated questions</Text>
      </View>
      
      {loading ? (
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator color="#2563EB" />
          </View>
      ) : (
          <FlatList
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            data={questions}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
                <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="bookmark-outline" size={32} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-900 font-bold text-lg">Empty Stash</Text>
                    <Text className="text-gray-400 mt-2 text-center px-10">
                        Questions you save while studying will appear here.
                    </Text>
                </View>
            }
          />
      )}

      {/* Detail Modal */}
      <Modal
        visible={!!selectedQuestion}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedQuestion(null)}
      >
          <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
              {/* Modal Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                  <TouchableOpacity onPress={() => setSelectedQuestion(null)}>
                      <Ionicons name="close" size={28} color="black" />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#111827' }}>{selectedQuestion?.topic || 'Details'}</Text>
                  <TouchableOpacity onPress={() => handleDelete(selectedQuestion?.id)}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
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
                    onPress={() => setViewMode('answer')}
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

              {/* Content Area - Takes remaining screen space */}
              <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: 20 }}>
                  {viewMode === 'question' ? (
                      <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 10 }}>The Question</Text>
                          <View style={{ flex: 1 }}>
                              {selectedQuestion?.math ? (
                                  <MathRenderer content={selectedQuestion.question} fullHeight={true} />
                              ) : (
                                  <ScrollView>
                                      <Text style={{ fontSize: 20, color: '#111827', lineHeight: 30, fontWeight: '500' }}>
                                          {selectedQuestion?.question}
                                      </Text>
                                  </ScrollView>
                              )}
                          </View>
                      </View>
                  ) : (
                      <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 10 }}>The Solution</Text>
                          <View style={{ flex: 1 }}>
                              {selectedQuestion?.math ? (
                                  <MathRenderer content={selectedQuestion.answer} fullHeight={true} />
                              ) : (
                                  <ScrollView>
                                      <Text style={{ fontSize: 20, color: '#111827', lineHeight: 30, fontWeight: '500' }}>
                                          {selectedQuestion?.answer}
                                      </Text>
                                  </ScrollView>
                              )}
                          </View>
                      </View>
                  )}
              </View>
          </View>
      </Modal>
    </View>
  );
}
