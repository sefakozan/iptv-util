import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const platform = os.platform();
if (platform !== "darwin" && platform !== "linux" && platform !== "win32") {
	console.error("Unsupported platform.");
	process.exit(1);
}

const arch = os.arch();

if (platform === "darwin" && arch !== "x64" && arch !== "arm64") {
	console.error("Unsupported architecture.");
	process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ffprobe = path.join(__dirname, "..", "bin", platform, arch, platform === "win32" ? "ffprobe.exe" : "ffprobe");
