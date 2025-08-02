import { url2text } from './url2text.js'
import { parser } from './parser.js'
import { Playlist } from './generator.js'

export async function merger (...urls) {
  const textArr = []
  for (const url of urls) {
    const text = await url2text(url)
    textArr.push(text)
  }
  const resultPlaylist = new Playlist()

  for (const text of textArr) {
    const playlist = parser(text)

    for (const link of playlist.links) {
      resultPlaylist.addLink(link)
    }
  }

  return resultPlaylist
}
