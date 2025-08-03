import fs from "node:fs";
import path from "node:path";
import { checker, parser } from "../src/index.js";

const allText = fs.readFileSync(path.join(path.resolve(), "example/all.m3u"), "utf8");

const playlist = parser(allText);

for (const link of playlist.links) {
	const isExits = await checker(link.url);
}
