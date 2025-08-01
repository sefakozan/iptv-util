const axios = require('axios')
const ffmpeg = (await import('ffmpeg-static')).default
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
    const response = await axios.head(url, { timeout: 500 })
    if (response.status !== 200) {
      return false
    }
  } catch (error) {
    return false
  }

  try {
    await execa(ffmpeg, [
      '-i', url, // Input HLS stream
      '-t', '1', // Limit to 10 seconds for testing
      '-c', 'copy', // Copy without re-encoding
      '-bsf:a', 'aac_adtstoasc', // Fix for AAC audio in HLS
      '-f', 'null', '-'
    ], {
      timeout: 5000,
      stdio: 'ignore'
    })

    // await execa(ffmpeg, ['-i', url, '-f', 'null', '-'], {
    //   timeout: 500,
    //   stdio: 'ignore'
    // })
  } catch (error) {
    return false
  }

  return true
}
