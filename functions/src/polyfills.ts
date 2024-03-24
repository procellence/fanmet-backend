import 'reflect-metadata';
import { Settings } from 'luxon';
import tsConfig from '../tsconfig.json';

require('source-map-support').install();

require('tsconfig-paths').register({
  baseUrl: './lib/functions',
  paths: tsConfig.compilerOptions.paths,
});

Settings.defaultZone = 'America/New_York';
