import { execFile } from "node:child_process";
import util from "node:util";
import { ffprobe } from "./ffprobe.js";

const execFilePromise = util.promisify(execFile);

export async function checker(url) {
	try {
		const response = await fetch(url, {
			method: "HEAD",
			signal: AbortSignal.timeout(8000),
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		if (response.status !== 200) {
			return false;
		} else {
			// const headers = response.headers
			// console.log('Access-Control-Allow-Origin:', headers['access-control-allow-origin'])
			// console.log('Access-Control-Allow-Methods:', headers['access-control-allow-methods'])
			// console.log('Access-Control-Allow-Headers:', headers['access-control-allow-headers'])
			// console.log('Access-Control-Max-Age:', headers['access-control-max-age'])
		}
	} catch {
		return false;
	}

	try {
		const result = await getStreamCodecs(url);

		if (!result.success) {
			return false;
		}
	} catch {
		return false;
	}

	return true;
}

async function getStreamCodecs(url) {
	const args = [
		"-headers",
		"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n",
		"-v",
		"error",
		"-hide_banner",
		//"-show_format",
		"-show_format",
		"-show_entries",
		"format=format_name",
		"-print_format",
		"json",
		"-probesize",
		"500000", // 1000000: Limits analysis to 1 MB of data.
		"-analyzeduration",
		"1000000", // 2000000: Limits analysis to 2 seconds.
		"-skip_frame",
		"noref",
		// "-select_streams",
		// "v",
		"-i",
		url,
	];

	try {
		const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("ffprobe timeout")), 13000));
		const { stdout, stderr } = await Promise.race([execFilePromise(ffprobe, args), timeoutPromise]);

		const data = JSON.parse(stdout);
		let success = !stderr;
		//const videoCodec = data.streams.find((s) => s.codec_type === "video")?.codec_name || undefined;
		//const audioCodec = data.streams.find((s) => s.codec_type === "audio")?.codec_name || undefined;
		const format = data.format?.format_name || undefined;

		if (format) {
			success = true;
		}

		return {
			success,
			format,
		};
	} catch (error) {
		return {
			success: false,
			message: `ffprobe error: ${error.message}`,
			details: error.stderr,
		};
	}
}

// https://raw.githubusercontent.com/iptv-org/iptv/f13518cda4f3c1cca39b5f2b36306807faed5ba6/streams/tr.m3u

// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_bbc.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_pluto.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_rakuten.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_samsung.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u
