import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import ResumeHeader from "../../../components/ResumeHeader";
import Button from "../../../components/Button";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../../styles/global";

import useResume from "../../../hooks/useResume";

const UploadedAiGeneratedResume = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const { getById, loading } = useResume();

  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState("optimized");

  const [error, setError] = useState("");

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setError("");

      const result = await getById(resumeId);

      if (!result.success || !result.resume) {
        setError(
          result.message || "Unable to load resume"
        );
        return;
      }

      setResume(result.resume);
    } catch (error) {
      console.log(
        "Load AI generated resume error:",
        error
      );

      setError(
        "Unable to load AI generated resume"
      );
    }
  };

  /*
   * SAFELY CONVERT VALUES TO TEXT
   */
  const getText = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => getText(item))
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      return (
        getText(value.optimized) ||
        getText(value.original) ||
        ""
      );
    }

    return "";
  };

  const optimization =
    resume?.aiOptimization;

  const originalAnalysis =
    resume?.aiAnalysis || {};

  const optimizedAnalysis =
    optimization?.optimizedAnalysis || {};

  const originalScore =
    originalAnalysis?.atsScore || 0;

  const optimizedScore =
    optimizedAnalysis?.atsScore ??
    originalScore;

  const scoreImprovement =
    optimizedScore - originalScore;

  /*
   * SUMMARY
   */

  const originalSummary =
    getText(
      optimization?.professionalSummary
        ?.original
    ) ||
    getText(
      resume?.professionalSummary
    );

  const optimizedSummary =
    getText(
      optimization?.professionalSummary
        ?.optimized
    ) ||
    getText(
      resume?.professionalSummary
    );

  /*
   * SKILLS
   */

  const originalSkills =
    getText(
      optimization?.skills?.original
    ) ||
    getText(resume?.skills);

  const optimizedSkills =
    getText(
      optimization?.skills?.optimized
    ) ||
    getText(resume?.skills);

  /*
   * CERTIFICATES
   */

  const originalCertificates =
    getText(
      optimization?.certificates
        ?.original
    ) ||
    getText(resume?.certificates);

  const optimizedCertificates =
    getText(
      optimization?.certificates
        ?.optimized
    ) ||
    getText(resume?.certificates);

  /*
   * SECTION TITLE
   */

  const renderSectionTitle = (
    title,
    icon
  ) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 15,
        }}
      >
        <Ionicons
          name={icon}
          size={17}
          color="#60A5FA"
        />

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 14,
            fontWeight: "700",
            marginLeft: 7,
          }}
        >
          {title}
        </Text>
      </View>
    );
  };

  /*
   * TEXT
   */

  const renderText = (value) => {
    const text = getText(value);

    if (!text.trim()) {
      return null;
    }

    return (
      <Text
        style={{
          color: "#D4D4D8",
          fontSize: 13,
          lineHeight: 20,
        }}
      >
        {text}
      </Text>
    );
  };

  /*
   * WORK EXPERIENCE
   */

  /*
  const renderExperience = () => {
    const originalExperiences =
      resume?.workExperiences || [];

    const optimizedExperiences =
      optimization?.workExperiences || [];

    if (!originalExperiences.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No work experience added.
        </Text>
      );
    }

    return originalExperiences.map(
      (experience, index) => {
        const optimizedExperience =
          optimizedExperiences.find(
            (item) =>
              String(item.id) ===
              String(
                experience._id ||
                  experience.id
              )
          );

        let jobTitle = "";
        let company = "";
        let location = "";
        let description = "";

        if (
          activeTab === "original"
        ) {
          jobTitle = getText(
            experience.jobTitle
          );

          company = getText(
            experience.company
          );

          location = getText(
            experience.location
          );

          description = getText(
            experience.description
          );
        } else {
          jobTitle =
            getText(
              optimizedExperience?.jobTitle
            ) ||
            getText(
              experience.jobTitle
            );

          company =
            getText(
              optimizedExperience?.company
            ) ||
            getText(
              experience.company
            );

          location =
            getText(
              optimizedExperience?.location
            ) ||
            getText(
              experience.location
            );

          description =
            getText(
              optimizedExperience?.optimized
            ) ||
            getText(
              experience.description
            );
        }

        return (
          <View
            key={
              experience._id ||
              experience.id ||
              index
            }
            style={{
              marginBottom: 15,
              paddingBottom: 15,
              borderBottomWidth:
                index !==
                originalExperiences.length - 1
                  ? 1
                  : 0,
              borderBottomColor:
                "#3F3F4A",
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {jobTitle ||
                "Untitled Position"}
            </Text>

            <Text
              style={{
                color: "#60A5FA",
                fontSize: 12,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              {company ||
                "Company not specified"}
            </Text>

            {location ? (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {location}
              </Text>
            ) : null}

            {description ? (
              <View
                style={{
                  marginTop: 8,
                }}
              >
                {renderText(
                  description
                )}
              </View>
            ) : (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No description added.
              </Text>
            )}
          </View>
        );
      }
    );
  };
  */

  const renderExperience = () => {
  const originalExperiences =
    resume?.workExperiences || [];

  const optimizedExperiences =
    optimization?.workExperiences || [];

  /*
   * ORIGINAL TAB
   * Always render resume.workExperiences
   */
  if (activeTab === "original") {
    if (!originalExperiences.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No work experience added.
        </Text>
      );
    }

    return originalExperiences.map(
      (experience, index) => {
        const jobTitle =
          getText(
            experience.jobTitle
          ).trim();

        const company =
          getText(
            experience.company
          ).trim();

        const location =
          getText(
            experience.location
          ).trim();

        const periodOfEmployment =
          getText(
            experience.periodOfEmployment
          ).trim();

        const description =
          getText(
            experience.description
          ).trim();

        return (
          <View
            key={
              experience._id ||
              experience.id ||
              index
            }
            style={{
              marginBottom: 15,
              paddingBottom: 15,
              borderBottomWidth:
                index !==
                originalExperiences.length - 1
                  ? 1
                  : 0,
              borderBottomColor:
                "#3F3F4A",
            }}
          >
            {jobTitle ? (
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {jobTitle}
              </Text>
            ) : null}

            {company ? (
              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 3,
                }}
              >
                {company}
              </Text>
            ) : null}

            {location ? (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {location}
              </Text>
            ) : null}

            {periodOfEmployment ? (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {periodOfEmployment}
              </Text>
            ) : null}

            {description ? (
              <View
                style={{
                  marginTop: 8,
                }}
              >
                {renderText(description)}
              </View>
            ) : (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No work experience description added.
              </Text>
            )}
          </View>
        );
      }
    );
  }

  /*
   * OPTIMIZED TAB
   * Always render optimization.workExperiences
   */
  if (!optimizedExperiences.length) {
    return (
      <Text
        style={{
          color: "#71717A",
          fontSize: 13,
        }}
      >
        No optimized work experience added.
      </Text>
    );
  }

  return optimizedExperiences.map(
    (experience, index) => {
      const jobTitle =
        getText(
          experience.jobTitle
        ).trim();

      const company =
        getText(
          experience.company
        ).trim();

      const location =
        getText(
          experience.location
        ).trim();

      const periodOfEmployment =
        getText(
          experience.periodOfEmployment
        ).trim();

      const description =
        getText(
          experience.description
        ).trim();

      /*
       * Don't render completely empty
       * AI work experience objects.
       */
      if (
        !jobTitle &&
        !company &&
        !location &&
        !periodOfEmployment &&
        !description
      ) {
        return null;
      }

      return (
        <View
          key={
            experience._id ||
            experience.id ||
            index
          }
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth:
              index !==
              optimizedExperiences.length - 1
                ? 1
                : 0,
            borderBottomColor:
              "#3F3F4A",
          }}
        >
          {jobTitle ? (
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {jobTitle}
            </Text>
          ) : null}

          {company ? (
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 12,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              {company}
            </Text>
          ) : null}

          {location ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {location}
            </Text>
          ) : null}

          {periodOfEmployment ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {periodOfEmployment}
            </Text>
          ) : null}

          {description ? (
            <View
              style={{
                marginTop: 8,
              }}
            >
              {renderText(description)}
            </View>
          ) : (
            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                marginTop: 8,
              }}
            >
              No work experience description added.
            </Text>
          )}
        </View>
      );
    }
  );
};


