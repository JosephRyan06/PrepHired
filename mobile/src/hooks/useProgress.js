import { useEffect, useState } from "react";

import { getProgress } from "../api/progress";

const useProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    try {
      setLoading(true);

      const result = await getProgress();

      if (result?.success) {
        setProgress(result.data);
      }
    } catch (error) {
      console.error("Progress loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  return {
    progress,
    loading,
    loadProgress,
  };
};

export default useProgress;
