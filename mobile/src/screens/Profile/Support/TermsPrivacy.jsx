import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import InterviewHeader from "../../../components/InterviewHeader";
import styles from "../../../styles/global";

const TermsPrivacy = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("terms");

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
          interviewLabel="Terms & Privacy"
          showTimer={false}
          navigateTo="Profile"
          goBack={true}
          backIcon="back"
        />

        <View>
          {/* Header */}
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
                name="shield-checkmark-outline"
                size={26}
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
              Terms & Privacy
            </Text>

            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              Learn about the rules for using the application and how your
              information is handled.
            </Text>
          </View>

          {/* Tabs */}
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
              onPress={() => setActiveTab("terms")}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  activeTab === "terms" ? "#2563EB" : "transparent",
              }}
            >
              <Text
                style={{
                  color: activeTab === "terms" ? "#FFFFFF" : "#A1A1AA",
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab("privacy")}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  activeTab === "privacy" ? "#2563EB" : "transparent",
              }}
            >
              <Text
                style={{
                  color: activeTab === "privacy" ? "#FFFFFF" : "#A1A1AA",
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
        </View>
      </ScrollView>
    </View>
  );
};

const Section = ({ number, title, children }) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#172554",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: "#60A5FA",
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            {number}
          </Text>
        </View>

        <Text
          style={{
            flex: 1,
            color: "#F8FAFC",
            fontSize: 15,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
      </View>

      <Text
        style={{
          color: "#A1A1AA",
          fontSize: 13,
          lineHeight: 21,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

const TermsContent = () => {
  return (
    <View
      style={{
        backgroundColor: "#25252F",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#30303B",
      }}
    >
      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 5,
        }}
      >
        Terms of Service
      </Text>

      <Text
        style={{
          color: "#71717A",
          fontSize: 11,
          marginBottom: 22,
        }}
      >
        Please review these terms before using the application.
      </Text>

      <Section number="01" title="Acceptance of Terms">
        By using this application, you agree to follow these Terms of Service
        and use the application responsibly. If you do not agree with these
        terms, please do not use the application.
      </Section>

      <Section number="02" title="Using the Application">
        You may use the application to create, edit, improve, save, and export
        resumes for lawful personal or professional purposes. You are
        responsible for the information you provide.
      </Section>

      <Section number="03" title="User Content">
        You are responsible for ensuring that the information you enter into
        your resume is accurate and that you have the right to use any
        information, documents, or other content that you provide.
      </Section>

      <Section number="04" title="AI-Generated Content">
        AI features may analyze information you provide and generate resume
        suggestions, summaries, recommendations, or optimizations. AI output
        should be reviewed by you before being used in a job application.
      </Section>

      <Section number="05" title="Accuracy of Resumes">
        The application does not guarantee that a resume will result in an
        interview, employment, or a particular ATS score. You are responsible
        for reviewing your final resume before submitting it to an employer.
      </Section>

      <Section number="06" title="Application Availability">
        We may update, modify, suspend, or discontinue parts of the application
        when necessary. Features may also change as the application is improved.
      </Section>

      <Section number="07" title="Prohibited Use">
        You must not use the application for unlawful activities, to submit
        intentionally misleading information, or to interfere with the operation
        or security of the application.
      </Section>

      <Section number="08" title="Changes to These Terms">
        These Terms of Service may be updated from time to time. Continued use
        of the application after changes are published indicates acceptance of
        the updated terms.
      </Section>
    </View>
  );
};

const PrivacyContent = () => {
  return (
    <View
      style={{
        backgroundColor: "#25252F",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#30303B",
      }}
    >
      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 5,
        }}
      >
        Privacy Policy
      </Text>

      <Text
        style={{
          color: "#71717A",
          fontSize: 11,
          marginBottom: 22,
        }}
      >
        This policy explains how information provided through the application
        may be handled.
      </Text>

      <Section number="01" title="Information You Provide">
        The application may collect information that you enter when creating an
        account or resume, such as your name, contact details, education, work
        experience, skills, projects, certificates, and other resume
        information.
      </Section>

      <Section number="02" title="How Your Information Is Used">
        Information you provide may be used to create and store your resumes,
        provide resume-building features, generate AI-assisted suggestions,
        analyze your resume, and provide requested application functionality.
      </Section>

      <Section number="03" title="AI Processing">
        Information submitted to AI-powered features may be processed by the
        application's AI service to generate summaries, resume analysis, and
        optimization suggestions. Review AI-generated content before using it
        professionally.
      </Section>

      <Section number="04" title="Resume Data">
        Your saved resume information may be stored so that you can continue
        editing your drafts and access completed resumes through your account.
      </Section>

      <Section number="05" title="Account Security">
        You are responsible for keeping your account credentials secure. Do not
        share your password or other authentication information with
        unauthorized individuals.
      </Section>

      <Section number="06" title="Data Protection">
        Reasonable measures should be used to protect stored information from
        unauthorized access, alteration, disclosure, or destruction. However, no
        internet-based system can guarantee absolute security.
      </Section>

      <Section number="07" title="Third-Party Services">
        Some application features may depend on third-party services, including
        AI, authentication, database, hosting, or other technical service
        providers. Information required for those services may be processed
        according to their applicable policies.
      </Section>

      <Section number="08" title="Your Choices">
        You may review and update information associated with your account and
        resumes. If you have questions about your information or privacy,
        contact the application's support team.
      </Section>

      <Section number="09" title="Policy Changes">
        This Privacy Policy may be updated when application features, services,
        or privacy practices change. The updated version will replace the
        previous version when published.
      </Section>
    </View>
  );
};

export default TermsPrivacy;
