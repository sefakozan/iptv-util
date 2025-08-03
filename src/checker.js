// "application/vnd.apple.mpegurl", "application/dash+xml", "application/octet-stream", "application/x-mpegURL", "application/x-mpegurl"
const contentTypeArr = ["mpegurl", "apple", "mpgurl", "/dash", "/octet", "/vnd.", "x-mpeg", "stream"];

export async function checker(url, timeout = 8000) {
	try {
		const response = await fetch(url, {
			method: "HEAD",
			signal: AbortSignal.timeout(timeout),
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		if (response.status !== 200) return false;

		//application/vnd.apple.mpegurl
		//application/dash+xml
		let contentType = response.headers.get("content-type");
		if (!contentType) contentType = "";
		contentType = contentType.toLowerCase();
		//const accessControl = response.headers.get("access-control-allow-origin");

		for (const ctype of contentTypeArr) {
			if (contentType.includes(ctype)) return true;
		}

		if (contentType === "" || contentType.includes("text")) {
			//extra islem
			const result = await checkContent(url, timeout);
			// console.log(`${result} ${url}`);
			// console.log(`${result} ${contentType}`);
			return result;
		}
		// console.log(url);
		// console.log(contentType);
		return false;
	} catch {
		return false;
	}
}

async function checkContent(url, timeout = 8000) {
	try {
		const response = await fetch(url, {
			method: "GET",
			signal: AbortSignal.timeout(timeout),
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		if (response.status !== 200) return false;

		const text = await response.text();

		if (!text.includes("#EXTM3U")) return false;

		const lineArr = text.split(/\s*\r*\n+\s*/gm);

		let innerUrl;

		for (const line of lineArr) {
			if (!line || line.startsWith("#")) continue;
			innerUrl = line;
			break;
		}

		if (!innerUrl.startsWith("http")) {
			innerUrl = changeLastSegment(url, innerUrl);
		}

		const result = await checker(innerUrl);
		return result;
	} catch {
		return false;
	}
}

function changeLastSegment(url, newSegment) {
	// URL'yi bölerek son segmenti al
	const segments = url.split("/");
	// Son segmenti yeni segmentle değiştir
	segments[segments.length - 1] = newSegment;
	// Segmentleri tekrar birleştir
	return segments.join("/");
}
