const deleteAccountHandler = ({
  deleteAccount,
  navigation,
  currentPassword,
  setCurrentPasswordError,
  setMessage,
  setModalVisible,
}) => {
  const handleDeleteAccount = async () => {
    setCurrentPasswordError("");
    setMessage("");

    if (!currentPassword.trim()) {
      setCurrentPasswordError("Please enter your current password");
      return;
    }

    try {
      const result = await deleteAccount(currentPassword);

      if (!result.success) {
        setCurrentPasswordError(
          result.message || "Incorrect password"
        );
        return;
      }

      setMessage(
        result.message || "Account deleted successfully."
      );

      setModalVisible(true);
    } catch (error) {
      console.error("Delete account error:", error);

      setCurrentPasswordError(
        error.message || "Unable to delete account"
      );
    }
  };

  const handleDeleteAccountModalClose = () => {
    setModalVisible(false);

    if (message.includes("Account deleted successfully")) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Login",
          },
        ],
      });
    }
  };

  return {
    handleDeleteAccount,
    handleDeleteAccountModalClose,
  };
};

export default deleteAccountHandler;

