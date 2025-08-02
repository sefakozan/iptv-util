import { merger } from '../src/index.js'

const listArray = [
  'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u',
  'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u'
]

const playlist = await merger(...listArray)

await playlist.check(10)

const text = playlist.toText()

debugger
