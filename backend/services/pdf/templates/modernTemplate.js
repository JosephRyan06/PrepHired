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

const modernTemplate = (resume) => {
  const summary = getProfessionalSummary(resume);

  const skills = getSkills(resume);

  const certificates = getCertificates(resume);

  const experiences = getWorkExperiences(resume);

  const educations = getEducations(resume);

  const projects = getProjects(resume);

  return `
    <div class="page modern">

      ${getHeader(resume, "modern")}

      ${
        summary
          ? `
            <section class="modern-section">
              <h2>PROFESSIONAL SUMMARY</h2>

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
            <section class="modern-section">
              <h2>WORK EXPERIENCE</h2>

              ${experiences
                .map(
                  (experience) => `
                    <div class="modern-experience">

                      <div class="modern-marker"></div>

                      <div class="modern-body">

                        <div class="modern-top">

                          <div>
                            <div class="job-title">
                              ${escapeHTML(experience.jobTitle)}
                            </div>

                            <div class="company">
                              ${escapeHTML(experience.company)}
                            </div>
                          </div>

                          <div class="modern-meta">
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
            <section class="modern-section">
              <h2>EDUCATION</h2>

              ${educations
                .map(
                  (education) => `
                    <div class="modern-item">

                      <div class="modern-top">

                        <div>
                          <div class="degree">
                            ${escapeHTML(education.degreeField)}
                          </div>

                          <div class="school">
                            ${escapeHTML(education.school)}
                          </div>
                        </div>

                        <div class="modern-meta">
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
            <section class="modern-section">
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
            <section class="modern-section">
              <h2>PROJECTS</h2>

              ${projects
                .map(
                  (project) => `
                    <div class="modern-item">

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
            <section class="modern-section">
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

module.exports = modernTemplate;
