// app/api/tests/[id]/reveal/route.ts
import { NextResponse } from 'next/server'
import { prismaMain } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { answerId } = body

    if (!answerId) return NextResponse.json({ error: 'Missing answerId' }, { status: 400 })

    const updated = await prismaMain.questionAnswer.update({
      where: { id: answerId },
      data: { solutionRevealed: true },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('POST /api/tests/[id]/reveal error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
