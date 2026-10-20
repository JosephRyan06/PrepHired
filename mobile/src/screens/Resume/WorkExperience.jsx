import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

import ResumeHeader from "../../components/ResumeHeader";
import IconTextInput from "../../components/IconTextInput";
import TextInputMulLine from "../../components/TextInputMulLine";
import Button from "../../components/Button";

import styles from "../../styles/global";

import useResume from "../../hooks/useResume";
import { workExperienceHandler } from "../../handlers/resume/workExperienceHandler";

const WorkExperience = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const { getById, saveExperience, loading } = useResume();

  const [dateError, setDateError] = useState("");
  const [errors, setErrors] = useState({});

  const [noWorkExperience, setNoWorkExperience] = useState(false);
  const [noWorkExperienceError, setNoWorkExperienceError] = useState(false);

  const [workExperiences, setWorkExperiences] = useState([
    {
      id: Date.now(),

      jobTitle: "",
      company: "",
      location: "",

      startDate: "",
      endDate: "",

      currentlyWorking: false,

      periodOfEmployment: "",

      description: "",

      expanded: true,
    },
  ]);

  const {
    loadWorkExperienceResume,
    addWorkExperience,
    deleteWorkExperience,
    updateWorkExperience,
    toggleWorkExperience,
    handleWorkExperienceNext,
  } = workExperienceHandler({
    resumeId,
    noWorkExperience,
    setNoWorkExperience,
    workExperiences,
    setWorkExperiences,
    setErrors,
    getById,
    saveExperience,
    navigation,
  });

  useEffect(() => {
    loadWorkExperienceResume();
  }, []);

  const [datePicker, setDatePicker] = useState({
    visible: false,
    type: "startDate",
    experienceId: null,
  });

  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());

  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const openDatePicker = (experience, type = "startDate") => {
    // Do not allow date picker when no work experience is selected
    if (noWorkExperience) {
      return;
    }

    setDateError("");

    let existingDate = "";

    if (type === "startDate") {
      existingDate = experience.startDate || "";
    }

    if (type === "endDate") {
      existingDate = experience.endDate || "";
    }

    if (existingDate) {
      const parts = existingDate.split(" ");

      if (parts.length === 2) {
        const monthIndex = months.indexOf(parts[0]);

        const year = Number(parts[1]);

        if (monthIndex !== -1 && year) {
          setPickerMonth(monthIndex);
          setPickerYear(year);
        }
      }
    } else {
      const now = new Date();

      setPickerMonth(now.getMonth());

      setPickerYear(now.getFullYear());
    }

    setDatePicker({
      visible: true,
      type,
      experienceId: experience.id,
    });
  };

  const closeDatePicker = () => {
    setDateError("");

    setDatePicker({
      visible: false,
      type: "startDate",
      experienceId: null,
    });
  };

  const confirmDate = () => {
    if (!datePicker.type || !datePicker.experienceId) {
      return;
    }

    const selectedDate = `${months[pickerMonth]} ${pickerYear}`;

    const experienceIndex = workExperiences.findIndex(
      (experience) => experience.id === datePicker.experienceId,
    );

    if (experienceIndex === -1) {
      return;
    }

    const experience = workExperiences[experienceIndex];

    const selectedValue = pickerYear * 12 + pickerMonth;

    // =====================================================
    // START DATE
    // =====================================================

    if (datePicker.type === "startDate") {
      // Check against existing end date
      if (experience.endDate && !experience.currentlyWorking) {
        const endParts = experience.endDate.split(" ");

        if (endParts.length === 2) {
          const endMonth = months.indexOf(endParts[0]);
          const endYear = Number(endParts[1]);

          if (endMonth !== -1 && endYear) {
            const endValue = endYear * 12 + endMonth;

            if (selectedValue > endValue) {
              setDateError("Start date cannot be later than end date.");

              return;
            }
          }
        }
      }

      // SAVE START DATE FIRST
      updateWorkExperience(
        datePicker.experienceId,
        experienceIndex,
        "startDate",
        selectedDate,
      );

      setDateError("");

      // If currently working, we're done
      if (experience.currentlyWorking) {
        closeDatePicker();
        return;
      }

      // If no end date yet, automatically move to End Date
      if (!experience.endDate) {
        setDatePicker((prev) => ({
          ...prev,
          type: "endDate",
        }));

        // Reset picker to current date for end date
        const now = new Date();

        setPickerMonth(now.getMonth());
        setPickerYear(now.getFullYear());

        return;
      }

      // End date already exists
      closeDatePicker();
      return;
    }

    // =====================================================
    // END DATE
    // =====================================================

    if (datePicker.type === "endDate") {
      if (!experience.startDate) {
        setDateError("Please select a start date first.");

        setDatePicker((prev) => ({
          ...prev,
          type: "startDate",
        }));

        return;
      }

      const startParts = experience.startDate.split(" ");

      if (startParts.length === 2) {
        const startMonth = months.indexOf(startParts[0]);
        const startYear = Number(startParts[1]);

        if (startMonth !== -1 && startYear) {
          const startValue = startYear * 12 + startMonth;

          if (selectedValue < startValue) {
            setDateError("End date cannot be earlier than start date.");

            return;
          }
        }
      }

      // SAVE END DATE
      updateWorkExperience(
        datePicker.experienceId,
        experienceIndex,
        "endDate",
        selectedDate,
      );

      setDateError("");

      closeDatePicker();
    }
  };

  const changeMonth = (direction) => {
    let newMonth = pickerMonth + direction;

    let newYear = pickerYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setPickerMonth(newMonth);
    setPickerYear(newYear);
  };

  const selectedExperience = workExperiences.find(
    (item) => item.id === datePicker.experienceId,
  );

  const getPeriodPreview = () => {
    if (!selectedExperience) {
      return "Not selected";
    }

    let start = selectedExperience.startDate || "";

    let end = selectedExperience.currentlyWorking
      ? "Present"
      : selectedExperience.endDate || "";

    // Preview selected start date
    if (datePicker.type === "startDate") {
      start = `${months[pickerMonth]} ${pickerYear}`;
    }

    // Preview selected end date
    if (datePicker.type === "endDate") {
      end = `${months[pickerMonth]} ${pickerYear}`;
    }

    if (!start && !end) {
      return "Not selected";
    }

    if (!start) {
      return `Not selected - ${end}`;
    }

    if (!end) {
      return `${start} - Not selected`;
    }

    return `${start} - ${end}`;
  };

  const getPeriodDisplay = (experience) => {
    if (!experience.startDate) {
      return "";
    }

    if (experience.currentlyWorking) {
      return `${experience.startDate} - Present`;
    }

    if (experience.endDate) {
      return `${experience.startDate} - ${experience.endDate}`;
    }

    return experience.startDate;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Work Experience"
          resumeId={resumeId}
          navigateTo="TargetJobPosition"
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          3/8
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
          <View
            style={[
              styles.percent,
              {
                width: "49.9%",
              },
            ]}
          />
        </View>

        <View>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 15,
              fontWeight: "700",
              marginBottom: 5,
            }}
          >
            Do you have work experience?
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            Tell us about your professional experience. Don't worry if you're
            just starting out. OJT and internship experience can still be added.
          </Text>

          {/* No Work Experience Option */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#25252F",
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: noWorkExperience ? "#2563EB" : "#30303A",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const newValue = !noWorkExperience;

                setNoWorkExperience(newValue);

                if (newValue) {
                  setErrors({});
                }
              }}
              activeOpacity={0.7}
              style={{
                width: 24,
                height: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Checkbox
                value={noWorkExperience}
                pointerEvents="none"
                color={noWorkExperience ? "#2563EB" : undefined}
                style={{
                  width: 22,
                  height: 22,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                marginLeft: 12,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                I don't have formal work experience
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 12,
            fontWeight: "600",
            marginStart: 5,
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          WORK EXPERIENCE
        </Text>

        {noWorkExperienceError ? (
          <Text style={styles.textError}>{noWorkExperienceError}</Text>
        ) : null}

        {workExperiences.map((experience, index) => (
          <View
            key={experience.id}
            style={[
              styles.workExpContainer,
              {
                marginBottom: 15,
                opacity: noWorkExperience ? 0.5 : 1,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                if (noWorkExperience) {
                  return;
                }

                toggleWorkExperience(experience.id);
              }}
              activeOpacity={0.8}
              style={{
                minHeight: 58,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              {/* NUMBER */}
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: experience.expanded ? "#2563EB" : "#30303A",
                  borderWidth: experience.expanded ? 0 : 1,
                  borderColor: "#3F3F4A",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: experience.expanded ? "#FFFFFF" : "#A1A1AA",
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  {index + 1}
                </Text>
              </View>

              {/* COLLAPSED */}
              {!experience.expanded && !noWorkExperience && (
                <Text
                  style={{
                    flex: 1,
                    color: experience.jobTitle ? "#F8FAFC" : "#71717A",
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 0.1,
                    marginRight: 10,
                  }}
                  numberOfLines={1}
                >
                  {experience.jobTitle || "Untitled Position"}
                </Text>
              )}

              {experience.expanded && (
                <View
                  style={{
                    flex: 1,
                  }}
                />
              )}

              {experience.expanded && workExperiences.length > 1 && (
                <TouchableOpacity
                  onPress={() => deleteWorkExperience(experience.id)}
                  disabled={noWorkExperience}
                  activeOpacity={0.7}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#302A2D",
                    borderWidth: 1,
                    borderColor: "#453337",
                    marginRight: 7,
                  }}
                >
                  <Ionicons name="trash-outline" color="#F87171" size={19} />
                </TouchableOpacity>
              )}

              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: experience.expanded ? "#30303A" : "#2563EB",
                  borderWidth: experience.expanded ? 1 : 0,
                  borderColor: "#3F3F4A",
                }}
              >
                <Ionicons
                  name={experience.expanded ? "chevron-up" : "chevron-down"}
                  color={experience.expanded ? "#D4D4D8" : "#FFFFFF"}
                  size={18}
                />
              </View>
            </TouchableOpacity>

            {experience.expanded && (
              <>
                <IconTextInput
                  label="JOB TITLE"
                  style={{
                    height: 55,
                  }}
                  icon="person-outline"
                  placeholder="eg. Software Developer"
                  value={experience.jobTitle || ""}
                  onChangeText={(text) =>
                    updateWorkExperience(experience.id, index, "jobTitle", text)
                  }
                  editable={!noWorkExperience}
                  keyboardType="default"
                  error={errors[`experience.${index}.jobTitle`]}
                />

                {errors[`experience.${index}.jobTitle`] ? (
                  <Text style={styles.textError}>
                    {errors[`experience.${index}.jobTitle`]}
                  </Text>
                ) : null}

                <IconTextInput
                  label="COMPANY"
                  style={{
                    height: 55,
                  }}
                  icon="business-outline"
                  placeholder="eg. ABC Company"
                  value={experience.company || ""}
                  onChangeText={(text) =>
                    updateWorkExperience(experience.id, index, "company", text)
                  }
                  editable={!noWorkExperience}
                  keyboardType="default"
                  error={errors[`experience.${index}.company`]}
                />

                {errors[`experience.${index}.company`] ? (
                  <Text style={styles.textError}>
                    {errors[`experience.${index}.company`]}
                  </Text>
                ) : null}

                <IconTextInput
                  label="LOCATION"
                  style={{
                    height: 55,
                  }}
                  icon="location-outline"
                  placeholder="eg. Dagupan City, Pangasinan"
                  value={experience.location || ""}
                  onChangeText={(text) =>
                    updateWorkExperience(experience.id, index, "location", text)
                  }
                  editable={!noWorkExperience}
                  keyboardType="default"
                  error={errors[`experience.${index}.location`]}
                />

                {errors[`experience.${index}.location`] ? (
                  <Text style={styles.textError}>
                    {errors[`experience.${index}.location`]}
                  </Text>
                ) : null}

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Pressable
                    disabled={noWorkExperience}
                    onPress={() => openDatePicker(experience, "startDate")}
                  >
                    <View pointerEvents="none">
                      <IconTextInput
                        label="PERIOD OF EMPLOYMENT"
                        style={{
                          height: 55,
                        }}
                        icon="calendar-outline"
                        placeholder="January 2022 - December 2025"
                        value={getPeriodDisplay(experience)}
                        editable={false}
                        error={errors[`experience.${index}.periodOfEmployment`]}
                      />
                    </View>
                  </Pressable>

                  {/* PERIOD OF EMPLOYMENT ERROR */}
                  {errors[`experience.${index}.periodOfEmployment`] ? (
                    <Text style={styles.textError}>
                      {errors[`experience.${index}.periodOfEmployment`]}
                    </Text>
                  ) : null}

                  {errors[`experience.${index}.startDate`] ||
                  errors[`experience.${index}.endDate`] ? (
                    <Text style={styles.textError}>
                      {errors[`experience.${index}.startDate`] ||
                        errors[`experience.${index}.endDate`]}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <TextInputMulLine
                    label="DESCRIPTION (OPTIONAL)"
                    placeholder="Paste the job description here..."
                    value={experience.description || ""}
                    onChangeText={(text) =>
                      updateWorkExperience(
                        experience.id,
                        index,
                        "description",
                        text,
                      )
                    }
                    editable={!noWorkExperience}
                    style={{
                      height: 120,
                    }}
                  />
                </View>
              </>
            )}
          </View>
        ))}

        {!noWorkExperience && workExperiences.length < 5 && (
          <Button
            title="Add"
            icon="add-outline"
            onPress={addWorkExperience}
            style={{
              height: 45,
              marginTop: 5,
              backgroundColor: "#25252F",
              borderWidth: 1,
              borderColor: "#2563EB",
            }}
          />
        )}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Next"
        onPress={handleWorkExperienceNext}
        loading={loading}
        icon="arrow-forward-outline"
        iconPosition="right"
      />

      </KeyboardAvoidingView>

      <Modal
        visible={datePicker.visible}
        transparent
        animationType="fade"
        onRequestClose={closeDatePicker}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#25252F",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              Select Period of Employment
            </Text>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#30303A",
                borderRadius: 12,
                padding: 4,
                marginBottom: 15,
              }}
            >
              {/* START DATE */}
              <TouchableOpacity
                onPress={() => {
                  setDateError("");

                  const experience = workExperiences.find(
                    (item) => item.id === datePicker.experienceId,
                  );

                  if (experience) {
                    const existingDate = experience.startDate || "";

                    if (existingDate) {
                      const parts = existingDate.split(" ");

                      if (parts.length === 2) {
                        const monthIndex = months.indexOf(parts[0]);

                        const year = Number(parts[1]);

                        if (monthIndex !== -1 && year) {
                          setPickerMonth(monthIndex);

                          setPickerYear(year);
                        }
                      }
                    }
                  }

                  setDatePicker((prev) => ({
                    ...prev,
                    type: "startDate",
                  }));
                }}
                style={{
                  flex: 1,
                  height: 45,
                  borderRadius: 9,
                  backgroundColor:
                    datePicker.type === "startDate" ? "#2563EB" : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color:
                      datePicker.type === "startDate" ? "#FFFFFF" : "#A1A1AA",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Start Date
                </Text>
              </TouchableOpacity>

              {/* END DATE */}
              <TouchableOpacity
                onPress={() => {
                  if (selectedExperience?.currentlyWorking) {
                    return;
                  }

                  setDateError("");

                  const experience = workExperiences.find(
                    (item) => item.id === datePicker.experienceId,
                  );

                  if (experience) {
                    const existingDate = experience.endDate || "";

                    if (existingDate) {
                      const parts = existingDate.split(" ");

                      if (parts.length === 2) {
                        const monthIndex = months.indexOf(parts[0]);

                        const year = Number(parts[1]);

                        if (monthIndex !== -1 && year) {
                          setPickerMonth(monthIndex);

                          setPickerYear(year);
                        }
                      }
                    } else {
                      const now = new Date();

                      setPickerMonth(now.getMonth());

                      setPickerYear(now.getFullYear());
                    }
                  }

                  setDatePicker((prev) => ({
                    ...prev,
                    type: "endDate",
                  }));
                }}
                disabled={selectedExperience?.currentlyWorking}
                style={{
                  flex: 1,
                  height: 45,
                  borderRadius: 9,
                  backgroundColor:
                    datePicker.type === "endDate" ? "#2563EB" : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: selectedExperience?.currentlyWorking ? 0.4 : 1,
                }}
              >
                <Text
                  style={{
                    color:
                      datePicker.type === "endDate" ? "#FFFFFF" : "#A1A1AA",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  End Date
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginBottom: 15,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!selectedExperience) {
                    return;
                  }

                  const newValue = !selectedExperience.currentlyWorking;

                  const experienceIndex = workExperiences.findIndex(
                    (experience) => experience.id === selectedExperience.id,
                  );

                  if (experienceIndex === -1) {
                    return;
                  }

                  updateWorkExperience(
                    selectedExperience.id,
                    experienceIndex,
                    "currentlyWorking",
                    newValue,
                  );

                  if (newValue) {
                    updateWorkExperience(
                      selectedExperience.id,
                      experienceIndex,
                      "endDate",
                      "",
                    );

                    setDatePicker((prev) => ({
                      ...prev,
                      type: "startDate",
                    }));
                  }

                  setDateError("");
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  value={selectedExperience?.currentlyWorking === true}
                  pointerEvents="none"
                  color={
                    selectedExperience?.currentlyWorking ? "#2563EB" : undefined
                  }
                />

                <Text
                  style={{
                    color: "#A1A1AA",
                    marginLeft: 10,
                  }}
                >
                  I currently work here
                </Text>
              </Pressable>
            </View>

            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              MONTH
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#30303A",
                borderRadius: 14,
                height: 60,
              }}
            >
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#A1A1AA" />
              </TouchableOpacity>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                {months[pickerMonth]}
              </Text>

              <TouchableOpacity
                onPress={() => changeMonth(1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-forward" size={24} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 12,
                fontWeight: "600",
                marginTop: 15,
                marginBottom: 8,
              }}
            >
              YEAR
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#30303A",
                borderRadius: 14,
                height: 60,
              }}
            >
              <TouchableOpacity
                onPress={() => setPickerYear((year) => year - 1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#A1A1AA" />
              </TouchableOpacity>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                {pickerYear}
              </Text>

              <TouchableOpacity
                onPress={() => setPickerYear((year) => year + 1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-forward" size={24} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 20,
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: "#30303A",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {datePicker.type === "startDate"
                  ? "SELECTED START DATE"
                  : "SELECTED END DATE"}
              </Text>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                {months[pickerMonth]} {pickerYear}
              </Text>
            </View>

            <View
              style={{
                marginTop: 10,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 10,
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                PERIOD OF EMPLOYMENT
              </Text>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {getPeriodPreview()}
              </Text>
            </View>

            {dateError ? (
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 12,
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: 5,
                  paddingHorizontal: 10,
                }}
              >
                {dateError}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 15,
              }}
            >
              {/* CANCEL */}
              <TouchableOpacity
                onPress={closeDatePicker}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: "#30303A",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#A1A1AA",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* DONE */}
              <TouchableOpacity
                onPress={confirmDate}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: "#2563EB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WorkExperience;
