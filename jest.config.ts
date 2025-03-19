// /** @type {import('ts-jest').JestConfigWithTsJest} */
// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'js'],
//   extensionsToTreatAsEsm: ['.ts'],
//   globals: {
//     'ts-jest': {
//       useESM: true,
//     },
//   },
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm', // Use ESM preset
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Fixes module resolution issue
  },
};
