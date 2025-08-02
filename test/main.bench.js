import fs from 'node:fs'
import path from 'node:path'
import { describe, bench } from 'vitest'
import { parser } from '../src/index'
import { parseM3U } from '@iptv/playlist'
import ippParser from 'iptv-playlist-parser'
import { M3uParser } from 'm3u-parser-generator'

const m3uParser = new M3uParser()

const playlistString = fs.readFileSync(
  path.join(path.resolve(), 'test/files/small.m3u'),
  'utf8'
)

describe('Parsing Files', () => {
  bench('iptv-util', () => {
    parser(playlistString)
  })
  bench('@iptv/playlist parseM3U', () => {
    parseM3U(playlistString)
  })

  bench('iptv-playlist-parser', () => {
    ippParser.parse(playlistString)
  })

  bench('m3u-parser-generator', () => {
    m3uParser.parse(playlistString)
  })
})
