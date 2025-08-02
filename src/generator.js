import { checker } from './checker.js'

class Playlist {
  #urlSet = new Set()
  offline = []

  constructor () {
    this.header = {
      'x-tvg-url': '',
      'url-tvg': ''
    }
    this.links = []
  }

  addLink (link) {
    const exist = this.#urlSet.has(link.url)
    if (!exist) {
      this.#urlSet.add(link.url)
      this.links.push(link)
    }
  }

  async check (max = Number.MAX_SAFE_INTEGER) {
    const online = []
    let counter = 0
    for (const link of this.links) {
      counter++
      const isWorking = await checker(link.url)
      if (isWorking) {
        online.push(link)
        console.log(`online: ${link.url}`)
      } else {
        this.offline.push(link)
        console.log(`offline: ${link.url}`)
      }
      if (counter > max) break
    }

    console.log(`offline link count: ${this.offline.length}`)
    console.log(`online link count: ${online.length}`)
    this.links = online
  }

  toText () {
    return generateText(this.links, this.header)
  }

  toJson () {
    return {
      header: this.header,
      links: this.links
    }
  }
}

class Link {
  constructor (url) {
    this.url = url
    this.title = ''
    this.duration = -1
    this.extinf = {}
    this.extgrp = ''
    this.extvlcopt = {}
  }
}

export {
  Playlist,
  Link
}

function generateText (links = [], header = {}) {
  let output = '#EXTM3U'
  for (const attr in header) {
    if (attr === 'raw') continue
    const value = header[attr]
    if (value) output += ` ${attr}="${value}"`
  }

  for (const link of links) {
    output += `\n#EXTINF:${link.duration}`
    for (const name in link.extinf) {
      if (name === 'raw') continue
      const value = link.extinf[name]
      if (value) {
        output += ` ${name}="${value}"`
      }
    }
    output += `,${link.title}\n`

    if (link.extgrp) {
      output += `#EXTGRP:${link.extgrp}\n`
    }

    for (const name in link.extvlcopt) {
      if (name === 'raw') continue
      const value = link.extvlcopt[name]
      if (value) {
        output += `#EXTVLCOPT:${name}=${value}\n`
      }
    }

    output += `${link.url}`
  }

  return output
}
