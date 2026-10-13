import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResumeHeader from "../../components/ResumeHeader";
import IconTextInput from "../../components/IconTextInput";
import Button from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/global";

import useResume from "../../hooks/useResume";
import { basicInfoHandler } from "../../handlers/resume/basicInfoHandler";

const BasicInfo = ({ navigation }) => {
  const { create, getDraft, saveBasic, loading } = useResume();

  const [resumeId, setResumeId] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [linkedInURL, setLinkedInURL] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [linkedInURLError, setLinkedInURLError] = useState("");
  const [portfolioLinkError, setPortfolioLinkError] = useState("");

  const { loadBasicInfoResume, handleBasicInfoNext } = basicInfoHandler({
    resumeId,
    setResumeId,

    firstName,
    lastName,
    contactNumber,
    address,
    email,
    linkedInURL,
    portfolioLink,

    setFirstName,
    setLastName,
    setContactNumber,
    setAddress,
    setEmail,
    setLinkedInURL,
    setPortfolioLink,

    setFirstNameError,
    setLastNameError,
    setContactNumberError,
    setAddressError,
    setEmailError,
    setLinkedInURLError,
    setPortfolioLinkError,

    getDraft,
    create,
    saveBasic,
    navigation,
  });

  useEffect(() => {
    loadBasicInfoResume();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Basic Information"
          resumeid={resumeId}
          navigateTo="Resume"
        />
        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          1/8
        </Text>
        <View
          style={{
            backgroundColor: "#25252F",
            width: "100%",
            height: 8,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View style={[styles.percent, { width: "16.7%" }]} />
        </View>

        <IconTextInput
          label="FIRST NAME"
          style={{ height: 55 }}
          icon="person-outline"
          placeholder="eg. Juan"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setFirstNameError("");
          }}
          keyboardType="default"
          error={firstNameError}
        />

        {firstNameError ? (
          <Text style={styles.textError}>{firstNameError}</Text>
        ) : null}

        <IconTextInput
          label="LAST NAME"
          style={{ height: 55 }}
          icon="person-outline"
          placeholder="eg. Dela Cruz"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setLastNameError("");
          }}
          keyboardType="default"
          error={lastNameError}
        />

        {lastNameError ? (
          <Text style={styles.textError}>{lastNameError}</Text>
        ) : null}

        <IconTextInput
          label="CONTACT NUMBER"
          style={{ height: 55 }}
          icon="call-outline"
          placeholder="eg. 09123456789"
          value={contactNumber}
          onChangeText={(text) => {
            setContactNumber(text);
            setContactNumberError("");
          }}
          keyboardType="phone-pad"
          error={contactNumberError}
        />

        {contactNumberError ? (
          <Text style={styles.textError}>{contactNumberError}</Text>
        ) : null}

        <IconTextInput
          label="ADDRESS"
          style={{ height: 55 }}
          icon="location-outline"
          placeholder="eg. Arellano St., Dagupan City"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            setAddressError("");
          }}
          keyboardType="email-address"
          error={addressError}
        />

        {addressError ? (
          <Text style={styles.textError}>{addressError}</Text>
        ) : null}

        <IconTextInput
          label="EMAIL"
          style={{ height: 55 }}
          icon="mail-outline"
          placeholder="eg. juan@gmail.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          keyboardType="email-address"
          error={emailError}
        />

        {emailError ? <Text style={styles.textError}>{emailError}</Text> : null}

        <IconTextInput
          label="LINKEDIN URL (OPTIONAL)"
          style={{ height: 55 }}
          icon="logo-linkedin"
          placeholder="Enter your LinkedIn URL"
          value={linkedInURL}
          onChangeText={(text) => {
            setLinkedInURL(text);
            setLinkedInURLError("");
          }}
          keyboardType="url"
          error={linkedInURLError}
        />

        {linkedInURLError ? (
          <Text style={styles.textError}>{linkedInURLError}</Text>
        ) : null}

        <IconTextInput
          label="PORTFOLIO (OPTIONAL)"
          style={{ height: 55 }}
          icon="globe-outline"
          placeholder="Enter your porfolio URL "
          value={portfolioLink}
          onChangeText={(text) => {
            setPortfolioLink(text);
            setPortfolioLinkError("");
          }}
          keyboardType="default"
          error={portfolioLinkError}
        />

        {portfolioLinkError ? (
          <Text style={styles.textError}>{portfolioLinkError}</Text>
        ) : null}
      </ScrollView>
      <Button
        style={{ marginBottom: 65 }}
        title="Next"
        onPress={handleBasicInfoNext}
        loading={loading}
        icon="arrow-forward-outline"
        iconPosition="right"
      />
    </View>
  );
};

export default BasicInfo;
