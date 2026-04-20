import { NextResponse } from 'next/server'
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 })

    const tts = new MsEdgeTTS()
    // en-US-AvaNeural is one of the most advanced, natural neural voices available
    await tts.setMetadata("en-US-AvaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    // Sanitize text: Remove common markdown that the TTS shouldn't "read"
    // (Stripping asterisks, hashtags, and cleaning up excessive whitespace)
    const sanitizedText = text
      .replace(/\*\*/g, '') // bold
      .replace(/\*/g, '')  // bullet points/italics
      .replace(/#/g, '')   // headers
      .replace(/\[|\]/g, '') // brackets
      .replace(/\n\n/g, '. ') // Turn double breaks into distinct sentence pauses
      .replace(/\n/g, ' ')   // Turn single breaks into natural pauses/spaces
      .replace(/\s+/g, ' ')  // Collapse whitespace
      .trim()

    // Split by sentences for natural phrasing and chunk-compatibility.
    // Improved regex: matches sentences OR any remaining text without punctuation.
    const chunksRaw = sanitizedText.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [sanitizedText]
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
