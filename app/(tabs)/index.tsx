
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SUBJECTS, QUESTION_TYPES } from '@/constants/Subjects';

// Helper to get icon for subject
const getSubjectIcon = (id: string): keyof typeof Ionicons.glyphMap => {
  switch(id) {
    case 'economics': return 'cash-outline';
    case 'math': return 'calculator-outline';
    case 'history': return 'hourglass-outline';
    default: return 'school-outline';
  }
};

export default function SelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const currentSubjectObj = SUBJECTS.find(s => s.id === selectedSubject);
  // @ts-ignore
  const currentPaperObj = currentSubjectObj?.papers?.find(p => p.id === selectedPaper);
  
  const handleGenerate = () => {
    if (!selectedSubject || !selectedPaper || !selectedTopic || !selectedType) {
      Alert.alert('Resume Practice', 'Please complete all selections to start.');
      return;
    }
    
    router.push({
      pathname: '/question',
      params: { 
        subjectId: selectedSubject, 
        topicId: `${selectedPaper} - ${selectedTopic}`, // Pass combined context
        typeId: selectedType
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View className="mb-8 mt-2">
            <Text className="text-gray-500 font-medium text-base mb-1">Ready to learn?</Text>
            <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Practice Dashboard</Text>
        </View>

        {/* Step 1: Subject Cards */}
        <View className="mb-8">
            <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center mr-3 shadow-md shadow-blue-500/30">
                    <Text className="text-white font-bold text-sm">1</Text>
                </View>
                <Text className="text-xl font-bold text-gray-800">Choose a Subject</Text>
            </View>
            
            <View className="flex-row flex-wrap gap-4">
                {SUBJECTS.map((subject) => {
                    const isSelected = selectedSubject === subject.id;
                    const iconName = getSubjectIcon(subject.id);
                    
                    return (
                        <TouchableOpacity
                            key={subject.id}
                            onPress={() => {
                                setSelectedSubject(subject.id);
                                setSelectedPaper(null); 
                                setSelectedTopic(null);
                            }}
                            className={`w-full sm:w-[48%] rounded-2xl p-5 border-2 transition-all duration-200 shadow-sm ${
                                isSelected 
                                ? 'bg-white border-blue-600 shadow-blue-100' 
                                : 'bg-white border-transparent'
                            }`}
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className={`p-3 rounded-xl ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Ionicons 
                                        name={iconName} 
                                        size={24} 
                                        color={isSelected ? '#2563EB' : '#6B7280'} 
                                    />
                                </View>
                                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#2563EB" />}
                            </View>
                            <Text className={`mt-4 font-bold text-lg ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                {subject.name}
                            </Text>
                            {/* @ts-ignore */}
                            <Text className="text-gray-500 text-xs mt-1">{(subject.papers?.length || 0)} Papers Available</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>

        {/* Step 2: Paper Selection (Grid) */}
        {selectedSubject && currentSubjectObj && (
            <View className="mb-8"> 
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center mr-3 shadow-md shadow-indigo-500/30">
                        <Text className="text-white font-bold text-sm">2</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">Select Paper / Course</Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                    {/* @ts-ignore */}
                    {currentSubjectObj.papers?.map((paper) => {
                         const isSelected = selectedPaper === paper.id;
                         return (
                            <TouchableOpacity
                                key={paper.id}
                                onPress={() => {
                                    setSelectedPaper(paper.id);
                                    setSelectedTopic(null);
                                }}
                                className={`px-4 py-3 rounded-xl border w-full ${
                                    isSelected 
                                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' 
                                    : 'bg-white border-gray-200 shadow-sm'
                                }`}
                            >
                                <Text className={`font-semibold ${
                                    isSelected ? 'text-white' : 'text-gray-700'
                                }`}>
                                    {paper.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        )}

        {/* Step 3: Chapter/Topic Selection */}
        {selectedPaper && currentPaperObj && (
             <View className="mb-8"> 
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-teal-600 items-center justify-center mr-3 shadow-md shadow-teal-500/30">
                        <Text className="text-white font-bold text-sm">3</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">Select Chapter</Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                    {/* @ts-ignore */}
                    {currentPaperObj.chapters?.map((chapter) => {
                         const isSelected = selectedTopic === chapter;
                         return (
                            <TouchableOpacity
                                key={chapter}
                                onPress={() => setSelectedTopic(chapter)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: isSelected ? '#0D9488' : '#E5E7EB', // teal-600 : gray-200
                                    backgroundColor: isSelected ? '#0D9488' : 'white',
                                    marginBottom: 8
                                }}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: isSelected ? 'white' : '#374151' // gray-700
                                }}>
                                    {chapter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        )}

        {/* Step 4: Question Type */}
        {selectedTopic && (
            <View className="mb-8">
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-purple-600 items-center justify-center mr-3 shadow-md shadow-purple-500/30">
                        <Text className="text-white font-bold text-sm">4</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">Question Format</Text>
                </View>

                <View className="bg-white p-2 rounded-2xl border border-gray-100 flex-row flex-wrap gap-2">
                    {QUESTION_TYPES.map((type) => {
                        const isSelected = selectedType === type.id;
                        return (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => setSelectedType(type.id)}
                                style={{
                                    flex: 1,
                                    minWidth: '45%',
                                    paddingVertical: 12,
                                    paddingHorizontal: 8,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: isSelected ? '#D8B4FE' : 'transparent', // purple-200
                                    backgroundColor: isSelected ? '#FAF5FF' : 'transparent', // purple-50
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons 
                                        name={isSelected ? "radio-button-on" : "radio-button-off"} 
                                        size={18} 
                                        color={isSelected ? "#9333EA" : "#9CA3AF"} 
                                    />
                                    <Text style={{
                                        marginLeft: 8,
                                        fontWeight: '500',
                                        color: isSelected ? '#7E22CE' : '#4B5563' // purple-700 : gray-600
                                    }}>
                                        {type.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        )}

      </ScrollView>

      {/* Floating Action Button */}
      {selectedSubject && selectedTopic && selectedType && (
        <View className="absolute bottom-28 left-6 right-6">
            <TouchableOpacity 
                onPress={handleGenerate}
                className="bg-gray-900 rounded-2xl py-5 flex-row justify-center items-center shadow-2xl shadow-gray-900/40 active:scale-95 transform transition-transform"
                style={{ elevation: 8 }}
            >
                <Ionicons name="sparkles" size={24} color="#FFD700" style={{ marginRight: 12 }} />
                <Text className="text-white font-bold text-xl tracking-wide">Generate Question</Text>
                <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 12, opacity: 0.6 }} />
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
