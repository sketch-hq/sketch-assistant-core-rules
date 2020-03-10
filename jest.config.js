module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/rules/**/__tests__/**/*.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
}
