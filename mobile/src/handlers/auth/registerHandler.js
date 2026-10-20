const registerHandler = ({
  register,
  navigation,
  setMessage,
  setModalVisible,

  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  checked,

  setFirstNameError,
  setLastNameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
  setTermsConditionError,
}) => {
  const handleRegister = async () => {
    // Clear previous errors
    setMessage("");
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsConditionError("");

    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      termsAccepted: checked,
    });

    if (!result.success) {
      const errors = result.errors || {};

      setFirstNameError(errors.firstName || "");
      setLastNameError(errors.lastName || "");
      setEmailError(errors.email || "");
      setPasswordError(errors.password || "");
      setConfirmPasswordError(errors.confirmPassword || "");
      setTermsConditionError(errors.termsCondition || "");

      if (errors.general) {
        setMessage(errors.general);
        setModalVisible(true);
      }

      return;
    }

    setMessage("Please check your Gmail and tap the verification link before logging in.");
    setModalVisible(true);
  };

  return {
    handleRegister,
  };
};

export default registerHandler;
