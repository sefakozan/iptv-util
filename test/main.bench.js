import fs from 'node:fs'
import path from 'node:path'
import { describe, bench } from 'vitest'
import { parser } from '../src/index'
import { parseM3U } from '@iptv/playlist'
import ippParser from 'iptv-playlist-parser'
import esxParser from 'esx-iptv-playlist-parser'

const playlistString = fs.readFileSync(
  path.join(path.resolve(), 'test/files/large.m3u'),
  'utf8'
)

describe('Parsing Files', () => {
  bench('iptv-util', () => {
    parser(playlistString)
  })
  bench('@iptv/playlist', () => {
    parseM3U(playlistString)
  })

  bench('iptv-playlist-parser', () => {
    ippParser.parse(playlistString)
  })

  bench('esx-iptv-playlist-parser', () => {
    esxParser.parse(playlistString)
  })
})
