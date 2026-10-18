
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

const RESUME_FAQ_DATA = [
  {
    category: "Getting Started",
    icon: "document-text-outline",
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
    icon: "sparkles-outline",
    questions: [
      {
        question: "What does the AI Resume Review do?",
        answer:
          "The AI Resume Review analyzes your resume for ATS compatibility, identifies strengths and missing keywords, and provides recommendations based on the information you provided.",
      },
      {
        question: "Can AI add information that I did not provide?",
        answer:
          "AI-generated resume content is designed to use the information you provide. Always review generated content and ensure it accurately represents your experience.",
      },
      {
        question: "Can I use the AI-generated professional summary?",
        answer:
          "Yes. Review the generated summary and use it as part of your resume. You can also edit it before saving your resume.",
      },
    ],
  },
  {
    category: "Resume Templates",
    icon: "layers-outline",
    questions: [
      {
        question: "How do I change my resume template?",
        answer:
          "After completing your resume information and AI review, select a template from the template selection screen before viewing your final resume.",
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
    icon: "download-outline",
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

const MOCK_INTERVIEW_FAQ_DATA = [
  {
    category: "Getting Started",
    icon: "play-circle-outline",
    questions: [
      {
        question: "What is a Mock Interview?",
        answer:
          "The Mock Interview feature helps you practice answering interview questions for your target job and prepare for real interviews by improving your confidence and communication skills.",
      },
      {
        question: "How do I start a Mock Interview?",
        answer:
          "Choose your target job, interview category, time per question, and preferred number of questions to begin your practice session.",
      },
      {
        question: "Can I choose the number of questions?",
        answer:
          "Yes. You can select from the available number of questions when setting up your mock interview.",
      },
    ],
  },
  {
    category: "Answer Responses",
    icon: "chatbox-outline",
    questions: [
      {
        question: "How do I answer mock interview questions?",
        answer:
          "Type your answer in the provided text field and submit it to proceed with your mock interview. Make sure your response addresses the question before submitting it.",
      },
      {
        question: "Does the mock interview support voice responses?",
        answer:
          "No. The mock interview currently supports text responses only. You must type your answers in the provided response field.",
      },
      {
        question: "Can I edit my answer before submitting it?",
        answer:
          "Yes. You can review and revise your typed answer before submitting it. Check your response carefully to make sure it is complete and accurate.",
      },
      {
        question: "Can I edit my answer after submitting it?",
        answer:
          "No. Once you submit your answer, you cannot edit or change it. Please review your response carefully before submitting it.",
      },
      {
        question: "Can I skip a question?",
        answer:
          "No. You must answer each interview question and submit your response before proceeding to the next question. Skipping questions is not allowed.",
      },
      {
        question: "What happens if I submit an incomplete answer?",
        answer:
          "Your submitted response will be treated as your final answer for that question. Review your response and make sure you have included the important details before submitting it.",
      },
    ],
  },
  {
    category: "Answer Analysis and Feedback",
    icon: "analytics-outline",
    questions: [
      {
        question: "How are my answers analyzed?",
        answer:
          "Your submitted text answers can be analyzed by the mock interview system to provide feedback on your responses, including their relevance, clarity, completeness, and alignment with the interview question.",
      },
      {
        question: "Can I improve my interview performance?",
        answer:
          "Yes. Review the feedback provided after your interview, identify areas that need improvement, and practice answering similar questions to strengthen your interview skills.",
      },
      {
        question: "Can I review my completed interviews?",
        answer:
          "You can review completed interviews through the completed interview feature when your session has been saved successfully and the feature is available in the application.",
      },
    ],
  },
  {
    category: "Interview Sessions",
    icon: "checkmark-circle-outline",
    questions: [
      {
        question: "What happens when I finish an interview?",
        answer:
          "After answering all the required questions, complete your interview using the available completion control. Your session can then be processed for analysis and feedback according to the application's interview flow.",
      },
      {
        question: "Can I leave a question unanswered and continue?",
        answer:
          "No. Every question requires a submitted text response before you can proceed. Make sure you provide an answer for the current question before continuing.",
      },
      {
        question: "What should I do if I accidentally submit an answer?",
        answer:
          "Submitted answers cannot be edited or changed. Take your time to review your response before submitting it to avoid accidental or incomplete submissions.",
      },
    ],
  },
];

const SectionHeader = ({ number, title, icon }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    }}
  >
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#172554",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
      }}
    >
      <Ionicons name={icon} size={18} color="#60A5FA" />
    </View>

    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: "#71717A",
          fontSize: 10,
          fontWeight: "700",
          marginBottom: 2,
        }}
      >
        {number}
      </Text>

      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 15,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
    </View>
  </View>
);

