import { NextResponse } from 'next/server'
import * as googleTTS from 'google-tts-api'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 })

    // Automatically chunks text > 200 chars and returning base64 audio strings
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: 'en-US',
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?!',
    })
    
    return NextResponse.json({ chunks: results })
  } catch (error: any) {
    console.error('[TTS API Error]', error)
    return NextResponse.json({ error: error.message || 'TTS Generation Failed' }, { status: 500 })
  }
}