const renderEducation = () => {
  const originalEducations =
    resume?.educations || [];

  const optimizedEducations =
    optimization?.educations || [];

  /*
   * ORIGINAL TAB
   * Always render resume.educations
   */
  if (activeTab === "original") {
    if (!originalEducations.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No education added.
        </Text>
      );
    }

    return originalEducations.map(
      (education, index) => {
        const school =
          getText(education.school).trim();

        const degreeField =
          getText(
            education.degreeField
          ).trim();

        const location =
          getText(
            education.location
          ).trim();

        const schoolYear =
          getText(
            education.schoolYear
          ).trim();

        const description =
          getText(
            education.description
          ).trim();

        return (
          <View
            key={
              education._id ||
              education.id ||
              index
            }
            style={{
              marginBottom: 15,
              paddingBottom: 15,
              borderBottomWidth:
                index !==
                originalEducations.length - 1
                  ? 1
                  : 0,
              borderBottomColor:
                "#3F3F4A",
            }}
          >
            {degreeField ? (
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {degreeField}
              </Text>
            ) : null}

            {school ? (
              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 3,
                }}
              >
                {school}
              </Text>
            ) : null}

            {location ? (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {location}
              </Text>
            ) : null}

            {schoolYear ? (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {schoolYear}
              </Text>
            ) : null}

            {description ? (
              <View
                style={{
                  marginTop: 8,
                }}
              >
                {renderText(description)}
              </View>
            ) : (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No education description added.
              </Text>
            )}
          </View>
        );
      }
    );
  }

  if (!optimizedEducations.length) {
    return (
      <Text
        style={{
          color: "#71717A",
          fontSize: 13,
        }}
      >
        No optimized education added.
      </Text>
    );
  }

  return optimizedEducations.map(
    (education, index) => {
      const school =
        getText(
          education.school
        ).trim();

      const degreeField =
        getText(
          education.degreeField
        ).trim();

      const location =
        getText(
          education.location
        ).trim();

      const schoolYear =
        getText(
          education.schoolYear
        ).trim();

      const description =
        getText(
          education.description
        ).trim();

      /*
       * Don't render completely empty
       * AI education objects.
       */
      if (
        !school &&
        !degreeField &&
        !location &&
        !schoolYear &&
        !description
      ) {
        return null;
      }

      return (
        <View
          key={
            education.id ||
            index
          }
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth:
              index !==
              optimizedEducations.length - 1
                ? 1
                : 0,
            borderBottomColor:
              "#3F3F4A",
          }}
        >
          {degreeField ? (
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {degreeField}
            </Text>
          ) : null}

          {school ? (
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 12,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              {school}
            </Text>
          ) : null}

          {location ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {location}
            </Text>
          ) : null}

          {schoolYear ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {schoolYear}
            </Text>
          ) : null}

          {description ? (
            <View
              style={{
                marginTop: 8,
              }}
            >
              {renderText(description)}
            </View>
          ) : 
          <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No education description added.
              </Text>
    }
        </View>
      );
    }
  );
};

  /*
   * PROJECTS
   */
  /*
  const renderProjects = () => {
    const originalProjects =
      resume?.projects || [];

    const optimizedProjects =
      optimization?.projects || [];

    if (!originalProjects.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No projects added.
        </Text>
      );
    }

    return originalProjects.map(
      (originalProject, index) => {
        const optimizedProject =
          optimizedProjects.find(
            (item) =>
              String(item.id) ===
              String(
                originalProject._id ||
                  originalProject.id
              )
          );

        let projectName = "";
        let description = "";

        if (
          activeTab === "original"
        ) {
          projectName =
            getText(
              originalProject.projectName
            ).trim();

          description =
            getText(
              originalProject.projectDescription
            ).trim();
        } else {
          projectName =
            getText(
              optimizedProject?.projectName
            ).trim() ||
            getText(
              originalProject.projectName
            ).trim();

          description =
            getText(
              optimizedProject?.optimized
            ).trim() ||
            getText(
              originalProject.projectDescription
            ).trim();
        }

        if (
          !projectName &&
          !description
        ) {
          return null;
        }

        return (
          <View
            key={
              originalProject._id ||
              originalProject.id ||
              index
            }
            style={{
              marginBottom: 15,
              paddingBottom: 15,
              borderBottomWidth:
                index !==
                originalProjects.length - 1
                  ? 1
                  : 0,
              borderBottomColor:
                "#3F3F4A",
            }}
          >
            {projectName ? (
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {projectName}
              </Text>
            ) : null}

            {description ? (
              <View
                style={{
                  marginTop: 8,
                }}
              >
                {renderText(
                  description
                )}
              </View>
            ) : (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No project description
                added.
              </Text>
            )}
          </View>
        );
      }
    );
  };
  */
 
  const renderProjects = () => {
  const originalProjects =
    resume?.projects || [];

  const optimizedProjects =
    resume?.aiOptimization?.projects || [];

  /*
   * ORIGINAL TAB
   * Always render resume.projects
   */
  if (activeTab === "original") {
    if (!originalProjects.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No projects added.
        </Text>
      );
    }

    return originalProjects.map(
      (project, index) => {
        if (!project) {
          return null;
        }

        const projectName =
          getText(
            project.projectName
          ).trim();

        const description =
          getText(
            project.projectDescription
          ).trim();

        /*
         * Don't render completely empty
         * project objects.
         */
        if (
          !projectName &&
          !description
        ) {
          return null;
        }

        return (
          <View
            key={
              project._id ||
              project.id ||
              index
            }
            style={{
              borderBottomWidth:
                index !==
                originalProjects.length - 1
                  ? 1
                  : 0,
              borderBottomColor:
                "#3F3F4A",
            }}
          >
            {projectName ? (
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {projectName}
              </Text>
            ) : null}

            {description ? (
              <View
                style={{
                  marginTop: 8,
                }}
              >
                {renderText(description)}
              </View>
            ) : (
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                No project description added.
              </Text>
            )}
          </View>
        );
      }
    );
  }

  /*
   * AI OPTIMIZED TAB
   * Always render resume.aiOptimization.projects
   */
  if (!optimizedProjects.length) {
    return (
      <Text
        style={{
          color: "#71717A",
          fontSize: 13,
        }}
      >
        No optimized projects added.
      </Text>
    );
  }

  return optimizedProjects.map(
    (project, index) => {
      if (!project) {
        return null;
      }

      const projectName =
        getText(
          project.projectName
        ).trim();

      const projectDescription =
        getText(
          project.projectDescription
        ).trim();

      /*
       * Don't render completely empty
       * AI project objects.
       */
      if (
        !projectName &&
        !projectDescription
      ) {
        return null;
      }

      return (
        <View
          key={
            project.id ||
            index
          }
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth:
              index !==
              optimizedProjects.length - 1
                ? 1
                : 0,
            borderBottomColor:
              "#3F3F4A",
          }}
        >
          {projectName ? (
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {projectName}
            </Text>
          ) : null}

          {projectDescription ? (
            <View
              style={{
                marginTop: 8,
              }}
            >
              {renderText(projectDescription)}
            </View>
          ) : (
            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                marginTop: 8,
              }}
            >
              No project description added.
            </Text>
          )}
        </View>
      );
    }
  );
};



  /*
   * CERTIFICATES
   */

  const renderCertificates = () => {
    const certificates =
      activeTab === "original"
        ? originalCertificates
        : optimizedCertificates;

    if (!certificates.trim()) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No certificates/licenses
          added.
        </Text>
      );
    }

    return renderText(
      certificates
    );
  };

  /*
   * ORIGINAL ANALYSIS
   */

  const matchingKeywords =
    originalAnalysis?.matchingKeywords ||
    [];

  const missingKeywords =
    originalAnalysis?.missingKeywords ||
    [];

  const recommendations =
    originalAnalysis?.recommendations ||
    [];

  /*
   * STRING LIST
   */

  const renderStringList = (
    items,
    emptyText
  ) => {
    const validItems =
      Array.isArray(items)
        ? items
            .map((item) =>
              getText(item)
            )
            .filter(Boolean)
        : [];

    if (!validItems.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          {emptyText}
        </Text>
      );
    }

    return validItems.map(
      (item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            marginBottom:
              index !==
              validItems.length - 1
                ? 9
                : 0,
          }}
        >
          <Text
            style={{
              color: "#60A5FA",
              fontSize: 13,
              marginRight: 8,
            }}
          >
            •
          </Text>

          <Text
            style={{
              flex: 1,
              color: "#D4D4D8",
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {item}
          </Text>
        </View>
      )
    );
  };

  /*
   * ORIGINAL ANALYSIS
   */

  const renderOriginalAnalysis = () => {
    return (
      <>
        <Text
          style={{
            color: "#F8FAFC",
            fontWeight: "700",
            fontSize: 15,
            marginBottom: 15,
          }}
        >
          Resume Analysis
        </Text>

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="pricetags-outline"
              size={18}
              color="#60A5FA"
            />

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
                marginLeft: 7,
              }}
            >
              Matching Keywords
            </Text>
          </View>

          {renderStringList(
            matchingKeywords,
            "No weaknesses identified."
          )}
        </View>

        {/* MISSING KEYWORDS */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="key-outline"
              size={18}
              color="#FBBF24"
            />

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
                marginLeft: 7,
              }}
            >
              Missing Keywords
            </Text>
          </View>

          {renderStringList(
            missingKeywords,
            "No missing keywords identified."
          )}
        </View>

        {/* POSSIBLE IMPROVEMENTS */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="bulb-outline"
              size={18}
              color="#60A5FA"
            />

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
                marginLeft: 7,
              }}
            >
              Possible Improvements
            </Text>
          </View>

          {renderStringList(
            recommendations,
            "No possible improvements identified."
          )}
        </View>
      </>
    );
  };

  /*
   * AI OPTIMIZED ANALYSIS
   */

  const changes =
    Array.isArray(
      optimization?.changes
    )
      ? optimization.changes
      : [];

  /*
   * CHANGE REASONS
   */

  const renderChangeReasons = () => {
  const reasons = [];

  const originalProjects =
    Array.isArray(resume?.projects)
      ? resume.projects
      : [];

  const originalCertificates =
    getText(resume?.certificates).trim();

  // PROFESSIONAL SUMMARY
  if (
    getText(
      optimization?.professionalSummary?.reason
    ).trim()
  ) {
    reasons.push({
      title: "Professional Summary",
      reason: getText(
        optimization.professionalSummary.reason
      ),
      icon: "document-text-outline",
    });
  }

  // SKILLS
  if (
    getText(
      optimization?.skills?.reason
    ).trim()
  ) {
    reasons.push({
      title: "Skills",
      reason: getText(
        optimization.skills.reason
      ),
      icon: "sparkles-outline",
    });
  }

  // CERTIFICATES / LICENSES
  // Only show if certificates originally exist
  // AND AI provided a reason.
  if (
    originalCertificates &&
    getText(
      optimization?.certificates?.reason
    ).trim()
  ) {
    reasons.push({
      title: "Certificates / Licenses",
      reason: getText(
        optimization.certificates.reason
      ),
      icon: "ribbon-outline",
    });
  }

  // WORK EXPERIENCE
  // Only show if AI provided a reason.
  (
    optimization?.workExperiences || []
  ).forEach((experience) => {
    const reason =
      getText(
        experience.reason
      ).trim();

    if (reason) {
      reasons.push({
        title: "Work Experience",
        reason,
        icon: "briefcase-outline",
      });
    }
  });

  // EDUCATION
  // Only show if AI provided a reason.
  (
    optimization?.educations || []
  ).forEach((education) => {
    const reason =
      getText(
        education.reason
      ).trim();

    if (reason) {
      reasons.push({
        title: "Education",
        reason,
        icon: "school-outline",
      });
    }
  });

  // PROJECTS
  // Only show if projects originally exist
  // AND AI provided a reason.
  if (originalProjects.length > 0) {
    (
      optimization?.projects || []
    ).forEach((project) => {
      const reason =
        getText(
          project.reason
        ).trim();

      if (reason) {
        reasons.push({
          title: "Projects",
          reason,
          icon: "folder-outline",
        });
      }
    });
  }

  return reasons;
};


  const reasonItems =
    renderChangeReasons();

  /*
   * OPTIMIZED ANALYSIS
   */

  const renderOptimizedAnalysis =
    () => {
      return (
        <>
          <Text
            style={{
              color: "#F8FAFC",
              fontWeight: "700",
              fontSize: 15,
              marginBottom: 15,
            }}
          >
            Improvements
          </Text>

          {/* MAJOR IMPROVEMENTS */}

          {changes.length > 0 ? (
            <View
              style={{
                backgroundColor:
                  "#25252F",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color="#60A5FA"
                />

                <Text
                  style={{
                    color:
                      "#F8FAFC",
                    fontSize: 14,
                    fontWeight:
                      "700",
                    marginLeft: 7,
                  }}
                >
                  Major Improvements
                </Text>
              </View>

              {renderStringList(
                changes,
                "No major improvements added."
              )}
            </View>
          ) : null}

          {/* REASONS */}

          {reasonItems.length >
          0
            ? reasonItems.map(
                (
                  item,
                  index
                ) => (
                  <View
                    key={`${item.title}-${index}`}
                    style={{
                      backgroundColor:
                        "#25252F",
                      borderRadius:
                        16,
                      padding: 16,
                      marginBottom:
                        12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection:
                          "row",
                        alignItems:
                          "center",
                        marginBottom:
                          8,
                      }}
                    >
                      <Ionicons
                        name={
                          item.icon
                        }
                        size={17}
                        color="#60A5FA"
                      />

                      <Text
                        style={{
                          color:
                            "#F8FAFC",
                          fontSize: 13,
                          fontWeight:
                            "700",
                          marginLeft:
                            7,
                        }}
                      >
                        {getText(
                          item.title
                        )}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color:
                          "#A1A1AA",
                        fontSize: 12,
                        lineHeight:
                          18,
                      }}
                    >
                      {getText(
                        item.reason
                      )}
                    </Text>
                  </View>
                )
              )
            : null}

          {!changes.length &&
          !reasonItems.length ? (
            <View
              style={{
                backgroundColor:
                  "#25252F",
                borderRadius: 16,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color:
                    "#71717A",
                  fontSize: 13,
                  lineHeight: 19,
                }}
              >
                No improvements
                added.
              </Text>
            </View>
          ) : null}
        </>
      );
    };

  /*
   * CHOOSE TEMPLATE
   */

  const handleChooseTemplate =
    () => {
      navigation.navigate(
        "ChooseTemplate",
        {
          resumeId,
        }
      );
    };


  if (loading && !resume) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent:
              "center",
            alignItems:
              "center",
          },
        ]}
      >
        <Text
          style={{
            color: "#A1A1AA",
            marginBottom: 12,
          }}
        >
          Loading resume...
        </Text>
      </View>
    );
  }

  /*
   * ERROR
   */

  if (error && !resume) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent:
              "center",
            padding: 20,
          },
        ]}
      >
        <Text
          style={{
            color: "#F87171",
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="AI Generated Resume"
          resumeId={resumeId}
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
          6/8
        </Text>

        <View
          style={{
            backgroundColor:
              "#25252F",
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
                width: "75%",
              },
            ]}
          />
        </View>

        <Text
          style={{
            color: "#A1A1AA",
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 15,
          }}
        >
          Review your AI-optimized
          resume and see what changed.
        </Text>

        {/* ATS SCORE */}

        <View
          style={{
            backgroundColor:
              "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection:
                "row",
              justifyContent:
                "space-between",
              alignItems:
                "center",
            }}
          >
            <View>
              <Text
                style={{
                  color:
                    "#A1A1AA",
                  fontSize: 12,
                  fontWeight:
                    "600",
                }}
              >
                ATS SCORE
              </Text>

              <Text
                style={{
                  color:
                    "#F8FAFC",
                  fontSize: 28,
                  fontWeight:
                    "800",
                  marginTop: 3,
                }}
              >
                {optimizedScore}

                <Text
                  style={{
                    color:
                      "#71717A",
                    fontSize: 14,
                    fontWeight:
                      "500",
                  }}
                >
                  /100
                </Text>
              </Text>
            </View>

            {scoreImprovement !==
            0 ? (
              <View
                style={{
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  backgroundColor:
                    scoreImprovement >
                    0
                      ? "#173B2A"
                      : "#3A2528",
                  borderRadius: 14,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Ionicons
                  name={
                    scoreImprovement >
                    0
                      ? "trending-up-outline"
                      : "trending-down-outline"
                  }
                  size={15}
                  color={
                    scoreImprovement >
                    0
                      ? "#4ADE80"
                      : "#F87171"
                  }
                />

                <Text
                  style={{
                    color:
                      scoreImprovement >
                      0
                        ? "#4ADE80"
                        : "#F87171",
                    fontSize: 12,
                    fontWeight:
                      "700",
                    marginLeft: 4,
                  }}
                >
                  {scoreImprovement >
                  0
                    ? "+"
                    : ""}
                  {
                    scoreImprovement
                  }
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flexDirection:
                "row",
              marginTop: 12,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    "#71717A",
                  fontSize: 11,
                }}
              >
                Original
              </Text>

              <Text
                style={{
                  color:
                    "#D4D4D8",
                  fontSize: 14,
                  fontWeight:
                    "700",
                  marginTop: 2,
                }}
              >
                {originalScore}
                /100
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    "#71717A",
                  fontSize: 11,
                }}
              >
                AI Optimized
              </Text>

              <Text
                style={{
                  color:
                    "#60A5FA",
                  fontSize: 14,
                  fontWeight:
                    "700",
                  marginTop: 2,
                }}
              >
                {optimizedScore}
                /100
              </Text>
            </View>
          </View>
        </View>

        {/* TABS */}

        <View
          style={{
            flexDirection:
              "row",
            justifyContent:
              "space-between",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setActiveTab(
                "original"
              )
            }
            activeOpacity={0.7}
            style={{
              width: "48%",
            }}
          >
            <View
              style={{
                height: 36,
                backgroundColor:
                  activeTab ===
                  "original"
                    ? "#2563EB"
                    : "#25252F",
                borderRadius: 18,
                alignItems:
                  "center",
                justifyContent:
                  "center",
                borderWidth:
                  activeTab ===
                  "original"
                    ? 0
                    : 1,
                borderColor:
                  "#2563EB",
              }}
            >
              <Text
                style={{
                  color:
                    "#F8FAFC",
                  fontWeight:
                    "700",
                  fontSize: 12,
                }}
              >
                Original
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setActiveTab(
                "optimized"
              )
            }
            activeOpacity={0.7}
            style={{
              width: "48%",
            }}
          >
            <View
              style={{
                height: 36,
                backgroundColor:
                  activeTab ===
                  "optimized"
                    ? "#2563EB"
                    : "#25252F",
                borderRadius: 18,
                alignItems:
                  "center",
                justifyContent:
                  "center",
                borderWidth:
                  activeTab ===
                  "optimized"
                    ? 0
                    : 1,
                borderColor:
                  "#2563EB",
              }}
            >
              <Text
                style={{
                  color:
                    "#F8FAFC",
                  fontWeight:
                    "700",
                  fontSize: 12,
                }}
              >
                AI Optimized
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* RESUME CONTENT */}

        <View
          style={{
            backgroundColor:
              "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          {/* SUMMARY */}

          {renderSectionTitle(
            "Professional Summary",
            "document-text-outline"
          )}

          {activeTab ===
          "original"
            ? originalSummary
              ? renderText(
                  originalSummary
                )
              : (
                <Text
                  style={{
                    color:
                      "#71717A",
                    fontSize: 13,
                  }}
                >
                  No professional
                  summary added.
                </Text>
              )
            : optimizedSummary
              ? renderText(
                  optimizedSummary
                )
              : (
                <Text
                  style={{
                    color:
                      "#71717A",
                    fontSize: 13,
                  }}
                >
                  No professional
                  summary added.
                </Text>
              )}

          {/* WORK EXPERIENCE */}

          {renderSectionTitle(
            "Work Experience",
            "briefcase-outline"
          )}

          {renderExperience()}

          {/* EDUCATION */}

          {renderSectionTitle(
            "Education",
            "school-outline"
          )}

          {renderEducation()}

          {/* SKILLS */}

          {renderSectionTitle(
            "Skills",
            "sparkles-outline"
          )}

          {activeTab ===
          "original"
            ? originalSkills
              ? renderText(
                  originalSkills
                )
              : (
                <Text
                  style={{
                    color:
                      "#71717A",
                    fontSize: 13,
                  }}
                >
                  No skills added.
                </Text>
              )
            : optimizedSkills
              ? renderText(
                  optimizedSkills
                )
              : (
                <Text
                  style={{
                    color:
                      "#71717A",
                    fontSize: 13,
                  }}
                >
                  No skills added.
                </Text>
              )}

          {/* PROJECTS */}

          {renderSectionTitle(
            "Projects",
            "folder-outline"
          )}

          {renderProjects()}

          {/* CERTIFICATES */}

          {renderSectionTitle(
            "Certificates / Licenses",
            "ribbon-outline"
          )}

          {renderCertificates()}
        </View>

        {/* ORIGINAL ANALYSIS */}

        {activeTab ===
        "original"
          ? renderOriginalAnalysis()
          : null}

        {/* OPTIMIZED ANALYSIS */}

        {activeTab ===
        "optimized"
          ? renderOptimizedAnalysis()
          : null}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Choose Template"
        onPress={
          handleChooseTemplate
        }
      />
    </View>
  );
};

export default UploadedAiGeneratedResume;
