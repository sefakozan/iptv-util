import { expect, test } from "vitest";
import { checker } from "../src/index";

test("https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8", async () => {
	const result = await checker("https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8");
	expect(result).toBe(false);
});

test("https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8", async () => {
	const result = await checker("https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8");
	expect(result).toBe(true);
});

test("https://vs-cmaf-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/iptv_hd_abr_v1.mpd", async () => {
	const result = await checker("https://vs-cmaf-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/iptv_hd_abr_v1.mpd");
	expect(result).toBe(true);
});

// https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3

test("https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3", async () => {
	const result = await checker("https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3");
	expect(result).toBe(true);
});

// http://185.234.111.229:8000/play/a01m

test("http://185.234.111.229:8000/play/a01m", async () => {
	const result = await checker("http://185.234.111.229:8000/play/a01m");
	expect(result).toBe(true);
});
