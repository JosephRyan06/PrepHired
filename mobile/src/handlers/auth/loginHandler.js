const loginHandler = ({
  login,
  navigation,
  setMessage,
  setModalVisible,
  email,
  password,
  setEmailError,
  setPasswordError,
}) => {
  const handleLogin = async () => {
    // Clear previous errors
    setMessage("");
    setEmailError("");
    setPasswordError("");

    const result = await login(email.trim(), password);

    if (!result.success) {
      const errors = result.errors || {};

      setEmailError(errors.email || "");
      setPasswordError(errors.password || "");

      const generalMessage = errors.general || result.message;
      if (generalMessage) {
        setMessage(generalMessage);
        setModalVisible(true);
      }

      return;
    }

    // Login successful
    setMessage("Login successful");
    setModalVisible(true);
  };

  return {
    handleLogin,
  };
};

export default loginHandler;
