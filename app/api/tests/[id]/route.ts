// app/api/tests/[id]/route.ts
// GET → fetch a single test with all answers

import { NextResponse } from 'next/server'
import { prismaMain } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testId = parseInt(id, 10)
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 })
    }

    const test = await prismaMain.testResult.findUnique({
      where: { id: testId },
      include: { answers: true },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (err) {
    console.error('GET /api/tests/[id] error:', err)
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 })
  }
}
