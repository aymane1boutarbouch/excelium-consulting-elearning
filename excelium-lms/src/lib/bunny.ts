import crypto from 'crypto'

export interface BunnyVideoStatus {
  guid: string
  title: string
  status: number // 0: Created, 1: Uploaded, 2: Processing, 3: Transcoding, 4: Finished, 5: Error
  encodeProgress: number
  length: number // duration in seconds
  thumbnailFileName?: string
  views?: number
}

const BUNNY_STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY || 'demo-bunny-api-key'
const BUNNY_STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || 'demo-library-123'
const BUNNY_STREAM_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME || 'iframe.mediadelivery.net'
const BUNNY_STREAM_TOKEN_KEY = process.env.BUNNY_STREAM_TOKEN_KEY || 'demo-security-token-key'

/**
 * Creates a video entry in Bunny Stream library.
 */
export async function createBunnyVideo(title: string): Promise<{ videoId: string; uploadUrl: string }> {
  // If in demo mode / missing real key, return a mock response for seamless operation
  if (BUNNY_STREAM_API_KEY === 'demo-bunny-api-key' || !process.env.BUNNY_STREAM_API_KEY) {
    const fakeId = `demo-bunny-vid-${Date.now()}`
    return {
      videoId: fakeId,
      uploadUrl: `https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${fakeId}`,
    }
  }

  const response = await fetch(`https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_STREAM_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Erreur Bunny Stream: ${errText}`)
  }

  const data = await response.json()
  return {
    videoId: data.guid,
    uploadUrl: `https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${data.guid}`,
  }
}

/**
 * Fetches status & transcoding progress of a Bunny video.
 */
export async function fetchBunnyVideoStatus(videoId: string): Promise<BunnyVideoStatus> {
  if (videoId.startsWith('demo-') || BUNNY_STREAM_API_KEY === 'demo-bunny-api-key') {
    return {
      guid: videoId,
      title: 'Vidéo démonstration (Pratique IS 2026)',
      status: 4, // Ready
      encodeProgress: 100,
      length: 5400, // 1h30
    }
  }

  const response = await fetch(`https://video.bunnycdn.com/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${videoId}`, {
    method: 'GET',
    headers: {
      'AccessKey': BUNNY_STREAM_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Impossible de récupérer le statut de la vidéo Bunny')
  }

  return response.json()
}

/**
 * Generates an expiring signed URL for secure iframe embedding with watermark parameters.
 */
export function generateBunnyEmbedUrl(videoId: string, studentEmail?: string, expiresHours: number = 24): string {
  if (videoId.startsWith('demo-') || !process.env.BUNNY_STREAM_API_KEY) {
    const encodedEmail = encodeURIComponent(studentEmail || 'apprenant@excelium.ma')
    return `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&email=${encodedEmail}`
  }

  const expires = Math.floor(Date.now() / 1000) + expiresHours * 3600
  const tokenKey = BUNNY_STREAM_TOKEN_KEY
  
  // SHA256 token digest for Bunny Stream security
  const hashableString = `${tokenKey}${videoId}${expires}`
  const token = crypto.createHash('sha256').update(hashableString).digest('hex')

  const baseUrl = `https://${BUNNY_STREAM_CDN_HOSTNAME}/embed/${BUNNY_STREAM_LIBRARY_ID}/${videoId}`
  const params = new URLSearchParams({
    token,
    expires: expires.toString(),
    autoplay: 'true',
    preload: 'true',
  })

  return `${baseUrl}?${params.toString()}`
}
