import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { parser } from '../src/index'

const playlistString = fs.readFileSync(
  path.join(path.resolve(), 'test/files/abc.m3u'),
  'utf8'
)

test('abc.m3u', async () => {
  const result = parser(playlistString, false)
  const textStr = result.toString()
  expect(false).toBe(false)
})
