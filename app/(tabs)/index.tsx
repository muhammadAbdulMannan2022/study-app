import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SUBJECTS, QUESTION_TYPES } from "@/constants/Subjects";

// Helper to get icon for subject
const getSubjectIcon = (id: string): keyof typeof Ionicons.glyphMap => {
  switch (id) {
    case "economics":
      return "stats-chart-outline";
    case "ict":
      return "laptop-outline";
    default:
      return "school-outline";
  }
};

export default function SelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Custom Selection State
  const [isCustomPaper, setIsCustomPaper] = useState(false);
  const [customPaperText, setCustomPaperText] = useState("");
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicText, setCustomTopicText] = useState("");

  const currentSubjectObj = SUBJECTS.find((s) => s.id === selectedSubject);
  // @ts-ignore
  const currentPaperObj = currentSubjectObj?.papers?.find(
    (p) => p.id === selectedPaper,
  );

  const handleGenerate = () => {
    const finalPaper = isCustomPaper ? customPaperText : currentPaperObj?.name;
    const finalTopic = isCustomTopic ? customTopicText : selectedTopic;

    if (!selectedSubject || !finalPaper || !finalTopic || !selectedType) {
      Alert.alert(
        "Incomplete Selection",
        "Please finish all steps to start generating questions.",
      );
      return;
    }

    router.push({
      pathname: "/question",
      params: {
        subjectId: selectedSubject,
        topicId: `${finalPaper} - ${finalTopic}`,
        typeId: selectedType,
      },
    });
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: insets.top }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Text
            style={{
              color: "#6B7280",
              fontWeight: "500",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Ready to learn?
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: -0.5,
            }}
          >
            Practice Dashboard
          </Text>
        </View>

        {/* Step 1: Subject Cards */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>1</Text>
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
            >
              Choose a Subject
            </Text>
          </View>

          <View style={{ gap: 12 }}>
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
                    setIsCustomPaper(false);
                    setIsCustomTopic(false);
                  }}
                  style={{
                    backgroundColor: "white",
                    padding: 16,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: isSelected ? "#2563EB" : "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: isSelected ? "#2563EB" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isSelected ? 0.1 : 0.05,
                    shadowRadius: 10,
                    elevation: 3,
                  }}
                >
                  <View
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: isSelected ? "#EFF6FF" : "#F3F4F6",
                      marginRight: 16,
                    }}
                  >
                    <Ionicons
                      name={iconName}
                      size={24}
                      color={isSelected ? "#2563EB" : "#6B7280"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: isSelected ? "#1E40AF" : "#111827",
                      }}
                    >
                      {subject.name}
                    </Text>
                    <Text
                      style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}
                    >
                      {subject.papers?.length} Courses available
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#2563EB"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Paper Selection */}
        {selectedSubject && (
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#4F46E5",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>2</Text>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
              >
                Select Course / Paper
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              {currentSubjectObj?.papers?.map((paper) => {
                const isSelected = selectedPaper === paper.id && !isCustomPaper;
                return (
                  <TouchableOpacity
                    key={paper.id}
                    onPress={() => {
                      setSelectedPaper(paper.id);
                      setSelectedTopic(null);
                      setIsCustomPaper(false);
                      setIsCustomTopic(false);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 16,
                      backgroundColor: isSelected ? "#4F46E5" : "white",
                      borderWidth: 1,
                      borderColor: isSelected ? "#4F46E5" : "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        color: isSelected ? "white" : "#374151",
                      }}
                    >
                      {paper.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => {
                  setIsCustomPaper(true);
                  setSelectedPaper(null);
                  setSelectedTopic(null);
                  setIsCustomTopic(true); // Usually custom paper means custom topic too
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: isCustomPaper ? "#4F46E5" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: isCustomPaper ? "#4F46E5" : "#D1D5DB",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={isCustomPaper ? "white" : "#4B5563"}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    color: isCustomPaper ? "white" : "#4B5563",
                  }}
                >
                  Other / Custom Course
                </Text>
              </TouchableOpacity>

              {isCustomPaper && (
                <TextInput
                  style={{
                    backgroundColor: "white",
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#4F46E5",
                    fontSize: 16,
                    marginTop: 8,
                  }}
                  placeholder="Type course name (e.g. Econometrics II)"
                  value={customPaperText}
                  onChangeText={setCustomPaperText}
                  autoFocus
                />
              )}
            </View>
          </View>
        )}

        {/* Step 3: Topic Selection */}
        {(selectedPaper || isCustomPaper) && (
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#0D9488",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>3</Text>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
              >
                Select Topic
              </Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {!isCustomPaper &&
                currentPaperObj?.chapters?.map((chapter) => {
                  const isSelected =
                    selectedTopic === chapter && !isCustomTopic;
                  return (
                    <TouchableOpacity
                      key={chapter}
                      onPress={() => {
                        setSelectedTopic(chapter);
                        setIsCustomTopic(false);
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#0D9488" : "white",
                        borderWidth: 1,
                        borderColor: isSelected ? "#0D9488" : "#E5E7EB",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: isSelected ? "white" : "#374151",
                        }}
                      >
                        {chapter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

              <TouchableOpacity
                onPress={() => {
                  setIsCustomTopic(true);
                  setSelectedTopic(null);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: isCustomTopic ? "#0D9488" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: isCustomTopic ? "#0D9488" : "#D1D5DB",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color={isCustomTopic ? "white" : "#4B5563"}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    color: isCustomTopic ? "white" : "#4B5563",
                  }}
                >
                  Custom Topic
                </Text>
              </TouchableOpacity>

              {isCustomTopic && (
                <TextInput
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#0D9488",
                    fontSize: 16,
                    marginTop: 4,
                  }}
                  placeholder="What do you want to learn?"
                  value={customTopicText}
                  onChangeText={setCustomTopicText}
                  autoFocus
                />
              )}
            </View>
          </View>
        )}

        {/* Step 4: Type Selection */}
        {(selectedTopic || (isCustomTopic && customTopicText)) && (
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#7C3AED",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>4</Text>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
              >
                Question Format
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#F3F4F6",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
              className="border border-red-400"
            >
              {QUESTION_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    style={{
                      flexGrow: 1,
                      minWidth: "45%",
                      paddingVertical: 14,
                      borderRadius: 16,
                      backgroundColor: isSelected ? "#FAF5FF" : "transparent",
                      borderWidth: 1,
                      borderColor: isSelected ? "#C084FC" : "transparent",
                      alignItems: "center",
                      flexDirection: "row",

                      gap: 8,
                    }}
                    className=" px-4"
                  >
                    <Ionicons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={isSelected ? "#7C3AED" : "#9CA3AF"}
                    />
                    <Text
                      style={{
                        fontWeight: "600",
                        color: isSelected ? "#7C3AED" : "#4B5563",
                      }}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {selectedSubject &&
        (selectedTopic || customTopicText) &&
        selectedType && (
          <View
            style={{ position: "absolute", bottom: 30, left: 24, right: 24 }}
          >
            <TouchableOpacity
              onPress={handleGenerate}
              style={{
                backgroundColor: "#111827",
                paddingVertical: 20,
                borderRadius: 24,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Ionicons
                name="sparkles"
                size={24}
                color="#FFD700"
                style={{ marginRight: 12 }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                Generate Practice Set
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
}
