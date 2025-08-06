export async function url2text(url = '') {
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
