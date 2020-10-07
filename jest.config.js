module.exports = {
  preset: 'ts-jest',
  testRegex: '(<rootDir>/test/.*|(\\.|/)(test|spec))\\.tsx?$',
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.tsx',
    '<rootDir>/src/**/*.ts'
  ],
  clearMocks: true,
  restoreMocks: true,
  coverageDirectory: '<rootDir>/coverage/',
  transform: {'^.+\\.js$': 'ts-jest'},
  moduleNameMapper: {'\\.css$': 'identity-obj-proxy'}
};