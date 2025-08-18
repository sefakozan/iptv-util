import { describe, expect, it } from 'vitest';
import { checker } from '../src/index';

it('https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8', async () => {
	const result = await checker('https://canlitvulusal3.xyz/live/beinsportshaber/index.m3u8');
	expect(result).toBeFalsy();
});

it('https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8', async () => {
	const result = await checker('https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8');
	expect(result).toBeTruthy();
});

it('https://vs-cmaf-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/iptv_hd_abr_v1.mpd', async () => {
	const result = await checker('https://vs-cmaf-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/iptv_hd_abr_v1.mpd');
	expect(result).toBeTruthy();
});

// https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3

it('https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3', async () => {
	const result = await checker('https://beyaztv.daioncdn.net/beyaztv/beyaztv.m3u8?app=fcd5c66b-da9d-44ba-a410-4f34805c397d&ce=3');
	expect(result).toBeTruthy();
});

it('http://185.234.111.229:8000/play/a01m', async () => {
	const result = await checker('http://185.234.111.229:8000/play/a01m');
	expect(result).toBeTruthy();
});

it('https://raw.githubusercontent.com/UzunMuhalefet/streams/main/myvideo-az/tmb-tv.m3u8', async () => {
	const result = await checker('https://raw.githubusercontent.com/UzunMuhalefet/streams/main/myvideo-az/tmb-tv.m3u8');
	expect(result).toBeTruthy();
});

it('https://raw.githubusercontent.com/ipstreet312/freeiptv/master/ressources/dzflix/helwa.m3u8', async () => {
	const result = await checker('https://raw.githubusercontent.com/ipstreet312/freeiptv/master/ressources/dzflix/helwa.m3u8');
	expect(result).toBeFalsy();
});

describe('follow redirect issue', () => {
	const url1 = 'https://bloomberg.com/media-manifest/streams/eu-event.m3u8';
	const url2 = 'https://ciner-live.daioncdn.net/haberturktv/haberturktv.m3u8';
	const url3 = 'https://trkvz-live.daioncdn.net/minikago_cocuk/minikago_cocuk.m3u8';

	it(url1, async () => {
		const result = await checker(url1);
		expect(result).toBeTruthy();
		expect(result).not.toBe(url1);
	});

	it(url2, async () => {
		const result = await checker(url2);
		expect(result).toBeTruthy();
		expect(result).toBe(url2);
	});

	it(url3, async () => {
		const result = await checker(url3);
		expect(result).toBeFalsy();
	});
});

describe('cross origin for vlc', () => {
	const url1 = 'https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3';
	const url2 = 'https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8';
	const url3 = 'https://canlitvulusal.xyz/live/showmax/index.m3u8';
	const url4 = 'https://canlitvulusal.xyz/live/showturk/index.m3u8';
	const url5 = 'https://raw.githubusercontent.com/UzunMuhalefet/streams/main/myvideo-az/tmb-tv.m3u8';
	const url6 = 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8';

	it(url1, async () => {
		const result = await checker(url1);
		expect(result).toBeTruthy();
	});

	it(url2, async () => {
		const result = await checker(url2);
		expect(result).toBeTruthy();
	});

	it(url3, async () => {
		const result = await checker(url3);
		expect(result).toBeTruthy();
	});

	it(url4, async () => {
		const result = await checker(url4);
		expect(result).toBeTruthy();
	});

	it(url5, async () => {
		const result = await checker(url5);
		expect(result).toBeTruthy();
	});

	it(url6, async () => {
		const result = await checker(url6);
		expect(result).toBeTruthy();
	});
});

describe('cross origin for web', () => {
	const url1 = 'https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3';
	const url2 = 'https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8';
	const url3 = 'https://canlitvulusal.xyz/live/showmax/index.m3u8';
	const url4 = 'https://canlitvulusal.xyz/live/showturk/index.m3u8';
	const url5 = 'https://raw.githubusercontent.com/UzunMuhalefet/streams/main/myvideo-az/tmb-tv.m3u8';
	const url6 = 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8';

	it(url1, async () => {
		const result = await checker(url1, 10000, true);
		expect(result).toBeFalsy();
	});

	it(url2, async () => {
		const result = await checker(url2, 10000, true);
		expect(result).toBeFalsy();
	});

	it(url3, async () => {
		const result = await checker(url3, 10000, true);
		expect(result).toBeFalsy();
	});

	it(url4, async () => {
		const result = await checker(url4, 10000, true);
		expect(result).toBeFalsy();
	});

	it(url5, async () => {
		const result = await checker(url5, 10000, true);
		expect(result).toBeFalsy();
	});

	it(url6, async () => {
		const result = await checker(url6, 10000, true);
		expect(result).toBeFalsy();
	});
});
