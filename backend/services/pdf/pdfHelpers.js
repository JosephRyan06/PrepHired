const escapeHTML = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatText = (value) => {
  return escapeHTML(value || "").replace(/\r?\n/g, "<br />");
};

const getAIOptimization = (resume) => {
  return resume?.aiOptimization || {};
};

const getAddress = (resume) => {
  const ai = getAIOptimization(resume);

  return ai?.address?.optimized || resume?.basicInfo?.address || "";
};

const getProfessionalSummary = (resume) => {
  const ai = getAIOptimization(resume);

  return (
    ai?.professionalSummary?.optimized || resume?.professionalSummary || ""
  );
};

const getSkills = (resume) => {
  const ai = getAIOptimization(resume);

  return ai?.skills?.optimized || resume?.skills || "";
};

const getCertificates = (resume) => {
  const ai = getAIOptimization(resume);

  return ai?.certificates?.optimized || resume?.certificates || "";
};

const getWorkExperiences = (resume) => {
  const ai = getAIOptimization(resume);

  return (
    resume?.workExperiences?.map((experience) => {
      const optimized = ai?.workExperiences?.find(
        (item) => String(item.id) === String(experience._id),
      );

      return {
        ...experience,

        // ORIGINAL
        jobTitle: experience.jobTitle || "",

        // ORIGINAL
        company: experience.company || "",

        // AI
        location: optimized?.location || experience.location || "",

        // ORIGINAL
        periodOfEmployment: experience.periodOfEmployment || "",

        // AI
        description: optimized?.optimized || experience.description || "",
      };
    }) || []
  );
};

const getEducations = (resume) => {
  const ai = getAIOptimization(resume);

  if (ai?.educations?.length > 0) {
    return ai.educations.map((education) => ({
      id: education.id || "",

      // AI
      degreeField: education.degreeField || "",

      // AI
      school: education.school || "",

      // AI
      location: education.location || "",

      // ORIGINAL
      schoolYear: education.schoolYear || "",

      // AI
      description: education.optimized || education.description || "",
    }));
  }

  return (
    resume?.educations?.map((education) => ({
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
    })) || []
  );
};

const getProjects = (resume) => {
  const ai = getAIOptimization(resume);

  return (
    resume?.projects
      ?.filter(
        (project) =>
          project &&
          (project.projectName?.trim() || project.projectDescription?.trim()),
      )
      .map((project) => {
        const optimized = ai?.projects?.find(
          (item) => String(item.id) === String(project._id),
        );

        return {
          ...project,

          // AI
          projectName: optimized?.projectName || project.projectName || "",

          // AI
          projectDescription:
            optimized?.optimized || project.projectDescription || "",
        };
      }) || []
  );
};

const getHeader = (resume, variant = "professional") => {
  const basic = resume?.basicInfo || {};
  const address = getAddress(resume);

  return `
    <header class="header ${variant}-header">

      <div class="name">
        ${escapeHTML(basic.fullName || "Your Name")}
      </div>

      <div class="target">
        ${escapeHTML(resume?.targetJob?.jobTitle || "Professional Title")}
      </div>

      <div class="contact">

        ${basic.email ? `<span>${escapeHTML(basic.email)}</span>` : ""}

        ${
          basic.email && basic.contactNumber
            ? `<span class="separator">|</span>`
            : ""
        }

        ${
          basic.contactNumber
            ? `<span>${escapeHTML(basic.contactNumber)}</span>`
            : ""
        }

        ${
          (basic.email || basic.contactNumber) && address
            ? `<span class="separator">|</span>`
            : ""
        }

        ${address ? `<span>${escapeHTML(address)}</span>` : ""}

      </div>

      ${
        basic.linkedInURL || basic.portfolioLink
          ? `
            <div class="links">

              ${
                basic.linkedInURL
                  ? `
                    <span>
                      ${escapeHTML(basic.linkedInURL)}
                    </span>
                  `
                  : ""
              }

              ${
                basic.linkedInURL && basic.portfolioLink
                  ? `<span class="separator">|</span>`
                  : ""
              }

              ${
                basic.portfolioLink
                  ? `
                    <span>
                      ${escapeHTML(basic.portfolioLink)}
                    </span>
                  `
                  : ""
              }

            </div>
          `
          : ""
      }

    </header>
  `;
};

module.exports = {
  escapeHTML,
  formatText,
  getAddress,
  getProfessionalSummary,
  getSkills,
  getCertificates,
  getWorkExperiences,
  getEducations,
  getProjects,
  getHeader,
};
