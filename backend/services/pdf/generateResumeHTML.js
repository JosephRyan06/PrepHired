const professionalTemplate = require("./templates/professionalTemplate");
const minimalTemplate = require("./templates/minimalTemplate");
const modernTemplate = require("./templates/modernTemplate");
const classicTemplate = require("./templates/classicTemplate");

const generateResumeHTML = (resume) => {
  const template = resume?.template || "classic";

  let content;

  switch (template) {
    case "professional":
      content = professionalTemplate(resume);
      break;

    case "minimal":
      content = minimalTemplate(resume);
      break;

    case "modern":
      content = modernTemplate(resume);
      break;

    case "classic":
    default:
      content = classicTemplate(resume);
      break;
  }

  return `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Resume</title>

  <style>

    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #ffffff;
    }

    body {
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      color: #111827;

      font-size: 10px;

      line-height: 1.45;

      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;

      margin: 0 auto;

      padding:
        15mm
        16mm;

      background: #ffffff;

      overflow: hidden;
    }

    /* ========================================
       COMMON
    ======================================== */

    .header {
      width: 100%;
    }

    .name {
      font-size: 25px;
      line-height: 1.2;
      font-weight: 700;
    }

    .target {
      margin-top: 4px;
      font-size: 12px;
    }

    .contact {
      margin-top: 8px;
      font-size: 9px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    .links {
      margin-top: 3px;
      font-size: 9px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    .separator {
      margin: 0 4px;
    }

    .section {
      margin-top: 18px;
      margin-bottom: 18px;
    }

    .section h2 {
      margin: 0 0 8px 0;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .content {
      font-size: 10px;
      line-height: 1.45;
    }

    .row {
      display: flex;
      width: 100%;

      justify-content:
        space-between;

      align-items:
        flex-start;

      gap: 15px;
    }

    .left {
      flex: 1;
      min-width: 0;
    }

    .right {
      width: 150px;
      flex-shrink: 0;

      text-align: right;

      font-size: 9px;
      color: #6b7280;

      overflow-wrap: anywhere;
    }

    .period {
      margin-top: 2px;
    }

    .job-title,
    .degree,
    .project-name {
      font-size: 10.5px;
      font-weight: 700;
      color: #111827;
    }

    .company,
    .school {
      margin-top: 2px;

      font-size: 10px;

      color: #374151;
    }

    .description {
      margin-top: 5px;

      font-size: 9.7px;

      line-height: 1.45;

      color: #374151;

      overflow-wrap: anywhere;
    }

    .experience,
    .education,
    .project {
      margin-bottom: 12px;

      page-break-inside:
        avoid;
    }

    /* ========================================
       PROFESSIONAL
       Matches Professional RN design
    ======================================== */

    .professional {
      padding-top: 15mm;
      padding-left: 20mm;
      padding-right: 20mm;
    }

    .professional-header {
      margin-bottom: 15px;
    }

    .professional .target {
      color: #374151;
      font-weight: 400;
    }

    .professional .contact {
      color: #4b5563;
    }

    .professional .links {
      color: #2563eb;
    }

    .professional-header::after {
      content: "";

      display: block;

      width: 100%;

      height: 2px;

      background: #111827;

      margin-top: 12px;
    }

    .professional .section {
      margin-top: 18px;
      margin-bottom: 18px;
    }

    .professional .section h2 {
      color: #111827;

      font-size: 11px;

      font-weight: 700;

      letter-spacing: 0.5px;

      margin-bottom: 8px;
    }

    .professional .content {
      font-size: 8.5px;
      line-height: 13px;
    }

    .professional .job-title {
      font-size: 10px;
    }

    .professional .company {
      font-size: 8px;
    }

    .professional .right {
      width: 150px;
      font-size: 7.5px;
    }

    .professional .description {
      font-size: 8px;
      line-height: 12px;
      margin-top: 5px;
    }

    .professional .experience {
      margin-bottom: 12px;
    }

    .professional .degree {
      font-size: 9px;
    }

    .professional .school {
      font-size: 8px;
    }

    .professional .education {
      margin-bottom: 10px;
    }

    .professional .project-name {
      font-size: 9px;
    }

    .professional .project {
      margin-bottom: 10px;
    }

    /* ========================================
       MINIMAL
    ======================================== */

    .minimal {
      padding-top: 18mm;
      padding-left: 18mm;
      padding-right: 18mm;
    }

    .minimal-header {
      padding-bottom: 15px;
      border-bottom: 1px solid #d1d5db;
    }

    .minimal .name {
      font-size: 28px;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    .minimal .target {
      font-size: 10px;
      color: #6b7280;
    }

    .minimal .contact,
    .minimal .links {
      font-size: 8px;
      color: #6b7280;
    }

    .minimal-section {
      margin-top: 21px;
      margin-bottom: 20px;
    }

    .minimal-section h2 {
      font-size: 9px;
      letter-spacing: 1.5px;
      font-weight: 700;

      color: #111827;

      margin: 0 0 9px 0;
    }

    .minimal .content,
    .minimal .skills-text {
      font-size: 9px;
      line-height: 1.55;
      color: #4b5563;
    }

    .minimal-item {
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f3f4f6;

      page-break-inside:
        avoid;
    }

    .minimal-title-row {
      display: flex;

      justify-content:
        space-between;

      align-items:
        flex-start;

      gap: 20px;
    }

    .minimal .job-title,
    .minimal .degree,
    .minimal .project-name {
      font-size: 10px;
    }

    .minimal .company,
    .minimal .school {
      font-size: 8.5px;
      color: #6b7280;
    }

    .minimal-meta {
      width: 140px;

      text-align: right;

      color: #9ca3af;

      font-size: 7.5px;
      line-height: 1.5;
    }

    .minimal .description {
      font-size: 8px;
      line-height: 1.5;
      color: #4b5563;
    }

    .minimal-project {
      margin-bottom: 12px;
    }

    /* ========================================
       MODERN
    ======================================== */

    .modern {
      padding-top: 12mm;
      padding-left: 16mm;
      padding-right: 16mm;
    }

    .modern-header {
      background: #111827;

      padding: 20px;

      margin-bottom: 22px;
    }

    .modern-header .name {
      color: #ffffff;
      font-size: 26px;
    }

    .modern-header .target {
      color: #d1d5db;
      font-size: 11px;
    }

    .modern-header .contact,
    .modern-header .links {
      color: #d1d5db;
      font-size: 7.5px;
    }

    .modern-section {
      margin-bottom: 19px;
    }

    .modern-section h2 {
      color: #2563eb;

      font-size: 11px;

      padding-bottom: 5px;

      margin-bottom: 10px;

      border-bottom:
        1px solid #dbeafe;
    }

    .modern-experience {
      display: flex;

      margin-bottom: 13px;

      page-break-inside:
        avoid;
    }

    .modern-marker {
      width: 3px;

      flex-shrink: 0;

      background: #2563eb;

      margin-right: 10px;
    }

    .modern-body {
      flex: 1;
      min-width: 0;
    }

    .modern-top {
      display: flex;

      justify-content:
        space-between;

      align-items:
        flex-start;

      gap: 15px;
    }

    .modern-meta {
      width: 145px;

      flex-shrink: 0;

      text-align: right;

      color: #6b7280;

      font-size: 8px;
    }

    .modern .job-title {
      font-size: 10px;
    }

    .modern .company {
      color: #2563eb;
      font-size: 8px;
    }

    .modern .description {
      font-size: 8px;
      line-height: 12px;
    }

    .modern-item {
      margin-bottom: 12px;

      page-break-inside:
        avoid;
    }

    .modern .degree {
      font-size: 9px;
    }

    .modern .school {
      font-size: 8px;
    }

    /* ========================================
       CLASSIC
    ======================================== */

    .classic {
      padding-top: 15mm;
    }

    .classic-header {
      padding-bottom: 10px;

      border-bottom:
        1px solid #111111;
    }

    .classic-section {
      margin-top: 17px;
      margin-bottom: 17px;
    }

    .classic-section h2 {
      border-bottom:
        1px solid #111111;

      padding-bottom: 4px;

      margin-bottom: 8px;

      font-size: 11px;
    }

    .classic .name {
      font-size: 25px;
    }

    .classic .target {
      font-size: 12px;
      font-weight: 600;
    }

    .classic .contact,
    .classic .links {
      font-size: 9px;
    }

    .classic-item {
      margin-bottom: 12px;

      page-break-inside:
        avoid;
    }

    .classic .description {
      font-size: 9.7px;
    }

    /* ========================================
       PRINT
    ======================================== */

    @media print {

      html,
      body {
        width: 210mm;
        margin: 0;
        padding: 0;
      }

      .page {
        margin: 0;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

    }

  </style>

</head>

<body>

  ${content}

</body>

</html>
  `;
};

module.exports = generateResumeHTML;
