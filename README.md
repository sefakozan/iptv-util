<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./logo.png">
    <img alt="Playlist. TypeScript tools for working with M3U playlist data." src="logo.png">
  </picture>

[![npm downloads](https://img.shields.io/npm/dw/iptv-util.svg)](https://www.npmjs.com/package/iptv-util)
[![npm version](https://img.shields.io/npm/v/iptv-util.svg)](https://www.npmjs.com/package/iptv-util)
[![License](https://img.shields.io/npm/l/iptv-util.svg)](https://www.npmjs.com/package/iptv-util)
</div>


> **Pure Javascript cross-platform module to manage m3u iptv playlist**

**Functionalities**:
   - **`parser`**: Assumed to parse an M3U file string into a structured JSON format.
   - **`generator`**: `Playlist` and `Link` classes for generating M3U playlists. 
   - **`checker`**: Assumed to validate URLs in an M3U playlist, returning their status (e.g., online, ofline).
   - **`merger`**: Assumed to combine multiple M3U playlists into one, handling duplicates or formatting.   

## Similar Packages
* [@iptv/playlist](https://www.npmjs.com/package/@iptv/playlist) has parsing error
* [iptv-playlist-parser](https://www.npmjs.com/package/iptv-playlist-parser) parsing error
* [esx-iptv-playlist-parser](https://www.npmjs.com/package/esx-iptv-playlist-parser) buggy, no tests
* [iptv-checker](https://www.npmjs.com/package/iptv-checker) using native binary
* [iptv-playlist-generator](https://www.npmjs.com/package/iptv-playlist-generator) not compatiple with own parser


### Performance
| Package                  |   Ops/sec   | Min (ms) | Max (ms) | Mean (ms) | p75 (ms) | p99 (ms) | p995 (ms) | p999 (ms) | RME   |
|--------------------------|---------|----------|----------|-----------|----------|----------|-----------|-----------|-------|
| **iptv-util**                | **3.3648**  | **287.17**   | **318.69**   | **297.19**    | **306.11**   | **318.69**   | **318.69**    | **318.69**    | **±2.56%**|
| @iptv/playlist           | 0.8647  | 1093.79  | 1210.04  | 1156.40   | 1188.41  | 1210.04  | 1210.04   | 1210.04   | ±2.22%|
| iptv-playlist-parser     | 2.6438  | 366.59   | 396.95   | 378.24    | 383.14   | 396.95   | 396.95    | 396.95    | ±1.81%|
| esx-iptv-playlist-parser | 1.7687  | 548.36   | 587.98   | 565.39    | 571.14   | 587.98   | 587.98    | 587.98    | ±1.39%|

#### Benchmark Summary

- **iptv-util** - test/main.bench.js
  - 1.27x faster than iptv-playlist-parser
  - 1.90x faster than esx-iptv-playlist-parser
  - 3.89x faster than @iptv/playlist


## Installation

```bash
# npm
npm install iptv-util

# pnpm
pnpm add iptv-util

# yarn
yarn add iptv-util
```

## Usage

The `iptv-util` library provides tools to parse, generate, check, and merge IPTV M3U playlists. Below are examples demonstrating how to use the main functionalities: `parser`, `Playlist` and `Link` for generating playlists, `checker` for validating links, and `merger` for combining multiple playlists.

### Parser
Use the parser function to parse an M3U playlist file into a structured format.


```js
import { parser } from 'iptv-util'
import fs from 'node:fs'

// Read and parse an M3U file
const m3uContent = fs.readFileSync('playlist.m3u', 'utf8');


// parser return Playlist object
const playlist = parser(m3uContent)

const text = playlist.toText()
const json = playlist.toJson()

// to check playlist

const playlist = await playlist.check()
const onlineOnly = playlist.toText()

```

### Generator
Use the Playlist and Link classes to create a new M3U playlist programmatically.


```js
import { Playlist, Link } from 'iptv-util'
import fs from 'node:fs'

// Create a new playlist
const playlist = new Playlist();

// Add channels to the playlist
const link1 = new Link({
  url: 'http://example.com/stream1.m3u8',
  title: 'Channel 1',
  attributes: { 'tvg-id': 'channel1', 'group-title': 'Entertainment' }
});
const link2 = new Link({
  url: 'http://example.com/stream2.m3u8',
  title: 'Channel 2',
  attributes: { 'tvg-id': 'channel2', 'group-title': 'Sports' }
});

playlist.addLink(link1);
playlist.addLink(link2);

// Generate M3U content
const m3uText = playlist.toText();
const m3uJson = playlist.toJson();
console.log('Generated M3U:', m3uText);

// Save to file
fs.writeFileSync('generated-playlist.m3u', m3uText);
```

### Checker
Use the checker function to validate the URLs in an M3U playlist.

```js
import { checker,url2text,parser } from 'iptv-util'
import fs from 'node:fs'

// to check single link
const isOnline = await checker('http://example.com/stream1.m3u8')

// to check entire playlist
// load file
const m3uContent1 = fs.readFileSync('playlist.m3u', 'utf8');
// load from url
const m3uContent2 = await url2text(' http://example.com/playlist.m3u')


const playlist = parser(m3uContent1) // m3uContent2

const cleanPlaylist = await playlist.check()
const text = cleanPlaylist.toText() // online only
const json = cleanPlaylist.toJson() // online only
const offlineArr = cleanPlaylist.offline;
const onlineArr = cleanPlaylist.links;
```

### Merger
Use the merger function to combine multiple M3U playlists into a single playlist.

```js
import { merger } from 'iptv-util'
import fs from 'node:fs'


// Load multiple M3U files
const playlist1 = fs.readFileSync('playlist1.m3u', 'utf8');
const playlist2 = fs.readFileSync('playlist2.m3u', 'utf8');

const textArr = [
  playlist1,
  playlist2
]

const urlArr = [
'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u',
'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u'
]

// Merger return Playlists object
const playlist1 = await merger([playlist1, playlist2])
const playlist2 = await merger(...textArr)
const playlist3 = await merger(...urlArr)
  
```

## Test
* `npm run test`
* Check [test folder](https://github.com/sefakozan/iptv-util/tree/main/test) and [quickstart.js](https://github.com/sefakozan/iptv-util/blob/main/example/quickstart.js) for extra usages.

## Support
I use this package actively myself, so it has my top priority. You can use GitHub issues for any infos, ideas and suggestions.


### Submitting an Issue
If you find a bug or a mistake, you can help by submitting an issue to [GitHub Repository](https://github.com/sefakozan/iptv-util/issues)

### Creating a Pull Request

* [A Guide for First-Timers](https://docs.github.com/en/get-started/start-your-journey/hello-world)
* [How to create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
* Check [Contributing Guide](https://github.com/sefakozan/iptv-util/blob/main/CONTRIBUTING.md) 

## License
[Apache-2.0](https://github.com/sefakozan/iptv-util/blob/main/LICENSE) and all it's dependencies are MIT or BSD licensed.


