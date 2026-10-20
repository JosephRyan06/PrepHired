import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { useRoute } from "@react-navigation/native";
import ResumeHeader from "../../components/ResumeHeader";
import IconTextInput from "../../components/IconTextInput";
import TextInputMulLine from "../../components/TextInputMulLine";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/global";
import Button from "../../components/Button";

import useResume from "../../hooks/useResume";
import { educationHandler } from "../../handlers/resume/educationHandler";

const Education = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const { getById, saveEducations, loading } = useResume();

  const [errors, setErrors] = useState({});

  const [educations, setEducations] = useState([
    {
      id: Date.now(),
      school: "",
      degreeField: "",
      location: "",
      schoolYear: "",
      description: "",
      expanded: true,
    },
  ]);

  const {
    loadEducationResume,
    addEducation,
    deleteEducation,
    updateEducation,
    toggleEducation,
    handleEducationNext,
  } = educationHandler({
    educations,
    setEducations,
    setErrors,
    getById,
    saveEducations,
    resumeId,
    navigation,
  });

  useEffect(() => {
    loadEducationResume();
  }, []);

  const [schoolYearPicker, setSchoolYearPicker] = useState({
    visible: false,
    educationId: null,
    index: null,
  });

  const [pickerStartYear, setPickerStartYear] = useState(
    new Date().getFullYear(),
  );

  const [pickerEndYear, setPickerEndYear] = useState(
    new Date().getFullYear() + 1,
  );

  const openSchoolYearPicker = (educationId, index, currentValue) => {
    let startYear = new Date().getFullYear();
    let endYear = startYear + 1;

    // If there is already a value such as 2022-2026,
    // load it into the picker.
    if (currentValue && /^\d{4}-\d{4}$/.test(currentValue)) {
      const [start, end] = currentValue.split("-");

      startYear = parseInt(start, 10);
      endYear = parseInt(end, 10);
    }

    setPickerStartYear(startYear);
    setPickerEndYear(endYear);

    setSchoolYearPicker({
      visible: true,
      educationId,
      index,
    });
  };

  const closeSchoolYearPicker = () => {
    setSchoolYearPicker({
      visible: false,
      educationId: null,
      index: null,
    });
  };

  const confirmSchoolYear = () => {
    // End year cannot be before start year
    if (pickerEndYear < pickerStartYear) {
      return;
    }

    const schoolYear = `${pickerStartYear}-${pickerEndYear}`;

    updateEducation(
      schoolYearPicker.educationId,
      schoolYearPicker.index,
      "schoolYear",
      schoolYear,
    );

    closeSchoolYearPicker();
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
          resumeLabel="Education"
          resumeId={resumeId}
          navigateTo="WorkExperience"
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          4/8
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
          <View style={[styles.percent, { width: "66.6%" }]} />
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
            What is your educational background?
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            Add your educational attainment to help employers understand your
            academic background and qualifications.
          </Text>
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
          EDUCATIONAL ATTAINMENT
        </Text>

        {educations.map((education, index) => (
          <View
            key={education.id}
            style={[
              styles.workExpContainer,
              {
                marginBottom: 15,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleEducation(education.id)}
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
                  backgroundColor: education.expanded ? "#2563EB" : "#30303A",
                  borderWidth: education.expanded ? 0 : 1,
                  borderColor: "#3F3F4A",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: education.expanded ? "#FFFFFF" : "#A1A1AA",
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  {index + 1}
                </Text>
              </View>

              {/* SCHOOL NAME - ONLY WHEN COLLAPSED */}
              {!education.expanded && (
                <Text
                  style={{
                    flex: 1,
                    color: education.school ? "#F8FAFC" : "#71717A",
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 0.1,
                    marginRight: 10,
                  }}
                  numberOfLines={1}
                >
                  {education.school || "Untitled Education"}
                </Text>
              )}

              {/* SPACER - WHEN EXPANDED */}
              {education.expanded && (
                <View
                  style={{
                    flex: 1,
                  }}
                />
              )}

              {/* DELETE - ONLY WHEN EXPANDED */}
              {education.expanded && educations.length > 1 && (
                <TouchableOpacity
                  onPress={() => deleteEducation(education.id)}
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

              {/* CHEVRON - ALWAYS AT THE RIGHT */}
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: education.expanded ? "#30303A" : "#2563EB",
                  borderWidth: education.expanded ? 1 : 0,
                  borderColor: "#3F3F4A",
                }}
              >
                <Ionicons
                  name={education.expanded ? "chevron-up" : "chevron-down"}
                  color={education.expanded ? "#D4D4D8" : "#FFFFFF"}
                  size={18}
                />
              </View>
            </TouchableOpacity>

            {/* COLLAPSIBLE CONTENT */}
            {education.expanded && (
              <>
                <IconTextInput
                  label="SCHOOL NAME"
                  style={{
                    height: 55,
                  }}
                  icon="school-outline"
                  placeholder="Enter school or university"
                  value={education.school}
                  onChangeText={(text) =>
                    updateEducation(education.id, index, "school", text)
                  }
                  keyboardType="default"
                  error={errors[`educations.${index}.school`]}
                />

                {errors[`educations.${index}.school`] ? (
                  <Text style={styles.textError}>
                    {errors[`educations.${index}.school`]}
                  </Text>
                ) : null}

                <IconTextInput
                  label="DEGREE & FIELD OF STUDY"
                  style={{
                    height: 55,
                  }}
                  icon="ribbon-outline"
                  placeholder="e.g. Bachelor of Science in Informat..."
                  value={education.degreeField}
                  onChangeText={(text) =>
                    updateEducation(education.id, index, "degreeField", text)
                  }
                  keyboardType="default"
                  error={errors[`educations.${index}.degreeField`]}
                />

                {errors[`educations.${index}.degreeField`] ? (
                  <Text style={styles.textError}>
                    {errors[`educations.${index}.degreeField`]}
                  </Text>
                ) : null}

                <IconTextInput
                  label="LOCATION"
                  style={{
                    height: 55,
                  }}
                  icon="location-outline"
                  placeholder="eg. Dagupan City, Philippines"
                  value={education.location}
                  onChangeText={(text) =>
                    updateEducation(education.id, index, "location", text)
                  }
                  keyboardType="default"
                  error={errors[`educations.${index}.location`]}
                />

                {errors[`educations.${index}.location`] ? (
                  <Text style={styles.textError}>
                    {errors[`educations.${index}.location`]}
                  </Text>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    openSchoolYearPicker(
                      education.id,
                      index,
                      education.schoolYear,
                    )
                  }
                >
                  <View pointerEvents="none">
                    <IconTextInput
                      label="SCHOOL YEAR"
                      style={{
                        height: 55,
                      }}
                      icon="calendar-outline"
                      placeholder="eg. 2024-2025"
                      value={education.schoolYear}
                      onChangeText={(text) =>
                        updateEducation(education.id, index, "schoolYear", text)
                      }
                      keyboardType="default"
                      error={errors[`educations.${index}.schoolYear`]}
                    />
                  </View>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <TextInputMulLine
                    label="DESCRIPTION / ACHIEVEMENTS"
                    placeholder="Enter relevant achievements, honors, activities, or coursework..."
                    value={education.description}
                    onChangeText={(text) =>
                      updateEducation(education.id, index, "description", text)
                    }
                    style={{ height: 120 }}
                  />
                </View>
              </>
            )}
          </View>
        ))}

        {educations.length < 5 && (
          <Button
            title="Add"
            icon="add-outline"
            onPress={addEducation}
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
        style={{ marginBottom: 65 }}
        title="Next"
        onPress={handleEducationNext}
        loading={loading}
        icon="arrow-forward-outline"
        iconPosition="right"
      />

      </KeyboardAvoidingView>

      <Modal
        visible={schoolYearPicker.visible}
        transparent
        animationType="fade"
        onRequestClose={closeSchoolYearPicker}
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
              Select School Year
            </Text>

            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              START YEAR
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
              {/* PREVIOUS START YEAR */}

              <TouchableOpacity
                onPress={() => setPickerStartYear((year) => year - 1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#A1A1AA" />
              </TouchableOpacity>

              {/* START YEAR VALUE */}

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                {pickerStartYear}
              </Text>

              {/* NEXT START YEAR */}

              <TouchableOpacity
                onPress={() => setPickerStartYear((year) => year + 1)}
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
              END YEAR
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
              {/* PREVIOUS END YEAR */}

              <TouchableOpacity
                onPress={() => setPickerEndYear((year) => year - 1)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#A1A1AA" />
              </TouchableOpacity>

              {/* END YEAR VALUE */}

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                {pickerEndYear}
              </Text>

              {/* NEXT END YEAR */}

              <TouchableOpacity
                onPress={() => setPickerEndYear((year) => year + 1)}
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

            {pickerEndYear < pickerStartYear ? (
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 12,
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: 12,
                  paddingHorizontal: 10,
                }}
              >
                End year cannot be earlier than start year.
              </Text>
            ) : null}

            <View
              style={{
                marginTop: 20,
                paddingVertical: 15,
                alignItems: "center",
                backgroundColor: "#30303A",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  fontWeight: "600",
                  marginBottom: 5,
                }}
              >
                SELECTED SCHOOL YEAR
              </Text>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {pickerStartYear}-{pickerEndYear}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
              }}
            >
              {/* CANCEL */}

              <TouchableOpacity
                onPress={closeSchoolYearPicker}
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
                onPress={confirmSchoolYear}
                disabled={pickerEndYear < pickerStartYear}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor:
                    pickerEndYear < pickerStartYear ? "#1E40AF" : "#2563EB",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pickerEndYear < pickerStartYear ? 0.5 : 1,
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

export default Education;
