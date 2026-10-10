import * as DocumentPicker from "expo-document-picker";

export const uploadResumeHandler = ({
  setUploadingResume,
  importResumeFile,
  setModalVisible,
  setMessage,
  navigation,
}) => {
  // UPLOAD RESUME
  const handleUploadResume = async () => {
    try {
      setUploadingResume(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],

        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets?.[0];

      if (!file) {
        console.log("No file selected");
        return;
      }

      console.log("Selected file:", file);

      const importResult = await importResumeFile({
        uri: file.uri,

        name: file.name || "resume.pdf",

        mimeType: file.mimeType || "application/pdf",

        size: file.size || 0,
      });

      console.log("Import result:", importResult);

      if (!importResult.success || !importResult.resume) {
        const message = importResult.message || "Resume upload failed.";

        console.log("Resume import failed:", message);

        setMessage(message);
        setModalVisible(true);

        return;
      }

      const resume = importResult.resume;

      console.log("Imported resume:", resume);

      console.log("Imported resume ID:", resume._id);

      navigation.navigate("UploadedAiGeneratedResume", {
        resumeId: resume._id,
      });
    } catch (error) {
      setMessage(error);
      setModalVisible(true);
    } finally {
      setUploadingResume(false);
    }
  };

  return {
    handleUploadResume,
  };
};
