import { NextResponse } from 'next/server'
import { fetchBunnyVideoStatus } from '@/lib/bunny'

export async function GET(req: Request, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId
    if (!videoId) {
      return NextResponse.json({ error: 'ID Vidéo manquant' }, { status: 400 })
    }

    const status = await fetchBunnyVideoStatus(videoId)
    return NextResponse.json(status)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
