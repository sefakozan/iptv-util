import { Playlist, Link } from "./generator.js";

export function parser(text, light = false) {
	const json = textParser(text);

	const playlist = new Playlist();
	playlist.header = json.header;

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
