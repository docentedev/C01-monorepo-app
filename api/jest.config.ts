module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: ['./src/**'],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 43,
      lines: 57,
      statements: 54,
    },
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    }
  }
}
