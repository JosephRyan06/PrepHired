const deleteAccountHandler = ({
  deleteAccount,
  navigation,
  currentPassword,
  setCurrentPasswordError,
  setMessage,
  setModalVisible,
  setCurrentPassword,
}) => {
  const handleDeleteAccount = async () => {
    setCurrentPasswordError("");

    try {
      const result = await deleteAccount(currentPassword);

      if (!result.success) {
        setCurrentPasswordError(
          result.message || "Incorrect password. Please try again.",
        );
        return;
      }

      setMessage("Account deleted successfully.");
      setModalVisible(true);
      setCurrentPassword("");
    } catch (error) {
      console.error("Delete account error:", error);

      setCurrentPasswordError(
        error.message || "Unable to delete account. Please try again.",
      );
    }
  };

  const handleDeleteAccountModalClose = () => {
    setModalVisible(false);

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return {
    handleDeleteAccount,
    handleDeleteAccountModalClose,
  };
};

export default deleteAccountHandler;
