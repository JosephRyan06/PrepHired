export const educationHandler = ({
  educations,
  setEducations,
  setErrors,
  getById,
  saveEducations,
  resumeId,
  navigation,
}) => {
  const loadEducationResume = async () => {
    try {
      const result = await getById(resumeId);

      if (result.success && result.resume) {
        if (result.resume.educations && result.resume.educations.length > 0) {
          setEducations(
            result.resume.educations.map((education) => ({
              ...education,
              id: education._id || Date.now() + Math.random(),
            })),
          );
        }
      }

      /*
     if (
      result.success &&
      result.resume
    ) {
      const optimizedEducations =
        result.resume.aiOptimization?.educations || [];

      if (optimizedEducations.length > 0) {
        setEducations(
          optimizedEducations.map((education) => ({
            ...education,
            id:
              education.id ||
              education._id ||
              Date.now() + Math.random(),
          }))
        );
      }
    }
    */
    } catch (error) {
      console.log("Load education error:", error);
    }
  };

  const addEducation = () => {
    if (educations.length >= 5) {
      return;
    }

    setEducations((prev) => [
      ...prev.map((education) => ({
        ...education,
        expanded: false,
      })),

      {
        id: Date.now() + Math.random(),
        school: "",
        degreeField: "",
        location: "",
        schoolYear: "",
        description: "",
        expanded: true,
      },
    ]);
  };

  const deleteEducation = (id) => {
    setEducations((prev) => prev.filter((education) => education.id !== id));
  };

  const updateEducation = (id, index, field, value) => {
    setEducations((prev) =>
      prev.map((education) =>
        education.id === id
          ? {
              ...education,
              [field]: value,
            }
          : education,
      ),
    );

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      delete updatedErrors[`educations.${index}.${field}`];

      return updatedErrors;
    });
  };

  const toggleEducation = (id) => {
    setEducations((prev) =>
      prev.map((education) =>
        education.id === id
          ? {
              ...education,
              expanded: !education.expanded,
            }
          : education,
      ),
    );
  };

  const handleEducationNext = async () => {
    try {
      const dataToSave = educations.map(
        ({ id, _id, expanded, ...education }) => education,
      );

      const result = await saveEducations(resumeId, dataToSave);

      if (!result.success) {
        const validationErrors = result.errors || {};

        setErrors(validationErrors);

        console.log("Validation errors:", validationErrors);

        return;
      }

      navigation.navigate("SummaryExtras", {
        resumeId,
      });
    } catch (error) {
      console.log("Education handler error:", error);
    }
  };

  return {
    loadEducationResume,
    addEducation,
    deleteEducation,
    updateEducation,
    toggleEducation,
    handleEducationNext,
  };
};
