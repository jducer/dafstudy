import { NextResponse } from 'next/server'
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 })

    const tts = new MsEdgeTTS()
    // en-US-AvaNeural is one of the most advanced, natural neural voices available
    await tts.setMetadata("en-US-AvaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    // Split by sentences for natural phrasing and chunk-compatibility
    const chunksRaw = text.match(/[^.!?]+[.!?]+/g) || [text]
    const finalChunks = []

    for (const chunkText of chunksRaw) {
      if (!chunkText.trim()) continue
      
      const { audioStream } = tts.toStream(chunkText.trim())
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const _chunks: any[] = []
        audioStream.on('data', (d) => _chunks.push(d))
        audioStream.on('end', () => resolve(Buffer.concat(_chunks)))
        audioStream.on('error', (e) => reject(e))
      })

      finalChunks.push({
        base64: buffer.toString('base64')
      })
    }
    
    return NextResponse.json({ chunks: finalChunks })
  } catch (error: any) {
    console.error('[TTS API Error]', error)
    return NextResponse.json({ error: error.message || 'TTS Generation Failed' }, { status: 500 })
  }
}
