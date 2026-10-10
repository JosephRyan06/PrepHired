import { useState } from "react";

import {
  importResume,
  createResume,
  getDraftResume,
  getResume,
  saveBasicInfo,
  saveTargetJob,
  saveWorkExperience,
  saveEducation,
  saveSummaryExtras,
  saveResumeTemplate,
  generateSummary,
  analyzeResume as analyzeResumeApi,
  optimizeResume as optimizeResumeApi,
  completeResume,
  getCompletedResumes as getCompletedResumesApi,
  exportResumePDF as exportResumePDFApi,
} from "../api/resume";

const useResume = () => {
  const [loading, setLoading] = useState(false);

  // CREATE RESUME
  const create = async () => {
    setLoading(true);

    try {
      const data = await createResume();

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to create resume",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // GET DRAFT RESUME
  const getDraft = async () => {
    setLoading(true);

    try {
      const data = await getDraftResume();

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to get draft resume",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // GET RESUME
  const getById = async (id) => {
    setLoading(true);

    try {
      const data = await getResume(id);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to get resume",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const importResumeFile = async (file) => {
    try {
      setLoading(true);

      console.log("useResume - importing file:", file);

      const result = await importResume(file);

      return {
        success: true,
        resume: result?.resume,
        message: result?.message,
      };
    } catch (error) {
      console.log("Import resume error:", error?.message || error);

      return {
        success: false,

        message: error?.message || "Failed to import resume",

        errors: error?.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 1 - BASIC INFO
  const saveBasic = async (id, basicInfo) => {
    setLoading(true);

    try {
      const data = await saveBasicInfo(id, basicInfo);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save basic information",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - TARGET JOB
  const saveTarget = async (id, targetJob) => {
    setLoading(true);

    try {
      const data = await saveTargetJob(id, targetJob);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save target job",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 - WORK EXPERIENCE
  const saveExperience = async (id, workExperiences, noWorkExperience) => {
    setLoading(true);

    try {
      const data = await saveWorkExperience(
        id,
        workExperiences,
        noWorkExperience,
      );

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save work experience",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 4 - EDUCATION
  const saveEducations = async (id, educations) => {
    setLoading(true);

    try {
      const data = await saveEducation(id, educations);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save education",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 5 - SUMMARY & EXTRAS
  const saveSummary = async (
    id,
    { professionalSummary, skills, projects, certificates },
  ) => {
    setLoading(true);

    try {
      const data = await saveSummaryExtras(id, {
        professionalSummary,
        skills,
        projects,
        certificates,
      });

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save summary and extras",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // AI - GENERATE PROFESSIONAL SUMMARY
  const generateProfessionalSummary = async (id) => {
    setLoading(true);

    try {
      const data = await generateSummary(id);

      return {
        success: true,
        message: data.message,
        summary: data.summary,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to generate professional summary",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // AI
  const analyzeResume = async (id) => {
    setLoading(true);

    try {
      const data = await analyzeResumeApi(id);

      return {
        success: true,
        message: data.message,
        analysis: data.analysis,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to analyze resume",
        analysis: null,
        resume: null,
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // AI
  const optimizeResume = async (id) => {
    setLoading(true);

    try {
      const data = await optimizeResumeApi(id);

      return {
        success: true,
        message: data.message,
        optimization: data.optimization,
        originalScore: data.originalScore,
        optimizedScore: data.optimizedScore,
        scoreImprovement: data.scoreImprovement,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to optimize resume",
        optimization: null,
        originalScore: 0,
        optimizedScore: 0,
        scoreImprovement: 0,
        resume: null,
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  //STEP 7
  const saveTemplate = async (id, template) => {
    setLoading(true);

    try {
      const data = await saveResumeTemplate(id, template);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to save resume template",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // STEP 8 COMPLETE RESUME / SAVE
  const complete = async (id) => {
    setLoading(true);

    try {
      const data = await completeResume(id);

      return {
        success: true,
        message: data.message,
        resume: data.resume,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to complete resume",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const getCompletedResumes = async () => {
    setLoading(true);

    try {
      const data = await getCompletedResumesApi();

      return {
        success: true,
        message: data.message,
        resumes: data.resumes || [],
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to retrieve completed resumes",
        resumes: [],
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // EXPORT RESUME PDF
  const exportPDF = async (id) => {
    setLoading(true);

    try {
      const data = await exportResumePDFApi(id);

      console.log("HOOK PDF BYTE LENGTH:", data?.arrayBuffer?.byteLength);

      return {
        success: true,
        arrayBuffer: data.arrayBuffer,
        fileName: data.fileName,
        errors: {},
      };
    } catch (error) {
      console.log("Export PDF hook error:", error);

      return {
        success: false,
        message: error.message || "Unable to export resume PDF",
        arrayBuffer: null,
        fileName: "resume.pdf",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    importResumeFile,
    create,
    getDraft,
    getById,

    saveBasic,
    saveTarget,
    saveExperience,
    saveEducations,
    saveSummary,
    generateProfessionalSummary,
    analyzeResume,
    optimizeResume,
    saveTemplate,
    complete,

    exportPDF,

    getCompletedResumes,
    loading,
  };
};

export default useResume;
