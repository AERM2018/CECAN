module.exports = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: "http://localhost:3000",
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://staging-app.site/api/v1"
        : "http://localhost:4000/api/v1",
  },
};
