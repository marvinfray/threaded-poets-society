const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Configure markdown-it with line break support — essential for poetry
  const md = markdownIt({ html: true, breaks: true, linkify: false });
  eleventyConfig.setLibrary("md", md);

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");

  // Poems collection — sorted newest first
  eleventyConfig.addCollection("poems", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("poems/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Date filter — "31 March 2026"
  eleventyConfig.addFilter("formatDate", function (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  // Year filter — for footer
  eleventyConfig.addFilter("year", function (date) {
    return new Date(date).getFullYear();
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
