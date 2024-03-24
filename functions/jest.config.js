/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  "globals": {
    "ts-jest": {
      "tsconfig": "<rootDir>/tsconfig.spec.json",
      "isolatedModules": true
    }
  },
  "rootDir": "./",
  "roots": [
    "<rootDir>/src",
    "<rootDir>/../shared"
  ],
  "moduleNameMapper": {
    "@shared/(.*)": "<rootDir>/../shared/$1",
    "@function-utils/(.*)": "<rootDir>/src/utils/$1",
  },
  "testEnvironment": "node",
  "testRegex": ".spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/src/setupJest.ts"
  ],
  "coverageDirectory": "../coverage",
  "testResultsProcessor": "jest-junit"
};
