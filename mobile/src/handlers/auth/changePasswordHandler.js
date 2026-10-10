const changePasswordHandler = ({
  changePassword,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPasswordError,
  setNewPasswordError,
  setConfirmPasswordError,
  setMessage,
  setModalVisible,
}) => {
  const handleChangePassword = async () => {
    // Clear previous errors/messages
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setMessage("");

    try {
      const result = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if (!result.success) {
        const errors = result.errors || {};

        if (errors.currentPassword) {
          setCurrentPasswordError(errors.currentPassword);
        }

        if (errors.newPassword) {
          setNewPasswordError(errors.newPassword);
        }

        if (errors.confirmPassword) {
          setConfirmPasswordError(errors.confirmPassword);
        }

        // No field-specific error
        if (Object.keys(errors).length === 0) {
          setMessage(result.message || "Unable to change password");

          setModalVisible(true);
        }

        return;
      }

      // Password changed successfully
      setMessage(result.message || "Password changed successfully");

      setModalVisible(true);
    } catch (error) {
      console.error("Change password error:", error);

      setMessage(error.message || "Unable to change password");

      setModalVisible(true);
    }
  };

  return {
    handleChangePassword,
  };
};

export default changePasswordHandler;
