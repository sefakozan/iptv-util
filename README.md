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
> I developed iptv-util to overcome the limitations of existing packages, which suffer from parsing errors, missing features and heavy dependencies.   

❌ **[@iptv/playlist](https://www.npmjs.com/package/@iptv/playlist)**  Fails to handle some M3U formats, lacking essential features like merging and validation.  
❌ **[iptv-playlist-parser](https://www.npmjs.com/package/iptv-playlist-parser)** Some parsing bugs, offering no generation and validation capabilities.  
❌ **[esx-iptv-playlist-parser](https://www.npmjs.com/package/esx-iptv-playlist-parser)** A buggy, untested mess with no recent updates.   
❌ **[iptv-checker](https://www.npmjs.com/package/iptv-checker)** Crippled by FFmpeg dependency, missing parsing and generation.   
❌ **[iptv-playlist-generator](https://www.npmjs.com/package/iptv-playlist-generator)** Incompatible with its own parser, missing validation.   
❌ **[iptv-checker-module](https://www.npmjs.com/package/iptv-checker-module)** It’s a clunky, single-purpose module.

### Performance
| Package                  |   Ops/sec   | Min (ms) | Max (ms) | Mean (ms) | p75 (ms) | p99 (ms) | RME   |
|--------------------------|---------|----------|----------|-----------|----------|----------|-------|
| **iptv-util**                | **3.3648**  | **287.17**   | **318.69**   | **297.19**    | **306.11**   | **318.69** | **±2.56%**|
| @iptv/playlist           | 0.8647  | 1093.79  | 1210.04  | 1156.40   | 1188.41  | 1210.04 | ±2.22%|
| iptv-playlist-parser     | 2.6438  | 366.59   | 396.95   | 378.24    | 383.14   | 396.95  | ±1.81%|
| esx-iptv-playlist-parser | 1.7687  | 548.36   | 587.98   | 565.39    | 571.14   | 587.98  | ±1.39%|

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


```javascript
import { parser } from 'iptv-util'
import fs from 'node:fs'

// Read the M3U playlist file from the filesystem
const m3uContent = fs.readFileSync('playlist.m3u', 'utf8')
// Parse the M3U content using the iptv-util parser to create a Playlist object
const playlist = parser(m3uContent)

// Convert the Playlist object to a JSON representation
const json = playlist.toJson()
// Convert the Playlist object back to its M3U text representation
const text = playlist.toText()
// Save the converted M3U text to a new file named 'output_playlist.m3u'
fs.writeFileSync('output_playlist.m3u', text, 'utf8')

// Check the playlist for working streams and return a cleaned Playlist object
const cleanPlaylist = await playlist.check()
// Convert the cleaned Playlist object to its M3U text representation
const onlineOnly = cleanPlaylist.toText()
// Save the cleaned M3U text to a new file named 'online_playlist.m3u'
fs.writeFileSync('online_playlist.m3u', onlineOnly, 'utf8')
// Access offline array
const offlineArr = cleanPlaylist.offline
```

### Generator
Use the Playlist and Link classes to create a new M3U playlist programmatically.


```javascript
import { Playlist, Link } from 'iptv-util'
import fs from 'node:fs'

// Create a new Playlist instance
const playlist = new Playlist()

// Set playlist header with TV guide URLs
playlist.header = {
  'x-tvg-url': '...',
  'url-tvg': '...'
}

// Create a new Link for the first channel
const link1 = new Link('http://example.com/stream1.m3u8')
link1.title = 'Channel 1' // Set channel title
link1.duration = -1 // Set duration (-1 for live stream)
link1.extinf = {
  'tvg-id': 'channel1', // Set TV guide ID
  'group-title': 'Entertainment' // Set group category
}
link1.extgrp = 'Sports' // Set external group
link1.extvlcopt = {
  'http-referrer': 'http://example.com', // Set HTTP referrer
  'http-user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Set user agent
}

// Create a new Link for the second channel
const link2 = new Link('http://example.com/stream2.m3u8')
link2.title = 'Channel 2' // Set channel title
link2.duration = -1 // Set duration (-1 for live stream)
link2.extinf = {
  'tvg-id': 'channel2', // Set TV guide ID
  'group-title': 'Entertainment' // Set group category
}

// Add links to the playlist
playlist.addLink(link1)
playlist.addLink(link2)

// Generate M3U text and JSON representations of the playlist
const m3uText = playlist.toText()
const m3uJson = playlist.toJson()

// Log generated M3U and JSON content
console.log('Generated M3U:', m3uText)
console.log('Generated JSON:', m3uJson)

// Save the M3U content to a file
fs.writeFileSync('generated-playlist.m3u', m3uText)
```

### Checker
Use the checker function to validate the URLs in an M3U playlist.

```javascript
import { checker, url2text, parser } from 'iptv-util'
import fs from 'node:fs'

// Check if a single stream URL is online
const url1 = 'https://demiroren-live.daioncdn.net/kanald/kanald.m3u8'
const isOnline = await checker(url1) // Returns true if the stream is working

// Read M3U playlist content from a local file
const m3uContent1 = fs.readFileSync('playlist.m3u', 'utf8')
// Fetch M3U playlist content from a remote URL
const url2 = 'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_samsung.m3u'
const m3uContent2 = await url2text(url2)

// Parse M3U content into a Playlist object
const playlist = parser(m3uContent1) // Can also use m3uContent2

// Check playlist for valid streams, returning a cleaned Playlist object
const cleanPlaylist = await playlist.check()
// Convert cleaned playlist to M3U text (online links only)
const text = cleanPlaylist.toText()
// Convert cleaned playlist to JSON (online links only)
const json = cleanPlaylist.toJson()

// Get arrays of offline and online links from the cleaned playlist
const offlineArr = cleanPlaylist.offline
const onlineArr = cleanPlaylist.links
```

### Merger
Use the merger function to combine multiple M3U playlists into a single playlist.

```javascript
import { merger } from 'iptv-util'
import fs from 'node:fs'

// Load M3U playlist files from the filesystem
const playlist1 = fs.readFileSync('playlist1.m3u', 'utf8')
const playlist2 = fs.readFileSync('playlist2.m3u', 'utf8')

// Array of M3U content strings
const textArr = [
  playlist1,
  playlist2
]

// Array of M3U playlist URLs
const urlArr = [
  'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u',
  'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u'
]

// Merge multiple playlists into a single Playlist object
const mergedPlaylist1 = await merger(playlist1, playlist2) // Merge two local playlists
const mergedPlaylist2 = await merger(...textArr) // Merge from text array
const mergedPlaylist3 = await merger(...urlArr) // Merge from URL array

// Convert merged playlists to M3U text format
const text1 = mergedPlaylist1.toText()
const text2 = mergedPlaylist2.toText()
const text3 = mergedPlaylist3.toText()

// Save merged playlists to separate M3U files
fs.writeFileSync('mergedPlaylist1.m3u', text1, 'utf8')
fs.writeFileSync('mergedPlaylist2.m3u', text2, 'utf8')
fs.writeFileSync('mergedPlaylist3.m3u', text3, 'utf8')

// Check merged playlist for valid streams and create a cleaned Playlist object
const cleanPlaylist = await mergedPlaylist1.check()

// Convert cleaned playlist to M3U text format (online links only)
const cleanText = cleanPlaylist.toText()
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


