const editProfileHandler = ({
  editProfile,
  firstName,
  lastName,
  setFirstNameError,
  setLastNameError,
  setMessage,
  setModalVisible,
}) => {
  const handleEditProfile = async () => {
    setFirstNameError("");
    setLastNameError("");
    setMessage("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    let hasError = false;

    if (!trimmedFirstName) {
      setFirstNameError("First name is required");
      hasError = true;
    } else if (/\d/.test(trimmedFirstName)) {
      setFirstNameError("First name must not contain numbers");
      hasError = true;
    }

    if (!trimmedLastName) {
      setLastNameError("Last name is required");
      hasError = true;
    } else if (/\d/.test(trimmedLastName)) {
      setLastNameError("Last name must not contain numbers");
      hasError = true;
    }

    if (hasError) return;

    try {
      if (typeof editProfile !== "function") {
        throw new Error("editProfile is not a function. Check useAuth.");
      }

      const result = await editProfile(
        trimmedFirstName,
        trimmedLastName,
      );

      if (!result.success) {
        const errors = result.errors || {};

        setFirstNameError(errors.firstName || "");
        setLastNameError(errors.lastName || "");

        if (!errors.firstName && !errors.lastName) {
          setMessage(
            result.message || "Unable to update profile",
          );
          setModalVisible(true);
        }

        return;
      }

      setMessage(result.message || "Profile updated successfully");
      setModalVisible(true);
    } catch (error) {
      console.error("Edit profile error:", error);

      setMessage(error.message || "Unable to update profile");
      setModalVisible(true);
    }
  };

  return { handleEditProfile };
};

export default editProfileHandler;