import axios from "axios";

export async function url2text(url = "https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u") {
	if (!url.startsWith("http")) return url;

	// Web sitesinden metin verisi çekme ve isteği iptal etme
	const controller = new AbortController(); // İsteği iptal etmek için AbortController oluştur
	const result = await axios
		.get(url, {
			signal: controller.signal, // İptal sinyalini isteğe bağla
			responseType: "text", // Yanıtı metin formatında al
			timeout: 5000, // 5 saniye zaman aşımı
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		})
		.then((response) => response.data) // Başarılı yanıtı konsola yazdır
		.catch(() => ""); // Hataları konsola yazdır

	// İsteği iptal et
	controller.abort(); // İsteği anında iptal et

	return result;
}
