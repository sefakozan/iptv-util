import { execFile } from "node:child_process";
import util from "node:util";
import { ffprobe } from "../src/ffprobe.js";

const execFilePromise = util.promisify(execFile);

const url = "http://185.234.111.229:8000/play/a059";

//-probesize 1000000 -analyzeduration 2000000

//	"-show_streams",
// 	"-show_format",

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
	while (true) {
		console.time("time");
		const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("ffprobe timeout")), 13000));
		const { stdout, stderr } = await Promise.race([execFilePromise(ffprobe, args), timeoutPromise]);

		const data = JSON.parse(stdout);
		let success = !stderr;
		//const videoCodec = data.streams?.find((s) => s.codec_type === "video")?.codec_name || undefined;
		//const audioCodec = data.streams?.find((s) => s.codec_type === "audio")?.codec_name || undefined;
		const format = data.format?.format_name || undefined;

		if (format) {
			success = true;
		}

		console.timeEnd("time");
	}
} catch (error) {
	debugger;
}
