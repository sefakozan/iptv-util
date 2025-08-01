import axios from 'axios'
const ffprobe = (await import('ffprobe-static')).default
const execa = (await import('execa')).execa

// Basit bir kare alma fonksiyonu
export function square (number) {
  return number * number
}

export function cube (number) {
  return number * number * number
}

export async function check (url) {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    if (response.status !== 200) {
      return false
    }
  } catch (error) {
    return false
  }

  try {
    const result = await getStreamCodecs(url)

    if (!result.success) {
      return false
    }
  } catch (error) {
    return false
  }

  return true
}

async function getStreamCodecs (url) {
  try {
    const { stdout, stderr } = await execa(ffprobe.path, [
      '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n',
      '-v', 'error',
      '-show_streams',
      '-show_format',
      '-print_format', 'json',
      '-i', url
    ], {
      timeout: 10000
    })

    const data = JSON.parse(stdout)
    let success = stderr === undefined
    const videoCodec = data.streams.find(s => s.codec_type === 'video')?.codec_name || undefined
    const audioCodec = data.streams.find(s => s.codec_type === 'audio')?.codec_name || undefined
    const format = data.format?.format_name || undefined

    if (videoCodec !== undefined || audioCodec !== undefined || format !== undefined) {
      success = true
    }

    return {
      success,
      videoCodec,
      audioCodec,
      format
    }
  } catch (error) {
    return {
      success: false,
      message: `ffprobe hatası: ${error.message}`,
      details: error.stderr
    }
  }
}

export function merge (...urls) {

}
// https://raw.githubusercontent.com/iptv-org/iptv/f13518cda4f3c1cca39b5f2b36306807faed5ba6/streams/tr.m3u

// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_bbc.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_pluto.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_rakuten.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_samsung.m3u
// https://raw.githubusercontent.com/iptv-org/iptv/refs/heads/master/streams/uk_sportstribal.m3u
