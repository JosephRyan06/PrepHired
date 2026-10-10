import React from "react";
import { View, Text } from "react-native";

const ProfessionalTemplate = ({ resume, preview = false }) => {
  const scale = preview ? 0.55 : 1;

  const aiOptimization = resume?.aiOptimization;

  const fullName = resume?.basicInfo?.fullName || "Your Name";

  const linkedInURL = resume?.basicInfo.linkedInURL;
  const portfolioLink = resume?.basicInfo.portfolioLink;

  // ================================
  // BASIC INFO ADDRESS
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
    resume?.workExperiences?.map((experience) => {
      const optimizedExperience = aiOptimization?.workExperiences?.find(
        (item) => String(item.id) === String(experience._id),
      );

      return {
        ...experience,

        // AI OPTIMIZED LOCATION
        location: optimizedExperience?.location || experience.location || "",

        // AI OPTIMIZED DESCRIPTION
        description:
          optimizedExperience?.optimized || experience.description || "",
      };
    }) || [];

  // ================================
  // EDUCATION
  //
  // SCHOOL       = AI OPTIMIZED
  // DEGREE/FIELD = AI OPTIMIZED
  // LOCATION     = AI OPTIMIZED
  // SCHOOL YEAR  = ORIGINAL
  // DESCRIPTION  = AI OPTIMIZED
  // ================================
  /*
  const educations =
    resume?.educations?.map((education) => {
      const optimizedEducation =
        aiOptimization?.educations?.find(
          (item) =>
            String(item.id) === String(education._id)
        );

      return {
        school:
          optimizedEducation?.school ||
          education.school ||
          "",

        degreeField:
          optimizedEducation?.degreeField ||
          education.degreeField ||
          "",

        location:
          optimizedEducation?.location ||
          education.location ||
          "",

        // ORIGINAL SCHOOL YEAR
        schoolYear:
          education.schoolYear || "",

        // AI OPTIMIZED DESCRIPTION
        description:
          optimizedEducation?.optimized ||
          education.description ||
          "",
      };
    }) || [];
    */
  const educations =
    aiOptimization?.educations?.map((education) => {
      return {
        id: education.id || "",

        // AI OPTIMIZED
        degreeField: education.degreeField || "",

        // AI OPTIMIZED
        school: education.school || "",

        // AI OPTIMIZED
        location: education.location || "",

        // ORIGINAL SCHOOL YEAR
        schoolYear: education.schoolYear || "",

        // AI OPTIMIZED DESCRIPTION
        description: education.optimized || "",
      };
    }) || [];

  // ================================
  // PROJECTS
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

      <View style={{ marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          {fullName}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: "#374151",
            marginTop: 4,
          }}
        >
          {resume?.targetJob?.jobTitle || "Professional Title"}
        </Text>

        <Text
          style={{
            fontSize: 7.5,
            color: "#4B5563",
            marginTop: 8,
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
              fontSize: 7.5,
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
              fontSize: 7.5,
              color: "#2563EB",
              marginTop: 3,
            }}
          >
            {resume.basicInfo.portfolioLink}
          </Text>
        ) : null}
      </View>

      <View
        style={{
          height: 2,
          backgroundColor: "#111827",
          marginBottom: 18,
          width: "100%",
        }}
      />

      {professionalSummary ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            PROFESSIONAL SUMMARY
          </Text>

          <Text
            style={{
              fontSize: 8.5,
              color: "#374151",
              lineHeight: 13,
              width: preview ? "100%" : "100%",
            }}
          >
            {professionalSummary}
          </Text>
        </View>
      ) : null}

      {/* ========================================
          PROFESSIONAL EXPERIENCE
      ======================================== */}

      {workExperiences.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            PROFESSIONAL EXPERIENCE
          </Text>

          {workExperiences.map((experience, index) => (
            <View
              key={experience._id || index}
              style={{
                marginBottom: 12,
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
                      fontSize: 8,
                      color: "#374151",
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
                  {/* AI OPTIMIZED LOCATION */}

                  {experience.location ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {experience.location}
                    </Text>
                  ) : null}

                  {/* ORIGINAL PERIOD */}

                  {experience.periodOfEmployment ? (
                    <Text
                      style={{
                        fontSize: 7.5,
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

              {/* DESCRIPTION */}

              {experience.description ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 5,
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
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            EDUCATION
          </Text>

          {educations.map((education, index) => (
            <View
              key={resume?.educations?.[index]?._id || index}
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
                  {/* AI DEGREE/FIELD */}

                  {education.degreeField ? (
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "bold",
                        color: "#111827",
                      }}
                    >
                      {education.degreeField}
                    </Text>
                  ) : null}

                  {/* AI SCHOOL */}

                  {education.school ? (
                    <Text
                      style={{
                        fontSize: 8,
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
                  {/* AI LOCATION */}

                  {education.location ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {education.location}
                    </Text>
                  ) : null}

                  {/* ORIGINAL SCHOOL YEAR */}

                  {education.schoolYear ? (
                    <Text
                      style={{
                        fontSize: 7.5,
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

              {/* AI OPTIMIZED DESCRIPTION */}
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
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            SKILLS
          </Text>

          <Text
            style={{
              fontSize: 8.5,
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
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
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
                    fontSize: 9,
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
              fontSize: 11,
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            CERTIFICATIONS
          </Text>

          <Text
            style={{
              fontSize: 8.5,
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

export default ProfessionalTemplate;
