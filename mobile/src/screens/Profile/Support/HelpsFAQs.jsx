import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import InterviewHeader from "../../../components/InterviewHeader";
import styles from "../../../styles/global";

const FAQ_DATA = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create a resume?",
        answer:
          "Start by selecting Create Resume and complete each section of the resume builder. You can enter your basic information, target job, work experience, education, summary, skills, projects, and certificates.",
      },
      {
        question: "Can I save my resume and continue later?",
        answer:
          "Yes. Your resume progress is saved as a draft while you are completing the resume. You can return to your saved resume and continue where you left off.",
      },
      {
        question: "Can I edit my resume after saving it?",
        answer:
          "Yes. Saved resumes can be opened and edited whenever you need to update your information.",
      },
    ],
  },
  {
    category: "AI Resume Features",
    questions: [
      {
        question: "What does the AI Resume Review do?",
        answer:
          "The AI Resume Review analyzes your resume for ATS compatibility, identifies strengths and missing keywords, and provides recommendations based on the information you provided.",
      },
      {
        question: "Can AI add information that I did not provide?",
        answer:
          "No. AI-generated resume content is designed to use the information you provide. You should always review generated content before using your resume.",
      },
      {
        question: "Can I use the AI-generated professional summary?",
        answer:
          "Yes. You can review the generated summary and use it as part of your resume. You can also edit the summary before saving your resume.",
      },
    ],
  },
  {
    category: "Resume Templates",
    questions: [
      {
        question: "How do I change my resume template?",
        answer:
          "After completing the resume information and AI review, you can select a resume template from the template selection screen before viewing your final resume.",
      },
      {
        question: "Are the templates ATS-friendly?",
        answer:
          "The available templates are designed with clean, structured layouts to keep important resume information readable and easy to scan.",
      },
    ],
  },
  {
    category: "PDF and Resume Export",
    questions: [
      {
        question: "Can I export my resume as a PDF?",
        answer:
          "Yes. From the Resume Preview screen, select Export PDF to generate your resume as a PDF.",
      },
      {
        question: "Where can I find my saved resumes?",
        answer:
          "Your completed and saved resumes can be accessed from the resume section of the application.",
      },
    ],
  },
];

const HelpFAQs = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return FAQ_DATA;
    }

    return FAQ_DATA.map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(keyword) ||
          item.answer.toLowerCase().includes(keyword),
      ),
    })).filter((category) => category.questions.length > 0);
  }, [search]);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;

    setExpanded((current) => (current === key ? null : key));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Help & FAQs"
          showTimer={false}
          navigateTo="Profile"
          goBack={true}
          backIcon="back"
        />

        <View>
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#30303B",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#1D4ED8",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="help-circle-outline" size={27} color="#FFFFFF" />
            </View>

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 21,
                fontWeight: "700",
                marginBottom: 7,
              }}
            >
              How can we help?
            </Text>

            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              Find answers to common questions about creating, improving,
              saving, and exporting your resume.
            </Text>
          </View>

          {/* Search */}
          <View
            style={{
              height: 50,
              backgroundColor: "#25252F",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#30303B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              marginBottom: 25,
            }}
          >
            <Ionicons name="search-outline" size={20} color="#71717A" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search FAQs..."
              placeholderTextColor="#71717A"
              style={{
                flex: 1,
                color: "#F8FAFC",
                fontSize: 14,
                marginLeft: 10,
              }}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#71717A" />
              </TouchableOpacity>
            )}
          </View>

          {filteredCategories.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 45,
              }}
            >
              <Ionicons name="search-outline" size={42} color="#52525B" />

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 16,
                  fontWeight: "600",
                  marginTop: 12,
                }}
              >
                No results found
              </Text>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                Try searching for another question or keyword.
              </Text>
            </View>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <View key={category.category} style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 15,
                    fontWeight: "700",
                    marginBottom: 10,
                  }}
                >
                  {category.category}
                </Text>

                <View
                  style={{
                    backgroundColor: "#25252F",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#30303B",
                    overflow: "hidden",
                  }}
                >
                  {category.questions.map((item, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isExpanded = expanded === key;

                    return (
                      <View key={item.question}>
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() =>
                            toggleQuestion(categoryIndex, questionIndex)
                          }
                          style={{
                            minHeight: 58,
                            paddingHorizontal: 15,
                            paddingVertical: 15,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottomWidth:
                              isExpanded ||
                              questionIndex !== category.questions.length - 1
                                ? 1
                                : 0,
                            borderBottomColor: "#30303B",
                          }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              color: "#F8FAFC",
                              fontSize: 14,
                              fontWeight: "500",
                              paddingRight: 12,
                              lineHeight: 20,
                            }}
                          >
                            {item.question}
                          </Text>

                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#71717A"
                          />
                        </TouchableOpacity>

                        {isExpanded && (
                          <View
                            style={{
                              paddingHorizontal: 15,
                              paddingTop: 13,
                              paddingBottom: 16,
                              backgroundColor: "#202027",
                            }}
                          >
                            <Text
                              style={{
                                color: "#A1A1AA",
                                fontSize: 13,
                                lineHeight: 21,
                              }}
                            >
                              {item.answer}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}

          {/* Contact Support */}
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              borderWidth: 1,
              borderColor: "#30303B",
              marginTop: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: "#172554",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#60A5FA"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Still need help?
                </Text>

                <Text
                  style={{
                    color: "#71717A",
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  Contact our support team for assistance.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 46,
                borderRadius: 10,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpFAQs;
