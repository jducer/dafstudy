'use client'
// app/review/[id]/page.tsx
// Review a completed test: see correct/wrong answers, ask Sparky for hints, resubmit answers

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

/** Converts Sparky's markdown-ish output into clean HTML for rendering */
function renderMarkdown(text: string): string {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Remove lone asterisk bullets and replace with a proper emoji bullet
    .replace(/^\* /gm, '🔹 ')
    // Numbered lists: keep numbers but add a line break before each
    .replace(/^(\d+\. )/gm, '<br><br>$1')
    // Emoji bullets on their own line: add spacing before them
    .replace(/^([🍎💎🚀🔹🎯✅❌🌟⭐🎈🍕🍭])/gm, '<br><br>$1')
    // Double newlines → paragraph breaks
    .replace(/\n\n/g, '<br><br>')
    // Single newlines → line breaks
    .replace(/\n/g, '<br>')
    // Clean up any triple+ breaks
    .replace(/(<br>){3,}/g, '<br><br>')
    // Remove leading breaks
    .replace(/^(<br>)+/, '')
}

/** Strips markdown for TTS reading */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/^\* /gm, '')
    .replace(/([🍎💎🚀🔹🎯✅❌🌟⭐🎈🍕🍭])/g, '')
}

/** Uses Web Speech API to read text aloud with a better voice */
function speakText(text: string) {
  if (!('speechSynthesis' in window)) return
  
  // Stop any currently playing speech
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(stripMarkdown(text))
  
  // Try to find a high-quality, natural-sounding voice
  const voices = window.speechSynthesis.getVoices()
  // Ranked list of preferred premium/natural voices available on most OS/Browsers
  const preferredVoices = [
    'Google US English', // Chrome premium
    'Samantha',          // macOS Siri default
    'Alex',              // macOS High Quality
    'Karen',             // macOS Premium
    'Victoria',          // macOS Premium
    'Daniel'             // good British alternative
  ]
  
  let selectedVoice = null
  for (const preferred of preferredVoices) {
    selectedVoice = voices.find(v => v.name.includes(preferred))
    if (selectedVoice) break
  }
  
  // Fallback to any decent English voice if premiums aren't found
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith('en-') && !v.name.includes('Microsoft'))
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  utterance.rate = 0.95 // slightly slower for clarity
  utterance.pitch = 1.05 // slightly elevated for a friendly tone
  window.speechSynthesis.speak(utterance)
}

interface QuestionAnswer {
  id: number
  testResultId: number
  questionId: string
  questionText: string
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean
  isRectified: boolean
  rectifiedAnswer: string | null
  options?: string[]
  diagramType?: string
  diagramContent?: string
  questionType?: string
  solutionRevealed: boolean
}

interface TestResult {
  id: number
  createdAt: string
  totalQuestions: number
  originalScore: number
  currentScore: number
  isFullyRectified: boolean
  answers: QuestionAnswer[]
}

interface HintState {
  [answerId: number]: { loading: boolean; text: string | null; error: string | null }
}

