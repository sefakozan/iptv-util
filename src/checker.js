// "application/vnd.apple.mpegurl", "application/dash+xml", "application/octet-stream", "application/x-mpegURL", "application/x-mpegurl", "video/mp2t"
const contentTypeArr = ['mpegurl', 'apple', 'mpgurl', '/dash', '/octet', '/vnd.', 'x-mpeg', 'stream', 'video/'];
const streamTypeArr = ['/octet', 'stream', 'video/'];

/**
 * @param {string} url
 */
export async function checker(url, timeout = 10000, web = false) {
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
