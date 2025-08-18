import { Playlist } from "./generator.js";
import { parser } from "./parser.js";
import { url2text } from "./url2text.js";

export async function merger(...urls) {
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
