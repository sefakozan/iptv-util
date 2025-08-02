import { merger } from '../src/index.js'

const mergedList = await merger('https://raw.githubusercontent.com/iptv-org/iptv/f13518cda4f3c1cca39b5f2b36306807faed5ba6/streams/tr.m3u', 'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u', 'https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u')
debugger
