import { parser } from "../src/index.js";

const text = `#EXTM3U
#EXTINF:-1 tvg-id="24TV.tr",24 TV (1080p)
http://185.234.111.229:8000/play/a059
#EXTINF:-1 tvg-id="24TV.tr" http-user-agent="Mozilla/5.0 Macintosh; Intel Mac OS X 10_14_5 AppleWebKit/537.36 KHTML, like Gecko Chrome/76.0.3809.25 Safari/537.36",24 TV (1080p)
#EXTVLCOPT:http-user-agent=Mozilla/5.0 Macintosh; Intel Mac OS X 10_14_5 AppleWebKit/537.36 KHTML, like Gecko Chrome/76.0.3809.25 Safari/537.36
https://mn-nl.mncdn.com/kanal24/smil:kanal24.smil/playlist.m3u8
#EXTINF:10 tvg-id="TJKTV2.tr@SD",TJK TV 2 (1080p) [Not 24/7]
https://tjktv-live.tjk.org/tjktv2/tjktv2.m3u8`;

const playlist = parser(text);

debugger;
