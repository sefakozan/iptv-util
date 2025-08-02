class Playlist {
  #urlSet = new Set()

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
    output += ` ${attr}="${value}"`
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
