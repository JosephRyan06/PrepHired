import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { fromByteArray } from "base64-js";

export const resumePreviewHandler = ({
  resumeId,

  setResume,
  setModalVisible,
  setModalMessage,

  getById,
  complete,
  exportPDF,

  navigation,
}) => {
  // LOAD EXISTING RESUME
  const loadResume = async () => {
    try {
      const result = await getById(resumeId);

      if (!result.success || !result.resume) {
        setModalMessage(result.message || "Failed to load resume.");

        setModalVisible(true);

        return;
      }

      setResume(result.resume);
    } catch (error) {
      console.log("Load resume error:", error);

      setModalMessage("Something went wrong while loading your resume.");

      setModalVisible(true);
    }
  };

  // SAVE / COMPLETE RESUME
  const handleSaveResume = async () => {
    try {
      const result = await complete(resumeId);

      if (!result.success) {
        setModalMessage(result.message || "Failed to save resume.");

        setModalVisible(true);

        return;
      }

      if (result.resume) {
        setResume(result.resume);
      }

      setModalMessage(result.message || "Resume saved successfully.");

      setModalVisible(true);

      navigation.navigate("Resume");
    } catch (error) {
      console.log("Save resume error:", error);

      setModalMessage("Something went wrong while saving your resume.");

      setModalVisible(true);
    }
  };

  // EXPORT PDF
  const handleExportPDF = async () => {
    try {
      console.log("Starting PDF export...");

      const result = await exportPDF(resumeId);

      console.log("Export result:", result);

      if (!result || !result.arrayBuffer) {
        setModalMessage("PDF data was not received.");
        setModalVisible(true);
        return;
      }

      if (result.arrayBuffer.byteLength === 0) {
        setModalMessage("The PDF received from the server is empty.");
        setModalVisible(true);
        return;
      }

      console.log("PDF size:", result.arrayBuffer.byteLength, "bytes");

      const bytes = new Uint8Array(result.arrayBuffer);

      const base64 = fromByteArray(bytes);

      console.log("Base64 generated.");

      const fileUri = FileSystem.cacheDirectory + "resume.pdf";

      // SAVE PDF
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("PDF saved:", fileUri);

      // CHECK SHARING
      const sharingAvailable = await Sharing.isAvailableAsync();

      console.log("Sharing available:", sharingAvailable);

      if (!sharingAvailable) {
        setModalMessage(
          "PDF was created, but sharing is not available on this device.",
        );

        setModalVisible(true);

        return;
      }

      // OPEN SHARE / SAVE MENU
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Resume PDF",
        UTI: "com.adobe.pdf",
      });

      console.log("PDF sharing opened.");
    } catch (error) {
      console.log("Export PDF error:", error);

      setModalMessage(
        error?.message || "Something went wrong while exporting your resume.",
      );

      setModalVisible(true);
    }
  };

  return {
    loadResume,
    handleSaveResume,
    handleExportPDF,
  };
};
