import { checker } from './checker.js';

class Playlist {
	#urlSet = new Set();
	/**
	 * @type {Link[]}
	 */
	offline = [];

	/**
	 * @type {Link[]}
	 */
	links = [];

	header = {
		'x-tvg-url': '',
		'url-tvg': '',
	};

	/**
	 * @param {Link} link
	 */
	addLink(link) {
		const exist = this.#urlSet.has(link.url);
		if (!exist) {
			this.#urlSet.add(link.url);
			this.links.push(link);
		}
	}

	async check(timeout = 10000, web = false) {
		const cleanPlaylist = new Playlist();
		for (const link of this.links) {
			const isWorking = await checker(link.url, timeout, web);
			if (isWorking) {
				if (typeof isWorking === 'string') {
					link.url = isWorking; // Update the URL if the checker returns a new URL
				}
				cleanPlaylist.addLink(link);
				//console.log(`online: ${link.url}`);
			} else {
				cleanPlaylist.offline.push(link);
				//console.log(`offline: ${link.url}`);
			}
		}

		//console.log(`offline link count: ${cleanPlaylist.offline.length}`);
		//console.log(`online link count: ${cleanPlaylist.links.length}`);
		return cleanPlaylist;
	}

	toText() {
		return generateText(this.links, this.header);
	}

	toJson() {
		return {
			header: this.header,
			links: this.links,
		};
	}
}

class Link {
	url = '';
	title = '';
	duration = -1;
	/** @typedef {{ "tvg-id"?: string, "tvg-name"?: string, "tvg-logo"?: string }} ExtInf */
	extinf = {};
	extgrp = '';
	extvlcopt = {
		'http-referrer': '',
		'http-user-agent': '',
	};

	/**
	 * @param {string} url
	 */
	constructor(url) {
		this.url = url;
		this.extinf = {
			'tvg-id': undefined,
			'tvg-name': undefined,
			'tvg-logo': undefined,
			'tvg-url': undefined,
			'tvg-rec': undefined,
			'tvg-shift': undefined,
			timeshift: undefined,
			catchup: undefined,
			'catchup-days': undefined,
			'catchup-source': undefined,
			lang: undefined,
			'user-agent': undefined,
			'group-title': undefined,
		};
	}
}

export { Playlist, Link };

function generateText(links = [], header = {}) {
	let output = '#EXTM3U';
	for (const attr in header) {
		if (attr === 'raw') continue;
		const value = header[attr];
		if (value) output += ` ${attr}="${value}"`;
	}

	for (const link of links) {
		output += `\n#EXTINF:${link.duration}`;
		for (const name in link.extinf) {
			if (name === 'raw') continue;
			const value = link.extinf[name];
			if (value) {
				output += ` ${name}="${value}"`;
			}
		}
		output += `,${link.title}\n`;

		if (link.extgrp) {
			output += `#EXTGRP:${link.extgrp}\n`;
		}

		for (const name in link.extvlcopt) {
			if (name === 'raw') continue;
			const value = link.extvlcopt[name];
			if (value) {
				output += `#EXTVLCOPT:${name}=${value}\n`;
			}
		}

		output += `${link.url}`;
	}

	return output;
}
