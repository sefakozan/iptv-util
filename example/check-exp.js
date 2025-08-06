import { checker } from '../src/checker.js';

const url1 = 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8';

const result1 = await checker(url1, 10000, true);

debugger;
