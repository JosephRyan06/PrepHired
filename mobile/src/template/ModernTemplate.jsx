import React from "react";
import { View, Text } from "react-native";

const ModernTemplate = ({ resume, preview = false }) => {
  const scale = preview ? 0.55 : 1;

  const aiOptimization = resume?.aiOptimization;

  // ================================
  // BASIC INFO
  // ================================

  const fullName = resume?.basicInfo?.fullName || "Your Name";

  const address =
    aiOptimization?.address?.optimized || resume?.basicInfo?.address || "";

  // ================================
  // PROFESSIONAL SUMMARY
  //
  // AI OPTIMIZED
  // FALLBACK = ORIGINAL
  // ================================

  const professionalSummary =
    aiOptimization?.professionalSummary?.optimized ||
    resume?.professionalSummary ||
    "";

  // ================================
  // SKILLS
  //
  // AI OPTIMIZED
  // FALLBACK = ORIGINAL
  // ================================

  const skills = aiOptimization?.skills?.optimized || resume?.skills || "";

  // ================================
  // CERTIFICATES
  //
  // AI OPTIMIZED
  // FALLBACK = ORIGINAL
  // ================================

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

        // ORIGINAL JOB TITLE
        jobTitle: experience.jobTitle || "",

        // ORIGINAL COMPANY
        company: experience.company || "",

        // AI OPTIMIZED LOCATION
        location: optimizedExperience?.location || experience.location || "",

        // ORIGINAL PERIOD
        periodOfEmployment: experience.periodOfEmployment || "",

        // AI OPTIMIZED DESCRIPTION
        description:
          optimizedExperience?.optimized || experience.description || "",
      };
    }) || [];

  // ================================
  // EDUCATION
  //
  // DEGREE/FIELD = AI OPTIMIZED
  // SCHOOL       = AI OPTIMIZED
  // LOCATION     = AI OPTIMIZED
  // SCHOOL YEAR  = ORIGINAL
  // DESCRIPTION  = AI OPTIMIZED
  //
  // FALLBACK = ORIGINAL
  // ================================

  const educations =
    aiOptimization?.educations?.length > 0
      ? aiOptimization.educations.map((education) => ({
          id: education.id || "",

          // AI OPTIMIZED
          degreeField: education.degreeField || "",

          // AI OPTIMIZED
          school: education.school || "",

          // AI OPTIMIZED
          location: education.location || "",

          // ORIGINAL
          schoolYear: education.schoolYear || "",

          // AI OPTIMIZED
          description: education.optimized || education.description || "",
        }))
      : resume?.educations?.map((education) => ({
          id: education._id || "",

          // ORIGINAL FALLBACK
          degreeField: education.degreeField || "",

          // ORIGINAL FALLBACK
          school: education.school || "",

          // ORIGINAL FALLBACK
          location: education.location || "",

          // ORIGINAL
          schoolYear: education.schoolYear || "",

          // ORIGINAL FALLBACK
          description: education.description || "",
        })) || [];

  // ================================
  // PROJECTS
  //
  // PROJECT NAME = AI OPTIMIZED
  // DESCRIPTION  = AI OPTIMIZED
  //
  // FALLBACK = ORIGINAL
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

          // AI OPTIMIZED PROJECT NAME
          projectName:
            optimizedProject?.projectName || project.projectName || "",

          // AI OPTIMIZED DESCRIPTION
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

      <View
        style={{
          backgroundColor: "#111827",
          padding: 20,
          marginBottom: 22,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          {fullName}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: "#D1D5DB",
            marginTop: 5,
          }}
        >
          {resume?.targetJob?.jobTitle || "Professional Title"}
        </Text>

        <Text
          style={{
            fontSize: 7.5,
            color: "#D1D5DB",
            marginTop: 9,
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

        {/* LINKEDIN */}

        {resume?.basicInfo?.linkedInURL ? (
          <Text
            style={{
              fontSize: 7.5,
              color: "#93C5FD",
              marginTop: 3,
            }}
          >
            {resume.basicInfo.linkedInURL}
          </Text>
        ) : null}

        {/* PORTFOLIO */}

        {resume?.basicInfo?.portfolioLink ? (
          <Text
            style={{
              fontSize: 7.5,
              color: "#93C5FD",
              marginTop: 3,
            }}
          >
            {resume.basicInfo.portfolioLink}
          </Text>
        ) : null}
      </View>

      {/* ========================================
          SUMMARY
      ======================================== */}

      {professionalSummary ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#2563EB",
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
            }}
          >
            {professionalSummary}
          </Text>
        </View>
      ) : null}

      {/* ========================================
          EXPERIENCE
      ======================================== */}

      {workExperiences.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#2563EB",
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
                paddingLeft: 10,
                borderLeftWidth: 2,
                borderLeftColor: "#2563EB",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* LEFT SIDE */}

                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  {/* ORIGINAL JOB TITLE */}

                  {experience.jobTitle ? (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#111827",
                      }}
                    >
                      {experience.jobTitle}
                    </Text>
                  ) : null}

                  {/* ORIGINAL COMPANY */}

                  {experience.company ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#2563EB",
                        marginTop: 2,
                      }}
                    >
                      {experience.company}
                    </Text>
                  ) : null}
                </View>

                {/* RIGHT SIDE */}

                <View
                  style={{
                    width: 145,
                    alignItems: "flex-end",
                  }}
                >
                  {/* AI LOCATION */}

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

              {/* AI DESCRIPTION */}

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
              color: "#2563EB",
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
                {/* LEFT SIDE */}

                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  {/* AI DEGREE */}

                  {education.degreeField ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: "#374151",
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

                {/* RIGHT SIDE */}

                <View
                  style={{
                    width: 145,
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

              {/* AI DESCRIPTION */}

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
              color: "#2563EB",
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
              fontSize: 12,
              fontWeight: "bold",
              color: "#2563EB",
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
              {/* AI PROJECT NAME */}

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

              {/* AI PROJECT DESCRIPTION */}

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
              color: "#2563EB",
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

export default ModernTemplate;
