import { parser, Playlist, Link, checker, merger, url2text } from '../src/index.js'
import fs from 'node:fs'

// 1. Parse and Check an Existing Playlist
// Read M3U playlist from file
const m3uContent = fs.readFileSync('playlist.m3u', 'utf8')

// Parse M3U content into a Playlist object
const playlist = parser(m3uContent)

// Check playlist for valid streams
const cleanPlaylist = await playlist.check()
const cleanText = cleanPlaylist.toText() // Online links only
const cleanJson = cleanPlaylist.toJson() // JSON format of online links
fs.writeFileSync('clean_playlist.m3u', cleanText, 'utf8') // Save cleaned playlist

// Log offline and online links
console.log('Offline Links:', cleanPlaylist.offline)
console.log('Online Links:', cleanPlaylist.links)

// 2. Check a Single Stream
const streamUrl = 'https://demiroren-live.daioncdn.net/kanald/kanald.m3u8'
const isOnline = await checker(streamUrl) // Check if stream is online
console.log(`Stream ${streamUrl} is ${isOnline ? 'online' : 'offline'}`)

// 3. Fetch and Parse Playlist from URL
const remoteUrl = 'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_samsung.m3u'
const remoteM3u = await url2text(remoteUrl) // Fetch M3U content from URL
const remotePlaylist = parser(remoteM3u) // Parse into Playlist object
fs.writeFileSync('remote_playlist.m3u', remotePlaylist.toText(), 'utf8') // Save to file

// 4. Create a New Playlist
const newPlaylist = new Playlist()
newPlaylist.header = {
  'x-tvg-url': 'http://example.com/epg.xml',
  'url-tvg': 'http://example.com/tvg'
}

// Create and configure a new link
const link = new Link('http://example.com/stream1.m3u8')
link.title = 'Sample Channel'
link.duration = -1 // Live stream
link.extinf = {
  'tvg-id': 'sample1',
  'group-title': 'Entertainment'
}
link.extgrp = 'Sports'
link.extvlcopt = {
  'http-user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}
newPlaylist.addLink(link) // Add link to playlist

// Save new playlist
fs.writeFileSync('new_playlist.m3u', newPlaylist.toText(), 'utf8')

// 5. Merge Playlists
const playlist1 = fs.readFileSync('playlist1.m3u', 'utf8')
const playlist2 = fs.readFileSync('playlist2.m3u', 'utf8')
const mergedPlaylist = await merger(playlist1, playlist2) // Merge local playlists
const mergedText = mergedPlaylist.toText()
fs.writeFileSync('merged_playlist.m3u', mergedText, 'utf8') // Save merged playlist

// Check merged playlist for valid streams
const cleanMerged = await mergedPlaylist.check()
fs.writeFileSync('clean_merged_playlist.m3u', cleanMerged.toText(), 'utf8')

// Log results
console.log('Merged Playlist Saved:', mergedText)
console.log('Clean Merged Playlist Links:', cleanMerged.links)
