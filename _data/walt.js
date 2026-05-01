// Eleventy data file for Walt configuration.
// WALT_PROXY_URL is set as a repository secret and injected into the
// build environment by .github/workflows/deploy.yml.
// The value is baked into walt.njk at build time — no client-side config needed.
module.exports = {
  proxy_url: process.env.WALT_PROXY_URL || "",
};
