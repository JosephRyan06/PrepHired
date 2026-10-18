const puppeteer = require("puppeteer");

const generateResumeHTML = require("./generateResumeHTML");

const generateResumePDF = async (resume) => {
  if (!resume) {
    throw new Error("Resume data is required");
  }

  const browser = await puppeteer.launch({
    headless: true,

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    /*
     * A4 viewport.
     *
     * This is only for rendering.
     * The actual PDF size is controlled
     * by @page + preferCSSPageSize.
     */
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    const html = generateResumeHTML(resume);

    await page.setContent(html, {
      waitUntil: "load",
      timeout: 60000,
    });

    /*
     * Make sure all fonts/layout are
     * completely rendered before PDF.
     */
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      displayHeaderFooter: false,

      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },

      pageRanges: "",
    });

    return pdf;
  } finally {
    await browser.close();
  }
};

module.exports = {
  generateResumePDF,
};
