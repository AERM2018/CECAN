module.exports = {
  reactStrictMode: true,
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://staging-app.site/api/v1"
        : "http://localhost:4000/api/v1",
  },
};
