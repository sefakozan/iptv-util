var IptvUtil = (function (exports) {
	'use strict';

	// "application/vnd.apple.mpegurl", "application/dash+xml", "application/octet-stream", "application/x-mpegURL", "application/x-mpegurl", "video/mp2t"
	const contentTypeArr = ['mpegurl', 'apple', 'mpgurl', '/dash', '/octet', '/vnd.', 'x-mpeg', 'stream', 'video/'];
	const streamTypeArr = ['/octet', 'stream', 'video/'];

	/**
	 * @param {string} url
	 */
	async function checker(url, timeout = 10000, web = false) {
		let cleanUrl = '';
		try {
			cleanUrl = new URL(url.trim()).href;

			if (web) {
				if (cleanUrl.startsWith('http:')) return '';
				if (!url.includes('.m3u8') && !url.includes('.ts')) return '';
			}

			const response = await fetch(cleanUrl, {
				method: 'HEAD',
				signal: AbortSignal.timeout(timeout),
				credentials: 'include',
				headers: {
					Accept: '*/*',
					Origin: 'https://sefakozan.github.io',
					Referer: 'https://sefakozan.github.io/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
				},
			});

			if (response.status !== 200) return '';

			let contentType = response.headers.get('content-type');
			const newUrl = response.url?.trim();
			if (newUrl && newUrl !== cleanUrl) {
				// Update the URL if the response URL is different
				cleanUrl = newUrl;
			}

			if (!contentType) contentType = '';
			contentType = contentType.toLowerCase();

			const allowOrigin = response.headers.get('access-control-allow-origin');
			//const allowCredentials = response.headers.get('access-control-allow-credentials');

			// console.log(`\n\n${response.url}`);
			// console.log(`allowOrigin: ${allowOrigin}`);
			// console.log(`allowCredentials: ${allowCredentials}`);

			if (web) {
				if (!allowOrigin) return '';
				if (allowOrigin !== '*' && allowOrigin !== 'https://sefakozan.github.io') return '';
				if (response.url.startsWith('http:')) return '';
			}

			// if content type is stream return true
			for (const ctype of streamTypeArr) {
				if (contentType.includes(ctype)) {
					return cleanUrl;
				}
			}

			if (cleanUrl.includes('.m3u8')) {
				const isContentOk = await checkContent(cleanUrl, timeout, web);
				if (isContentOk) return cleanUrl;
				else return '';
			}

			let ctypeFlag = false;
			for (const ctype of contentTypeArr) {
				if (contentType.includes(ctype)) {
					ctypeFlag = true;
					break;
				}
			}
			if (!ctypeFlag) return '';

			if (contentType.includes('/dash')) {
				return cleanUrl;
			}

			// console.log(url);
			// console.log(contentType);
			return '';
		} catch {
			return '';
		}
	}

	/**
	 * @param {string} url
	 */
	async function checkContent(url, timeout = 5000, web = false) {
		try {
			if (web) {
				if (url.startsWith('http:')) return false;
				if (!url.includes('.m3u8') && !url.includes('.ts')) return false;
			}

			const response = await fetch(url, {
				method: 'GET',
				signal: AbortSignal.timeout(timeout),
				credentials: 'include',
				headers: {
					Accept: '*/*',
					Origin: 'https://sefakozan.github.io',
					Referer: 'https://sefakozan.github.io/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
				},
			});

			if (response.status !== 200) return false;

			const allowOrigin = response.headers.get('access-control-allow-origin');
			//const allowCredentials = response.headers.get('access-control-allow-credentials');

			if (web) {
				if (!allowOrigin) return false;
				if (allowOrigin !== '*' && allowOrigin !== 'https://sefakozan.github.io') return false;
				if (response.url.startsWith('http:')) return false;
			}

			// console.log(`\n\n${response.url}`);
			// console.log(`allowOrigin: ${allowOrigin}`);
			// console.log(`allowCredentials: ${allowCredentials}`);

			const text = await response.text();

			if (!text.includes('#EXTM3U')) return false;

			const lineArr = text.split(/\s*\r*\n+\s*/gm);

			let innerUrl;

			for (const line of lineArr) {
				if (!line || line.startsWith('#')) continue;
				innerUrl = line;
				break;
			}

			if (!innerUrl.startsWith('http')) {
				innerUrl = changeLastSegment(url, innerUrl);
			}

			if (web) {
				if (innerUrl.startsWith('http:')) return false;
			}

			const result = await checker(innerUrl, timeout, web);
			return result !== '';
		} catch {
			return false;
		}
	}

	function changeLastSegment(url, newSegment) {
		// URL'yi bölerek son segmenti al

		const urlObj = new URL(url);
		// SearchParams'ı temizle
		urlObj.search = '';
		url = urlObj.toString();

		const segments = url.split('/');
		// Son segmenti yeni segmentle değiştir
		segments[segments.length - 1] = newSegment;
		// Segmentleri tekrar birleştir
		return segments.join('/');
	}

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

	function parser(text, light = false) {
		const json = textParser(text);

		const playlist = new Playlist();
		playlist.header = {
			"x-tvg-url": json.header["x-tvg-url"],
			"url-tvg": json.header["url-tvg"],
		};

		for (const linkItem of json.links) {
			const link = new Link(linkItem.url);
			link.title = linkItem.title;
			link.duration = linkItem.duration;
			link.url = linkItem.url;

			if (light) {
				const idValue = linkItem.extinf["tvg-id"];
				if (idValue) {
					link.extinf = {
						"tvg-id": idValue,
					};
				}
				playlist.addLink(link);
				continue;
			}

			link.extinf = linkItem.extinf;
			link.extgrp = linkItem.extgrp;
			link.extvlcopt = linkItem.extvlcopt;

			playlist.addLink(link);
		}

		return playlist;
	}

	function textParser(text) {
		const playlist = {
			header: {},
			links: [],
		};

		const lines = text.split("\n").map(parseLine);
		const firstLine = lines.find((l) => l.index === 0);

		if (!firstLine || !/^#EXTM3U/.test(firstLine.raw)) throw new Error("Playlist is not valid");

		playlist.header = parseHeader(firstLine);

		let i = 0;
		const items = {};

		for (const line of lines) {
			if (line.index === 0) continue;
			const lineStr = line.raw.toString().trim();
			if (lineStr.startsWith("#EXTINF:")) {
				const EXTINF = lineStr;
				items[i] = {
					title: getName(EXTINF),
					duration: getDurationAttribute(EXTINF),
					extinf: {
						"tvg-id": getAttribute(EXTINF, "tvg-id"),
						"tvg-name": getAttribute(EXTINF, "tvg-name"),
						"tvg-logo": getAttribute(EXTINF, "tvg-logo"),
						"tvg-url": getAttribute(EXTINF, "tvg-url"),
						"tvg-rec": getAttribute(EXTINF, "tvg-rec"),
						"tvg-shift": getAttribute(EXTINF, "tvg-shift"),
						timeshift: getAttribute(EXTINF, "timeshift"),
						catchup: getAttribute(EXTINF, "catchup"),
						"catchup-days": getAttribute(EXTINF, "catchup-days"),
						"catchup-source": getAttribute(EXTINF, "catchup-source"),
						lang: getAttribute(EXTINF, "lang"),
						"user-agent": getAttribute(EXTINF, "user-agent"),
						"group-title": getAttribute(EXTINF, "group-title"),
					},
					extgrp: "",
					extvlcopt: {
						"http-referrer": "",
						"http-user-agent": "",
					},
					url: undefined,
					raw: line.raw,
					line: line.index + 1,
				};
			} else if (lineStr.startsWith("#EXTVLCOPT:")) {
				if (!items[i]) continue;
				const EXTVLCOPT = lineStr;
				items[i].extvlcopt["http-referrer"] = getOption(EXTVLCOPT, "http-referrer") || items[i].extvlcopt["http-referrer"];
				items[i].extvlcopt["http-user-agent"] = getOption(EXTVLCOPT, "http-user-agent") || items[i].extinf["user-agent"];
				items[i].raw += `\r\n${line.raw}`;
			} else if (lineStr.startsWith("#EXTGRP:")) {
				if (!items[i]) continue;
				const EXTGRP = lineStr;
				items[i].extgrp = getValue(EXTGRP) || items[i].extinf["group-title"];
				items[i].raw += `\r\n${line.raw}`;
			} else if (lineStr.startsWith("#")) {
				if (!items[i]) continue;
				items[i].raw += `\r\n${line.raw}`;
			} else {
				if (!items[i]) continue;
				const url = lineStr;
				const userAgent = getParameter(lineStr, "user-agent");
				const referrer = getParameter(lineStr, "referer");
				if (url) {
					items[i].url = url;
					items[i].extvlcopt["http-user-agent"] = userAgent || items[i].extvlcopt["http-user-agent"];
					items[i].extvlcopt["http-referrer"] = referrer || items[i].extvlcopt["http-referrer"];
					items[i].raw += `\r\n${line.raw}`;
					i++;
				} else {
					if (!items[i]) continue;
					items[i].raw += `\r\n${line.raw}`;
				}
			}
		}

		playlist.links = Object.values(items);
		return playlist;
	}

	function parseLine(line, index) {
		return {
			index,
			raw: line,
		};
	}

	function parseHeader(line) {
		const supportedAttrs = ["x-tvg-url", "url-tvg"];

		const header = { raw: line.raw };
		for (const attrName of supportedAttrs) {
			const tvgUrl = getAttribute(line.raw, attrName);
			if (tvgUrl) {
				header[attrName] = tvgUrl;
			}
		}

		return header;
	}

	function getName(text) {
		const info = text.replace(/="(.*?)"/g, "");
		const parts = info.split(/,(.*)/);

		return parts[1] || "";
	}

	function getAttribute(text, name) {
		const regex = new RegExp(name + '="(.*?)"', "gi");
		const match = regex.exec(text);

		return match && match[1] ? match[1] : "";
	}

	function getDurationAttribute(text) {
		const regex = /EXTINF:(.*?) /gi;
		const match = regex.exec(text);

		return match && match[1] ? match[1] : "-1";
	}

	function getOption(text, name) {
		const regex = new RegExp(":" + name + "=(.*)", "gi");
		const match = regex.exec(text);

		return match && match[1] && typeof match[1] === "string" ? match[1].replace(/"/g, "") : "";
	}

	function getValue(text, name) {
		const regex = /:(.*)/gi;
		const match = regex.exec(text);

		return match && match[1] && typeof match[1] === "string" ? match[1].replace(/"/g, "") : "";
	}

	function getParameter(text, name) {
		const params = text.replace(/^(.*)\|/, "");
		const regex = new RegExp(name + "=(\\w[^&]*)", "gi");
		const match = regex.exec(params);

		return match && match[1] ? match[1] : "";
	}

	async function url2text(url = '') {
		if (!url.startsWith('http')) return url;

		const result = await fetch(url, {
			method: 'GET',
			signal: AbortSignal.timeout(13000), // Attach the cancel signal to the request
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		})
			.then((response) => response.text()) // Get response as text
			.catch(() => ''); // Handle errors by returning empty string

		return result;
	}

	async function merger(...urls) {
		const textArr = [];
		for (const url of urls) {
			const text = url.startsWith("http") ? await url2text(url) : url;
			textArr.push(text);
		}
		const resultPlaylist = new Playlist();

		for (const text of textArr) {
			const playlist = parser(text);

			for (const link of playlist.links) {
				resultPlaylist.addLink(link);
			}
		}

		return resultPlaylist;
	}

	exports.Link = Link;
	exports.Playlist = Playlist;
	exports.checker = checker;
	exports.merger = merger;
	exports.parser = parser;
	exports.url2text = url2text;

	return exports;

})({});