interface RectifyState {
  [answerId: number]: { selected: string; submitting: boolean; result: 'correct' | 'wrong' | null }
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [test, setTest] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [hints, setHints] = useState<HintState>({})
  const [rectify, setRectify] = useState<RectifyState>({})
  const [shownAnswers, setShownAnswers] = useState<Record<number, boolean>>({}) // answerId -> boolean
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all')

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data: TestResult) => {
        setTest(data)
        const initialShown: Record<number, boolean> = {}
        data.answers?.forEach(a => {
          if (a.solutionRevealed) initialShown[a.id] = true
        })
        setShownAnswers(initialShown)
        setLoading(false)
      })
      .catch(() => {
        setTest(null)
        setLoading(false)
      })
  }, [id])

  const askSparky = async (answer: QuestionAnswer, explainMode = false, expoundMode = false) => {
    const currentHint = hints[answer.id]?.text
    
    setHints((prev) => ({
      ...prev,
      [answer.id]: { loading: true, text: currentHint, error: null },
    }))

    try {
      let options: string[] = []
      try {
        if ((answer as any).optionsJson) {
          options = JSON.parse((answer as any).optionsJson)
        }
      } catch (e) {}

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: answer.questionText,
          correctAnswer: answer.correctAnswer,
          userAnswer: answer.userAnswer,
          options,
          explainMode,
          expoundMode,
          previousHint: expoundMode ? currentHint : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setHints((prev) => ({
        ...prev,
        [answer.id]: { loading: false, text: data.hint, error: null },
      }))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get hint'
      setHints((prev) => ({
        ...prev,
        [answer.id]: { loading: false, text: null, error: msg },
      }))
    }
  }

  const handleShowAnswer = async (answer: QuestionAnswer) => {
    setShownAnswers(prev => ({ ...prev, [answer.id]: true }))
    // Automatically trigger Sparky explanation
    askSparky(answer, true, false)
    
    // Save to DB that solution was revealed
    try {
      await fetch(`/api/tests/${id}/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId: answer.id }),
      })
    } catch (e) {
      console.error('Failed to save reveal state:', e)
    }
  }

  const handleRectifySelect = (answerId: number, option: string) => {
    setRectify((prev) => ({
      ...prev,
      [answerId]: { selected: option, submitting: false, result: null },
    }))
  }

  const submitRectify = async (answer: QuestionAnswer) => {
    const r = rectify[answer.id]
    if (!r?.selected) return

    setRectify((prev) => ({
      ...prev,
      [answer.id]: { ...prev[answer.id], submitting: true },
    }))

    try {
      const res = await fetch(`/api/tests/${id}/rectify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId: answer.id, newAnswer: r.selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('Submission failed')

      const isCorrect = data.answer.isRectified
      
      // Update local test state WITHOUT wiping the whole object to preserve scroll/DOM
      setTest(prev => {
        if (!prev) return data.test
        const newAnswers = prev.answers.map(a => a.id === data.answer.id ? data.answer : a)
        return {
          ...prev,
          currentScore: data.test.currentScore,
          isFullyRectified: data.test.isFullyRectified,
          answers: newAnswers
        }
      })

      setRectify((prev) => ({
        ...prev,
        [answer.id]: { ...prev[answer.id], submitting: false, result: isCorrect ? 'correct' : 'wrong' },
      }))
    } catch {
      setRectify((prev) => ({
        ...prev,
        [answer.id]: { ...prev[answer.id], submitting: false },
      }))
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
        Loading your test results...
      </div>
    )
  }

  if (!test) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❓</div>
        <h2 style={{ fontWeight: 800 }}>Test not found</h2>
        <Link href="/dashboard"><button className="btn-primary" style={{ marginTop: '16px' }}>← Back to Dashboard</button></Link>
      </div>
    )
  }

  const pct = Math.round((test.originalScore / test.totalQuestions) * 100)
  const currentPct = Math.round((test.currentScore / test.totalQuestions) * 100)
  const wrongAnswers = test.answers.filter((a) => !a.isCorrect)
  const correctAnswers = test.answers.filter((a) => a.isCorrect)

  const filteredAnswers =
    filter === 'wrong'
      ? wrongAnswers
      : filter === 'correct'
        ? correctAnswers
        : test.answers

  const scoreColor = pct >= 80 ? '#06d6a0' : pct >= 60 ? '#4f8ef7' : '#ef476f'
  const scoreLabel = pct >= 80 ? '🎉 Excellent work!' : pct >= 60 ? '👍 Good job!' : '💪 Keep practicing!'

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Back link */}
      <Link href="/dashboard">
        <button className="btn-secondary" style={{ marginBottom: '24px', padding: '8px 18px', fontSize: '0.875rem' }}>
          ← Back to Dashboard
        </button>
      </Link>

      {/* Score card */}
      <div className="glass-card animate-fadeIn" style={{
        padding: '32px',
        marginBottom: '32px',
        background: `linear-gradient(135deg, rgba(22,33,62,0.8), rgba(26,26,46,0.9))`,
        borderColor: `${scoreColor}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            border: `4px solid ${scoreColor}`,
            background: `${scoreColor}18`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ORIGINAL</div>
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: '4px' }}>
              Test #{test.id} Results · {scoreLabel}
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
              {new Date(test.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <span style={{ color: '#06d6a0', fontWeight: 700 }}>✅ {test.originalScore} correct</span>
              <span style={{ color: '#ef476f', fontWeight: 700 }}>❌ {wrongAnswers.length} wrong</span>
              {test.isFullyRectified && (
                <span className="badge-rectified" style={{ fontSize: '0.85rem', padding: '3px 12px' }}>⭐ Fully Rectified</span>
              )}
              {currentPct > pct && (
                <span style={{ color: '#ffd166', fontWeight: 700 }}>🔄 After rectification: {currentPct}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${scoreColor}, #4f8ef7)`,
            }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'all', label: `All (${test.answers.length})` },
          { key: 'wrong', label: `❌ Wrong (${wrongAnswers.length})` },
          { key: 'correct', label: `✅ Correct (${correctAnswers.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as 'all' | 'wrong' | 'correct')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: `2px solid ${filter === tab.key ? 'var(--accent-blue)' : 'rgba(255,255,255,0.08)'}`,
              background: filter === tab.key ? 'rgba(79,142,247,0.15)' : 'transparent',
              color: filter === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredAnswers.map((answer, idx) => {
          const globalIdx = test.answers.findIndex((a) => a.id === answer.id)
          const hint = hints[answer.id]
          const r = rectify[answer.id]
          const needsRectify = !answer.isCorrect && !answer.isRectified
          const isRectifiedCorrectly = answer.isRectified

          return (
            <div
              key={answer.id}
              className="glass-card animate-fadeIn"
              style={{
                padding: '24px',
                borderColor: answer.isCorrect || isRectifiedCorrectly
                  ? 'rgba(6,214,160,0.25)'
                  : 'rgba(239,71,111,0.2)',
              }}
            >
              {/* Question header */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  minWidth: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: answer.isCorrect || isRectifiedCorrectly ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
                  border: `2px solid ${answer.isCorrect || isRectifiedCorrectly ? '#06d6a0' : '#ef476f'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>
                  {answer.isCorrect || isRectifiedCorrectly ? '✅' : '❌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q{globalIdx + 1}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {answer.questionId}
                    </span>
                    {isRectifiedCorrectly && <span className="badge-rectified">⭐ Rectified</span>}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {(() => {
                      // Fallback for older "two-part" questions that lack sub-texts in questionText
                      if (answer.questionType === 'two-part' && !answer.questionText.includes('PART A')) {
                        try {
                          const c = JSON.parse(answer.correctAnswer)
                          if (c.partA_text || c.partB_text) { // If I saved them there (hypothetically)
                             // Actually, let's just use what's in lib if we need it, 
                             // but better to just fix the display of what's there.
                          }
                        } catch(e) {}
                      }
                      return answer.questionText
                    })()}
                  </p>
                  {answer.diagramType === 'svg' && answer.diagramContent && (
                    <div 
                      className="diagram-container" 
                      style={{ 
                        marginTop: '16px', 
                        padding: '16px', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        overflowX: 'auto'
                      }}
                      dangerouslySetInnerHTML={{ __html: answer.diagramContent }} 
                    />
                  )}
                </div>
              </div>

              {/* Answer display */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: answer.isCorrect ? 0 : '16px' }}>
                {(answer.isCorrect || shownAnswers[answer.id]) && (
                  <div style={{
                    padding: '10px 16px', borderRadius: '10px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.3)', flex: 1, minWidth: '140px',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#06d6a0', marginBottom: '4px', textTransform: 'uppercase' }}>✅ Correct Answer</div>
                    <div style={{ fontWeight: 700, color: '#06d6a0', whiteSpace: 'pre-wrap' }}>
                      {(() => {
                        try {
                          if (answer.questionType === 'multiple-select') return JSON.parse(answer.correctAnswer).join(', ')
                          if (answer.questionType === 'two-part') {
                            const p = JSON.parse(answer.correctAnswer)
                            return `Part A: ${p.partA}\nPart B: ${p.partB}`
                          }
                        } catch (e) {}
                        return answer.correctAnswer
                      })()}
                    </div>
                  </div>
                )}

                {!answer.isCorrect && (
                  <div style={{
                    padding: '10px 16px', borderRadius: '10px', background: 'rgba(239,71,111,0.08)', border: '1px solid rgba(239,71,111,0.25)', flex: 1, minWidth: '140px',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef476f', marginBottom: '4px', textTransform: 'uppercase' }}>❌ Your Answer</div>
                    <div style={{ fontWeight: 700, color: '#ef476f', whiteSpace: 'pre-wrap' }}>
                      {(() => {
                        if (!answer.userAnswer) return 'No answer provided'
                        try {
                          if (answer.questionType === 'multiple-select') return JSON.parse(answer.userAnswer).join(', ')
                          if (answer.questionType === 'two-part') {
                            const p = JSON.parse(answer.userAnswer)
                            return `Part A: ${p.partA || '?'}\nPart B: ${p.partB || '?'}`
                          }
                        } catch (e) {}
                        return answer.userAnswer
                      })()}
                    </div>
                  </div>
                )}

                {isRectifiedCorrectly && answer.rectifiedAnswer && (
                  <div style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255,209,102,0.08)',
                    border: '1px solid rgba(255,209,102,0.25)',
                    flex: 1,
                    minWidth: '140px',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffd166', marginBottom: '4px', textTransform: 'uppercase' }}>🔄 Rectified Answer</div>
                    <div style={{ fontWeight: 700, color: '#ffd166' }}>{answer.rectifiedAnswer}</div>
                  </div>
                )}
              </div>

              {/* Sparky / Rectify section (only for wrong, non-rectified) */}
              {needsRectify && (
                <div>
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {!hint && !shownAnswers[answer.id] && (
                      <button
                        className="btn-secondary"
                        onClick={() => askSparky(answer, false)}
                        style={{ fontSize: '0.875rem', padding: '9px 18px' }}
                      >
                        🤖 Ask Sparky for a Hint
                      </button>
                    )}
                    
                    {!shownAnswers[answer.id] && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleShowAnswer(answer)}
                        style={{ fontSize: '0.875rem', padding: '9px 18px', background: 'rgba(255,255,255,0.05)' }}
                      >
                        👁️ Show me the answer
                      </button>
                    )}
                  </div>

                  {/* Hint display */}
                  {hint?.loading && (
                    <div style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', animation: 'spin-slow 1s linear infinite' }}>⚙️</span>
                      Sparky is thinking...
                    </div>
                  )}

                  {hint?.text && (
                    <div className="ai-hint-box" style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#9b5de5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🤖 Sparky says:
                        </div>
                        <button
                          onClick={() => speakText(hint.text!)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background 0.2s',
                          }}
                          className="hover-bg-subtle"
                          title="Read aloud"
                          aria-label="Read aloud"
                        >
                          🔊
                        </button>
                      </div>
                      <div 
                        style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem' }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(hint.text) }}
                      />
                      {!shownAnswers[answer.id] && (
                        <button
                          onClick={() => askSparky(answer, false, true)}
                          style={{
                            marginTop: '8px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontFamily: 'inherit',
                            fontWeight: 600
                          }}
                        >
                          🤔 Help me understand more...
                        </button>
                      )}
                    </div>
                  )}

                  {hint?.error && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(239,71,111,0.08)',
                      border: '1px solid rgba(239,71,111,0.25)',
                      borderRadius: '10px',
                      color: '#ef476f',
                      marginBottom: '12px',
                    }}>
                      ❌ {hint.error} 
                    </div> 
                  )} 

                  <div style={{ marginTop: '4px', opacity: shownAnswers[answer.id] ? 0.6 : 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {shownAnswers[answer.id] ? '💡 The answer is revealed above' : '💡 Try again:'}
                    </div>

                    {/* CHOICE UI (Buttons) */}
                    {(answer.questionType === 'single-choice' || answer.questionType === 'multiple-select') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(() => {
                          let opts: string[] = []
                          try {
                            if ((answer as any).optionsJson) opts = JSON.parse((answer as any).optionsJson)
                          } catch (e) {}

                          return opts.map((opt, i) => {
                            const isMS = answer.questionType === 'multiple-select'
                            let isSelected = false
                            if (isMS) {
                              try {
                                const parsed = r?.selected ? JSON.parse(r.selected) : []
                                isSelected = Array.isArray(parsed) && parsed.includes(opt)
                              } catch (e) { isSelected = r?.selected === opt }
                            } else {
                              isSelected = r?.selected === opt
                            }

                            // Check if this was the ORIGINAL incorrect answer
                            let isOriginalWrong = false
                            try {
                              if (isMS) {
                                const origParsed = JSON.parse(answer.userAnswer)
                                isOriginalWrong = Array.isArray(origParsed) && origParsed.includes(opt)
                              } else {
                                isOriginalWrong = answer.userAnswer === opt
                              }
                            } catch(e) {}

                            return (
                              <button
                                key={opt}
                                disabled={shownAnswers[answer.id]}
                                className={`option-btn${isSelected ? ' selected' : ''}`}
                                onClick={() => {
                                  if (isMS) {
                                    let current: string[] = []
                                    try {
                                      current = r?.selected ? JSON.parse(r.selected) : []
                                    } catch (e) {}
                                    const next = current.includes(opt)
                                      ? current.filter(x => x !== opt)
                                      : [...current, opt]
                                    handleRectifySelect(answer.id, JSON.stringify(next))
                                  } else {
                                    handleRectifySelect(answer.id, opt)
                                  }
                                }}
                                style={{ 
                                  textAlign: 'left', 
                                  padding: '12px 16px',
                                  border: isOriginalWrong ? '1px dashed #ef476f' : undefined,
                                  opacity: shownAnswers[answer.id] ? 0.7 : 1
                                }}
                              >
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%',
                                  background: isSelected ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)', marginRight: '10px', fontSize: '0.75rem', fontWeight: 900,
                                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)', flexShrink: 0
                                }}>
                                  {isMS ? (isSelected ? '✓' : '☐') : String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                                {isOriginalWrong && (
                                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, color: '#ef476f', textTransform: 'uppercase' }}>
                                    Your choice ❌
                                  </span>
                                )}
                              </button>
                            )
                          })
                        })()}
                        {!shownAnswers[answer.id] && (
                          <button
                            className="btn-primary"
                            onClick={() => submitRectify(answer)}
                            disabled={!r?.selected || r?.submitting}
                            style={{ padding: '12px', marginTop: '8px' }}
                          >
                            {r?.submitting ? '⏳ Submitting...' : '✅ Check My Answer'}
                          </button>
                        )}
                      </div>
                    ) : (
                      /* FREE RESPONSE / TWO-PART / REVEALED UI (Text Input) */
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                          type="text"
                          disabled={shownAnswers[answer.id]}
                          value={(() => {
                            if (shownAnswers[answer.id]) return '';
                            // Prettify multi-select JSON if it's currently stored as such (fallback)
                            if (answer.questionType === 'multiple-select') {
                              try {
                                const p = JSON.parse(r?.selected || '[]')
                                if (Array.isArray(p)) return p.join(', ')
                              } catch(e) {}
                            }
                            return r?.selected ?? ''
                          })()}
                          onChange={(e) => handleRectifySelect(answer.id, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') submitRectify(answer) }}
                          placeholder={shownAnswers[answer.id] ? "No more tries" : "Type your answer here..."}
                          style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: r?.result === 'correct'
                              ? '2px solid #06d6a0'
                              : r?.result === 'wrong'
                                ? '2px solid #ef476f'
                                : '2px solid rgba(79,142,247,0.3)',
                            background: 'rgba(22,33,62,0.5)',
                            color: 'var(--text-primary)',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
                          }}
                        />
                        {!shownAnswers[answer.id] && (
                          <button
                            className="btn-primary"
                            onClick={() => submitRectify(answer)}
                            disabled={!r?.selected || r?.submitting}
                            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                          >
                            {r?.submitting ? '⏳' : '✅ Submit'}
                          </button>
                        )}
                      </div>
                    )}

                    {r?.result === 'correct' && (
                      <div style={{ marginTop: '10px', color: '#06d6a0', fontWeight: 700, fontSize: '0.9rem' }}>
                        🎉 Correct! Great job! This question is now rectified.
                      </div>
                    )}
                    {r?.result === 'wrong' && (
                      <div style={{ marginTop: '10px', color: '#ef476f', fontWeight: 700, fontSize: '0.9rem' }}>
                        Not quite — try again! Review Sparky's hint above. 💪
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fully Rectified celebration */}
      {test.isFullyRectified && (
        <div className="glass-card animate-fadeIn" style={{
          marginTop: '32px',
          padding: '40px',
          textAlign: 'center',
          borderColor: 'rgba(6,214,160,0.4)',
          background: 'linear-gradient(135deg, rgba(6,214,160,0.06), rgba(79,142,247,0.06))',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>⭐🎉⭐</div>
          <h2 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px' }} className="gradient-text-teal">
            Fully Rectified!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem' }}>
            You corrected every single wrong answer. Amazing work — you&apos;re a math superstar! 🌟
          </p>
          <Link href="/test">
            <button className="btn-primary">🚀 Take Another Test</button>
          </Link>
        </div>
      )}
    </div>
  )
}
