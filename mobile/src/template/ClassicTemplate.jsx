import React from "react";
import { View, Text } from "react-native";

const ClassicTemplate = ({ resume, preview = false }) => {
  const scale = preview ? 0.55 : 1;

  const aiOptimization = resume?.aiOptimization;

  const fullName = resume?.basicInfo?.fullName || "Your Name";

  // ================================
  // BASIC INFO
  // ================================

  const address =
    aiOptimization?.address?.optimized || resume?.basicInfo?.address || "";

  const professionalSummary =
    aiOptimization?.professionalSummary?.optimized ||
    resume?.professionalSummary ||
    "";

  const skills = aiOptimization?.skills?.optimized || resume?.skills || "";

  const certificates =
    aiOptimization?.certificates?.optimized || resume?.certificates || "";

  // ================================
  // WORK EXPERIENCE
  //
  // JOB TITLE       = ORIGINAL
  // COMPANY         = ORIGINAL
  // LOCATION        = AI OPTIMIZED
  // PERIOD          = ORIGINAL
  // DESCRIPTION     = AI OPTIMIZED
  // ================================


const workExperiences =
  aiOptimization?.workExperiences?.length > 0
    ? aiOptimization.workExperiences.map((experience) => ({
        id: experience.id || "",
        jobTitle: experience.jobTitle || "",
        company: experience.company || "",
        location: experience.location || "",
        periodOfEmployment: experience.periodOfEmployment || "",
        currentlyWorking: experience.currentlyWorking || false,
        description: experience.description || "",
      }))
    : resume?.workExperiences?.map((experience) => ({
        id: experience._id || "",
        jobTitle: experience.jobTitle || "",
        company: experience.company || "",
        location: experience.location || "",
        periodOfEmployment: experience.periodOfEmployment || "",
        currentlyWorking: experience.currentlyWorking || false,
        description: experience.description || "",
      })) || [];

  // ================================
  // EDUCATION
  //
  // DEGREE/FIELD = AI OPTIMIZED
  // SCHOOL       = AI OPTIMIZED
  // LOCATION     = AI OPTIMIZED
  // SCHOOL YEAR  = ORIGINAL
  // DESCRIPTION  = AI OPTIMIZED
  // ================================

  const educations =
    aiOptimization?.educations?.length > 0
      ? aiOptimization.educations.map((education) => ({
          id: education.id || "",
          degreeField: education.degreeField || "",
          school: education.school || "",
          location: education.location || "",
          schoolYear: education.schoolYear || "",
          description: education.optimized || "",
        }))
      : resume?.educations?.map((education) => ({
          id: education._id || "",
          degreeField: education.degreeField || "",
          school: education.school || "",
          location: education.location || "",
          schoolYear: education.schoolYear || "",
          description: education.description || "",
        })) || [];

  // ================================
  // PROJECTS
  //
  // NAME        = AI OPTIMIZED WHEN AVAILABLE
  // DESCRIPTION = AI OPTIMIZED WHEN AVAILABLE
  // ================================

  const projects =
    resume?.projects
      ?.filter(
        (project) =>
          project &&
          (project.projectName?.trim() || project.projectDescription?.trim()),
      )
      .map((project) => {
        const optimizedProject = aiOptimization?.projects?.find(
          (item) => String(item.id) === String(project._id),
        );

        return {
          ...project,

          projectName:
            optimizedProject?.projectName || project.projectName || "",

          projectDescription:
            optimizedProject?.optimized || project.projectDescription || "",
        };
      }) || [];

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        width: 595,
        height: 300,
        marginTop: -30,
        paddingStart: 20,
        paddingEnd: 20,
        transform: [{ scale }],
        transformOrigin: "center",
      }}
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {fullName}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#4B5563",
          marginTop: 5,
        }}
      >
        {resume?.targetJob?.jobTitle || "Professional Title"}
      </Text>

      <Text
        style={{
          fontSize: 9,
          color: "#6B7280",
          marginTop: 10,
        }}
      >
        {resume?.basicInfo?.email || ""}

        {resume?.basicInfo?.email && resume?.basicInfo?.contactNumber
          ? "  |  "
          : ""}

        {resume?.basicInfo?.contactNumber || ""}

        {address ? "  |  " : ""}

        {address}
      </Text>

      {resume?.basicInfo?.linkedInURL ? (
        <Text
          style={{
            fontSize: 8,
            color: "#2563EB",
            marginTop: 3,
          }}
        >
          {resume.basicInfo.linkedInURL}
        </Text>
      ) : null}

      {resume?.basicInfo?.portfolioLink ? (
        <Text
          style={{
            fontSize: 8,
            color: "#2563EB",
            marginTop: 3,
          }}
        >
          {resume.basicInfo.portfolioLink}
        </Text>
      ) : null}

      <View
        style={{
          height: 1,
          backgroundColor: "#111827",
          marginTop: 15,
          marginBottom: 20,
        }}
      />

      {/* ========================================
          PROFESSIONAL SUMMARY
      ======================================== */}

      {professionalSummary ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            PROFESSIONAL SUMMARY
          </Text>

          <Text
            style={{
              fontSize: 9,
              lineHeight: 14,
              color: "#374151",
            }}
          >
            {professionalSummary}
          </Text>
        </View>
      ) : null}

      {/* ========================================
          WORK EXPERIENCE
      ======================================== */}

      {workExperiences.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            WORK EXPERIENCE
          </Text>

          {workExperiences.map((experience, index) => (
            <View
              key={experience._id || index}
              style={{
                marginBottom: 11,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* LEFT */}

                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {experience.jobTitle}
                  </Text>

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                    }}
                  >
                    {experience.company}
                  </Text>
                </View>

                {/* RIGHT */}

                <View
                  style={{
                    width: 150,
                    alignItems: "flex-end",
                  }}
                >
                  {experience.location ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {experience.location}
                    </Text>
                  ) : null}

                  {experience.periodOfEmployment ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#6B7280",
                        textAlign: "right",
                        marginTop: 2,
                      }}
                    >
                      {experience.periodOfEmployment}
                    </Text>
                  ) : null}
                </View>
              </View>

              {experience.description ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 4,
                  }}
                >
                  {experience.description}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* ========================================
          EDUCATION
      ======================================== */}

      {educations.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            EDUCATION
          </Text>

          {educations.map((education, index) => (
            <View
              key={education.id || index}
              style={{
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* LEFT */}

                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  {education.degreeField ? (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#111827",
                      }}
                    >
                      {education.degreeField}
                    </Text>
                  ) : null}

                  {education.school ? (
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#374151",
                        marginTop: 2,
                      }}
                    >
                      {education.school}
                    </Text>
                  ) : null}
                </View>

                {/* RIGHT */}

                <View
                  style={{
                    width: 150,
                    alignItems: "flex-end",
                  }}
                >
                  {education.location ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {education.location}
                    </Text>
                  ) : null}

                  {education.schoolYear ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#6B7280",
                        textAlign: "right",
                        marginTop: 2,
                      }}
                    >
                      {education.schoolYear}
                    </Text>
                  ) : null}
                </View>
              </View>

              {education.description ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 4,
                  }}
                >
                  {education.description}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* ========================================
          SKILLS
      ======================================== */}

      {skills ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            SKILLS
          </Text>

          <Text
            style={{
              fontSize: 9,
              color: "#374151",
              lineHeight: 13,
            }}
          >
            {skills}
          </Text>
        </View>
      ) : null}

      {/* ========================================
          PROJECTS
      ======================================== */}

      {projects.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            PROJECTS
          </Text>

          {projects.map((project, index) => (
            <View
              key={project._id || index}
              style={{
                marginBottom: 10,
              }}
            >
              {project.projectName ? (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  {project.projectName}
                </Text>
              ) : null}

              {project.projectDescription ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 3,
                  }}
                >
                  {project.projectDescription}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* ========================================
          CERTIFICATIONS
      ======================================== */}

      {certificates ? (
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            CERTIFICATIONS
          </Text>

          <Text
            style={{
              fontSize: 9,
              color: "#374151",
              lineHeight: 13,
            }}
          >
            {certificates}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default ClassicTemplate;
