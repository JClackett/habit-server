module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  collectCoverageFrom: ["**/*.{ts}", "!**/node_modules/**", "!**/vendor/**"],
}
