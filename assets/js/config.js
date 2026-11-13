/*
 * SITE CONFIGURATION — the one place to edit retailer links, sample files
 * and release status. Nothing here needs a rebuild: save and redeploy.
 *
 * Rules (from the launch brief):
 *  - Leave a retailer URL as null until Edward confirms the exact product page.
 *    Buy buttons stay hidden while the URL is null.
 *  - samplePdf paths are relative to the site root, e.g. "samples/book-sample.pdf".
 *    Until a PDF is set, the page shows the text preview only.
 *  - Course enrollment stays hidden until enrollUrl is set, which should only
 *    happen once checkout and server-side access checks are live.
 */
window.SITE_CONFIG = {
  siteUrl: "https://edwardmartimbor.com",

  books: {
    "steady-under-pressure": {
      retailers: {
        amazon: "https://www.amazon.com/dp/B0HRFJ1F2M"
      },
      samplePdf: "samples/steady-under-pressure-chapter-1-sample.pdf"
    },
    "steady-under-pressure-workbook": {
      retailers: {
        amazon: "https://www.amazon.com/dp/B0HRFW59HJ"
      },
      samplePdf: "samples/steady-under-pressure-workbook-sample.pdf"
    }
  },

  course: {
    status: "in-development", // "in-development" | "open"
    enrollUrl: null           // set only when purchase + access flows are verified
  }
};