const FAQCategoryList = ({
  categories,
  search,
  expanded,
  onToggle,
}) => {
  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) =>
            item.question.toLowerCase().includes(keyword) ||
            item.answer.toLowerCase().includes(keyword) ||
            category.category.toLowerCase().includes(keyword)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [categories, search]);

  if (filteredCategories.length === 0) {
    return (
      <View
        style={{
          alignItems: "center",
          paddingVertical: 45,
        }}
      >
        <Ionicons
          name="search-outline"
          size={42}
          color="#52525B"
        />

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
            lineHeight: 20,
          }}
        >
          Try searching for another question or keyword.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {filteredCategories.map((category, categoryIndex) => (
        <View
          key={category.category}
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#30303B",
            marginBottom: 16,
          }}
        >
          <SectionHeader
            number={String(categoryIndex + 1).padStart(2, "0")}
            title={category.category}
            icon={category.icon}
          />

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#30303B",
            }}
          >
            {category.questions.map((item, questionIndex) => {
              const key = `${category.category}-${item.question}`;
              const isExpanded = expanded === key;
              const isLast =
                questionIndex === category.questions.length - 1;

              return (
                <View key={item.question}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => onToggle(key)}
                    style={{
                      minHeight: 56,
                      paddingVertical: 15,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottomWidth:
                        isExpanded || !isLast ? 1 : 0,
                      borderBottomColor: "#30303B",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color: "#F8FAFC",
                        fontSize: 13,
                        fontWeight: "500",
                        paddingRight: 12,
                        lineHeight: 20,
                      }}
                    >
                      {item.question}
                    </Text>

                    <Ionicons
                      name={
                        isExpanded
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color="#71717A"
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View
                      style={{
                        paddingTop: 12,
                        paddingBottom: 15,
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
      ))}
    </View>
  );
};

const ResumeContent = (props) => (
  <FAQCategoryList
    {...props}
    categories={RESUME_FAQ_DATA}
  />
);

const MockInterviewContent = (props) => (
  <FAQCategoryList
    {...props}
    categories={MOCK_INTERVIEW_FAQ_DATA}
  />
);

const HelpFAQs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("resume");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setExpanded(null);
  };

  const toggleQuestion = (key) => {
    setExpanded((current) => (current === key ? null : key));
  };

  const contentProps = {
    search,
    expanded,
    onToggle: toggleQuestion,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Help & FAQs"
          showTimer={false}
          navigateTo="Profile"
          goBack={true}
          backIcon="back"
        />

        {/* Header Card */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 20,
            marginBottom: 18,
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
            <Ionicons
              name="help-circle-outline"
              size={27}
              color="#FFFFFF"
            />
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
            Find answers about creating resumes, using AI features,
            and practicing interviews with PrepHired.
          </Text>
        </View>

        {/* Content Tabs */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 12,
            padding: 4,
            flexDirection: "row",
            marginBottom: 18,
            borderWidth: 1,
            borderColor: "#30303B",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange("resume")}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor:
                activeTab === "resume"
                  ? "#2563EB"
                  : "transparent",
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={16}
              color={activeTab === "resume" ? "#FFFFFF" : "#A1A1AA"}
              style={{ marginRight: 7 }}
            />

            <Text
              style={{
                color:
                  activeTab === "resume" ? "#FFFFFF" : "#A1A1AA",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              Resume
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange("interview")}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor:
                activeTab === "interview"
                  ? "#2563EB"
                  : "transparent",
            }}
          >
            <Ionicons
              name="mic-outline"
              size={16}
              color={
                activeTab === "interview" ? "#FFFFFF" : "#A1A1AA"
              }
              style={{ marginRight: 7 }}
            />

            <Text
              style={{
                color:
                  activeTab === "interview"
                    ? "#FFFFFF"
                    : "#A1A1AA",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              Mock Interview
            </Text>
          </TouchableOpacity>
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
            marginBottom: 18,
          }}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="#71717A"
          />

          <TextInput
            value={search}
            onChangeText={(value) => {
              setSearch(value);
              setExpanded(null);
            }}
            placeholder={
              activeTab === "resume"
                ? "Search resume FAQs..."
                : "Search mock interview FAQs..."
            }
            placeholderTextColor="#71717A"
            style={{
              flex: 1,
              color: "#F8FAFC",
              fontSize: 14,
              marginLeft: 10,
              paddingVertical: 0,
            }}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setExpanded(null);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#71717A"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Resume / Mock Interview Content */}
        {activeTab === "resume" ? (
          <ResumeContent {...contentProps} />
        ) : (
          <MockInterviewContent {...contentProps} />
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
      </ScrollView>
    </View>
  );
};

export default HelpFAQs;
