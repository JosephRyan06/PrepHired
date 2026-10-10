const registerHandler = ({
  register,
  navigation,
  setMessage,
  setModalVisible,

  fullName,
  email,
  password,
  confirmPassword,
  checked,

  setFullNameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
  setTermsConditionError,
}) => {
  const handleRegister = async () => {
    // Clear previous errors
    setMessage("");
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsConditionError("");

    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      termsAccepted: checked,
    });

    if (!result.success) {
      const errors = result.errors || {};

      setFullNameError(errors.fullName || "");
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

    setMessage("Registration successful");
    setModalVisible(true);
  };

  return {
    handleRegister,
  };
};

export default registerHandler;
