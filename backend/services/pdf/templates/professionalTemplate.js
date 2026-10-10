const {
  escapeHTML,
  formatText,
  getProfessionalSummary,
  getSkills,
  getCertificates,
  getWorkExperiences,
  getEducations,
  getProjects,
  getHeader,
} = require("../pdfHelpers");

const professionalTemplate = (resume) => {
  const summary = getProfessionalSummary(resume);

  const skills = getSkills(resume);

  const certificates = getCertificates(resume);

  const experiences = getWorkExperiences(resume);

  const educations = getEducations(resume);

  const projects = getProjects(resume);

  return `
    <div class="page professional">

      ${getHeader(resume, "professional")}

      ${
        summary
          ? `
            <section class="section">
              <h2>
                PROFESSIONAL SUMMARY
              </h2>

              <div class="content">
                ${formatText(summary)}
              </div>
            </section>
          `
          : ""
      }

      ${
        experiences.length
          ? `
            <section class="section">
              <h2>
                PROFESSIONAL EXPERIENCE
              </h2>

              ${experiences
                .map(
                  (experience) => `
                    <div class="experience">

                      <div class="row">

                        <div class="left">

                          ${
                            experience.jobTitle
                              ? `
                                <div class="job-title">
                                  ${escapeHTML(experience.jobTitle)}
                                </div>
                              `
                              : ""
                          }

                          ${
                            experience.company
                              ? `
                                <div class="company">
                                  ${escapeHTML(experience.company)}
                                </div>
                              `
                              : ""
                          }

                        </div>

                        <div class="right">

                          ${
                            experience.location
                              ? `
                                <div>
                                  ${escapeHTML(experience.location)}
                                </div>
                              `
                              : ""
                          }

                          ${
                            experience.periodOfEmployment
                              ? `
                                <div class="period">
                                  ${escapeHTML(experience.periodOfEmployment)}
                                </div>
                              `
                              : ""
                          }

                        </div>

                      </div>

                      ${
                        experience.description
                          ? `
                            <div class="description">
                              ${formatText(experience.description)}
                            </div>
                          `
                          : ""
                      }

                    </div>
                  `,
                )
                .join("")}
            </section>
          `
          : ""
      }

      ${
        educations.length
          ? `
            <section class="section">
              <h2>EDUCATION</h2>

              ${educations
                .map(
                  (education) => `
                    <div class="education">

                      <div class="row">

                        <div class="left">

                          ${
                            education.degreeField
                              ? `
                                <div class="degree">
                                  ${escapeHTML(education.degreeField)}
                                </div>
                              `
                              : ""
                          }

                          ${
                            education.school
                              ? `
                                <div class="school">
                                  ${escapeHTML(education.school)}
                                </div>
                              `
                              : ""
                          }

                        </div>

                        <div class="right">

                          ${
                            education.location
                              ? `
                                <div>
                                  ${escapeHTML(education.location)}
                                </div>
                              `
                              : ""
                          }

                          ${
                            education.schoolYear
                              ? `
                                <div class="period">
                                  ${escapeHTML(education.schoolYear)}
                                </div>
                              `
                              : ""
                          }

                        </div>

                      </div>

                      ${
                        education.description
                          ? `
                            <div class="description">
                              ${formatText(education.description)}
                            </div>
                          `
                          : ""
                      }

                    </div>
                  `,
                )
                .join("")}
            </section>
          `
          : ""
      }

      ${
        skills
          ? `
            <section class="section">
              <h2>SKILLS</h2>

              <div class="content">
                ${formatText(skills)}
              </div>
            </section>
          `
          : ""
      }

      ${
        projects.length
          ? `
            <section class="section">
              <h2>PROJECTS</h2>

              ${projects
                .map(
                  (project) => `
                    <div class="project">

                      ${
                        project.projectName
                          ? `
                            <div class="project-name">
                              ${escapeHTML(project.projectName)}
                            </div>
                          `
                          : ""
                      }

                      ${
                        project.projectDescription
                          ? `
                            <div class="description">
                              ${formatText(project.projectDescription)}
                            </div>
                          `
                          : ""
                      }

                    </div>
                  `,
                )
                .join("")}
            </section>
          `
          : ""
      }

      ${
        certificates
          ? `
            <section class="section">
              <h2>CERTIFICATIONS</h2>

              <div class="content">
                ${formatText(certificates)}
              </div>
            </section>
          `
          : ""
      }

    </div>
  `;
};

module.exports = professionalTemplate;
