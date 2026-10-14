export const chooseTemplateHandler = ({
  resumeId,

  selectedTemplate,

  setResume,
  setSelectedTemplate,
  setError,

  getById,
  saveTemplate,

  navigation,
}) => {
  // LOAD EXISTING RESUME
  const loadResume = async () => {
    try {
      const result = await getById(resumeId);

      if (!result.success || !result.resume) {
        setError(result.message || "Failed to load resume.");

        return;
      }

      setResume(result.resume);

      if (result.resume.template) {
        setSelectedTemplate(result.resume.template);
      }
    } catch (error) {
      console.log("Load resume error:", error);

      setError("Something went wrong while loading your resume.");
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setError("");
  };

  const handleContinue = async () => {
    try {
      setError("");

      if (!selectedTemplate) {
        setError("Please select a resume template.");

        return;
      }

      const result = await saveTemplate(resumeId, selectedTemplate);

      // BACKEND VALIDATION
      if (!result.success) {
        setError(result.message || "Failed to save resume template.");

        return;
      }

      setResume((prev) => ({
        ...prev,
        template: selectedTemplate,
      }));

      navigation.navigate("UploadResumePreview", {
        resumeId,
      });
    } catch (error) {
      console.log("Choose template handler error:", error);

      setError("Something went wrong while saving the template.");
    }
  };

  return {
    loadResume,
    handleSelectTemplate,
    handleContinue,
  };
};
