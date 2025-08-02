import { parser, Playlist, Link, checker, merger, url2text } from 'iptv-util'
import fs from 'node:fs/promises'

// 1. Parse an M3U file
async function parseExample () {
  try {
    const m3uContent = await fs.readFile('playlist.m3u', 'utf8')
    const playlist = parser(m3uContent)
    console.log('Parsed Playlist JSON:', playlist.toJson())
  } catch (error) {
    console.error('Parse Error:', error.message)
  }
}

// 2. Generate a new M3U playlist
function generateExample () {
  const playlist = new Playlist()
  const link1 = new Link({
    url: 'http://example.com/stream1.m3u8',
    title: 'Channel 1',
    attributes: { 'tvg-id': 'channel1', 'group-title': 'Entertainment' }
  })
  const link2 = new Link({
    url: 'http://example.com/stream2.m3u8',
    title: 'Channel 2',
    attributes: { 'tvg-id': 'channel2', 'group-title': 'Sports' }
  })
  playlist.addLink(link1)
  playlist.addLink(link2)

  const m3uText = playlist.toText()
  fs.writeFile('generated-playlist.m3u', m3uText)
  console.log('Generated M3U:', m3uText)
}

// 3. Check URLs in a playlist and a single link
async function checkExample () {
  try {
    // Check a single URL using checker
    const isOnline = await checker('http://example.com/stream1.m3u8')
    console.log('Single URL Status:', isOnline ? 'Online' : 'Offline')

    // Check an entire playlist
    const m3uContent = await fs.readFile('playlist.m3u', 'utf8')
    const playlist = parser(m3uContent)
    const checkedPlaylist = await playlist.check()
    console.log('Online Channels:', checkedPlaylist.links.length)
    console.log('Offline Channels:', checkedPlaylist.offline.length)
    await fs.writeFile('online-playlist.m3u', checkedPlaylist.toText())
  } catch (error) {
    console.error('Check Error:', error.message)
  }
}

// 4. Merge multiple playlists
async function mergeExample () {
  try {
    const playlist1 = await fs.readFile('playlist1.m3u', 'utf8')
    const playlist2 = await url2text('https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u')
    const mergedPlaylist = await merger([playlist1, playlist2])
    await fs.writeFile('merged-playlist.m3u', mergedPlaylist.toText())
    console.log('Merged Playlist:', mergedPlaylist.toJson())
  } catch (error) {
    console.error('Merge Error:', error.message)
  }
}

// Run all examples
async function main () {
  console.log('=== IPTV-Util Quickstart ===')
  await parseExample()
  generateExample()
  await checkExample()
  await mergeExample()
}

main().catch(console.error)
