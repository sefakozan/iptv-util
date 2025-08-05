// "application/vnd.apple.mpegurl", "application/dash+xml", "application/octet-stream", "application/x-mpegURL", "application/x-mpegurl", "video/mp2t"
const contentTypeArr = ['mpegurl', 'apple', 'mpgurl', '/dash', '/octet', '/vnd.', 'x-mpeg', 'stream', 'video/'];
const streamTypeArr = ['/octet', 'stream', 'video/'];

/**
 * @param {string} url
 */
export async function checker(url, timeout = 10000) {
	let cleanUrl = '';
	try {
		cleanUrl = new URL(url.trim()).href;
		const response = await fetch(cleanUrl, {
			method: 'HEAD',
			signal: AbortSignal.timeout(timeout),
			headers: {
				//mode: "cors",
				// referer: "https://sefakozan.github.io/",
				// "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
				// "sec-ch-ua-mobile": "?0",
				// "sec-ch-ua-platform": '"Windows"',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
			},
		});

		if (response.status !== 200) return '';

		//application/vnd.apple.mpegurl
		//application/dash+xml
		let contentType = response.headers.get('content-type');
		const newUrl = response.url?.trim();
		if (newUrl && newUrl !== cleanUrl) {
			cleanUrl = newUrl; // Update the URL if the response URL is different
		}

		if (!contentType) contentType = '';
		contentType = contentType.toLowerCase();
		// const accessControl = response.headers.get("access-control-allow-origin");
		// const accessMetod = response.headers.get("access-control-allow-method");

		// if (web && accessControl !== "*") {
		// 	return "";
		// }

		// if content type is stream return true
		for (const ctype of streamTypeArr) {
			if (contentType.includes(ctype)) {
				return cleanUrl;
			}
		}

		if (cleanUrl.includes('.m3u8')) {
			const isContentOk = await checkContent(cleanUrl, timeout);
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
async function checkContent(url, timeout = 5000) {
	try {
		const response = await fetch(url, {
			method: 'GET',
			signal: AbortSignal.timeout(timeout),
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
			},
		});

		if (response.status !== 200) return false;

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

		const result = await checker(innerUrl);
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
