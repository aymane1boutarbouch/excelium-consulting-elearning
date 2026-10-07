import { NextResponse } from 'next/server'
import { createBunnyVideo } from '@/lib/bunny'

export async function POST(req: Request) {
  try {
    const { title } = await req.json()
    if (!title) {
      return NextResponse.json({ error: 'Le titre de la vidéo est requis' }, { status: 400 })
    }

    const videoData = await createBunnyVideo(title)
    return NextResponse.json(videoData)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur d\'initialisation vidéo' }, { status: 500 })
  }
}
