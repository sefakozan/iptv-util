import { expect, test } from 'vitest'
import { square, check } from '../src/index'

test('4^2 to equal 16', () => {
  expect(square(4)).toBe(16)
})

test('(-3)^2 to equal 9', () => {
  expect(square(-3)).toBe(9)
})

test('https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8', async () => {
  const result = await check('https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8')
  expect(result).toBe(false)
})

test('https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8', async () => {
  const result = await check('https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8')
  expect(result).toBe(true)
})
