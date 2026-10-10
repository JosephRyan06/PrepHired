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

const minimalTemplate = (resume) => {
  const summary = getProfessionalSummary(resume);

  const skills = getSkills(resume);

  const certificates = getCertificates(resume);

  const experiences = getWorkExperiences(resume);

  const educations = getEducations(resume);

  const projects = getProjects(resume);

  return `
    <div class="page minimal">

      ${getHeader(resume, "minimal")}

      ${
        summary
          ? `
            <section class="minimal-section">
              <h2>SUMMARY</h2>
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
            <section class="minimal-section">
              <h2>EXPERIENCE</h2>

              ${experiences
                .map(
                  (experience) => `
                    <div class="minimal-item">

                      <div class="minimal-title-row">

                        <div>
                          <div class="job-title">
                            ${escapeHTML(experience.jobTitle)}
                          </div>

                          <div class="company">
                            ${escapeHTML(experience.company)}
                          </div>
                        </div>

                        <div class="minimal-meta">
                          ${
                            experience.location
                              ? escapeHTML(experience.location)
                              : ""
                          }

                          ${
                            experience.periodOfEmployment
                              ? `<br />${escapeHTML(
                                  experience.periodOfEmployment,
                                )}`
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
            <section class="minimal-section">
              <h2>EDUCATION</h2>

              ${educations
                .map(
                  (education) => `
                    <div class="minimal-item">

                      <div class="minimal-title-row">

                        <div>
                          <div class="degree">
                            ${escapeHTML(education.degreeField)}
                          </div>

                          <div class="school">
                            ${escapeHTML(education.school)}
                          </div>
                        </div>

                        <div class="minimal-meta">
                          ${
                            education.location
                              ? escapeHTML(education.location)
                              : ""
                          }

                          ${
                            education.schoolYear
                              ? `<br />${escapeHTML(education.schoolYear)}`
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
            <section class="minimal-section">
              <h2>SKILLS</h2>

              <div class="skills-text">
                ${formatText(skills)}
              </div>
            </section>
          `
          : ""
      }

      ${
        projects.length
          ? `
            <section class="minimal-section">
              <h2>PROJECTS</h2>

              ${projects
                .map(
                  (project) => `
                    <div class="minimal-project">

                      <div class="project-name">
                        ${escapeHTML(project.projectName)}
                      </div>

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
            <section class="minimal-section">
              <h2>CERTIFICATIONS</h2>

              <div class="skills-text">
                ${formatText(certificates)}
              </div>
            </section>
          `
          : ""
      }

    </div>
  `;
};

module.exports = minimalTemplate;
