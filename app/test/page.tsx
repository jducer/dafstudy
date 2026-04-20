'use client'
// app/test/page.tsx — Take the 40-question randomized test

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRandomQuestions, Question } from '@/lib/questions'

type Answers = Record<string, string> // questionId -> selectedOption

export default function TestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const [currentPage, setCurrentPage] = useState(0) // current "page" of 5 questions
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testStarted, setTestStarted] = useState(false)
  const [testMode, setTestMode] = useState<'static' | 'dynamic' | null>(null)
  const [generating, setGenerating] = useState(false)
  const [hasSavedTest, setHasSavedTest] = useState(false)

  const SESSION_KEY = 'dafstudy_in_progress_test'

  const QUESTIONS_PER_PAGE = 5
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  const answeredCount = Object.keys(answers).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length



  const startDynamicTest = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/questions/generate', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setQuestions(data)
      setAnswers({})
      setCurrentPage(0)
      setTestStarted(true)
      setTestMode('dynamic')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
    } finally {
      setGenerating(false)
    }
  }

  // Check for a saved in-progress test on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) setHasSavedTest(true)
    } catch {}
  }, [])

  // Auto-save progress whenever answers change
  useEffect(() => {
    if (!testStarted || questions.length === 0) return
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ questions, answers, currentPage, testMode }))
    } catch {}
  }, [answers, currentPage, testStarted, questions, testMode])

  const resumeSavedTest = () => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (!saved) return
      const { questions: qs, answers: ans, currentPage: pg, testMode: mode } = JSON.parse(saved)
      setQuestions(qs)
      setAnswers(ans)
      setCurrentPage(pg)
      setTestMode(mode)
      setTestStarted(true)
      setHasSavedTest(false)
    } catch {}
  }

  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  )

  const handleSelect = (questionId: string, option: string | string[] | Record<string, string>) => {
    // If it's an object or array, store it as JSON string. Otherwise just store the string.
    const valueStr = typeof option === 'string' ? option : JSON.stringify(option)
    setAnswers((prev) => ({ ...prev, [questionId]: valueStr }))
  }

  const handleFillSampleAnswers = () => {
    const fresh: Record<string, string> = {}
    questions.forEach((q) => {
      if (q.type === 'multiple-select') {
        const ca = q.correctAnswers || []
        const first = Array.isArray(ca) ? ca[0] : ca
        fresh[q.id] = JSON.stringify([first || ''])
      } else if (q.type === 'two-part') {
        const payload = JSON.stringify({ 
          partA: q.partA.options[0] || '', 
          partB: q.partB.options[0] || '' 
        })
        fresh[q.id] = payload
      } else if (q.type === 'free-response') {
        fresh[q.id] = String(q.correctAnswer ?? '123')
      } else if (!q.type || q.type === 'single-choice') {
        fresh[q.id] = q.options[0] || q.correctAnswer || 'A'
      }
    })
    setAnswers(fresh)
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = questions.map((q) => {
        let correctValueStr = ''
        if (q.type === 'multiple-select') {
          correctValueStr = JSON.stringify(q.correctAnswers)
        } else if (q.type === 'two-part') {
          correctValueStr = JSON.stringify({ 
            partA: q.partA.correctAnswer || '', 
            partB: q.partB.correctAnswer || '' 
          })
        } else if (q.type === 'free-response' || q.type === 'single-choice' || !q.type) {
          correctValueStr = String(q.correctAnswer ?? '')
        }

        let questionText = q.text
        if (q.type === 'two-part') {
          questionText = `${q.text}\nPART A: ${q.partA.text}\nPART B: ${q.partB.text}`
        }

        return {
          questionId: q.id,
          questionText,
          correctAnswer: correctValueStr,
          userAnswer: answers[q.id] ?? '',
          options: (q.type === 'single-choice' || q.type === 'multiple-select' || !q.type) ? q.options : undefined,
          diagramType: q.diagram?.type,
          diagramContent: q.diagram?.content,
          questionType: q.type || 'single-choice',
        }
      })

      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.details || 'Submission failed')
      }
      sessionStorage.removeItem(SESSION_KEY)
      router.push(`/review/${data.id}`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
      setError(msg)
      setSubmitting(false)
    }
  }

  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  if (!testStarted && !generating) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🏁</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '24px' }}>Ready to Start?</h2>

        {hasSavedTest && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,209,102,0.15), rgba(255,209,102,0.05))',
            border: '1px solid rgba(255,209,102,0.4)',
            borderRadius: '16px',
            padding: '20px 28px',
            marginBottom: '24px',
            maxWidth: '420px',
            margin: '0 auto 24px',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏸️</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffd166', marginBottom: '6px' }}>You have an unfinished test!</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>Pick up right where you left off.</div>
            <button className="btn-primary" onClick={resumeSavedTest} style={{ padding: '12px 28px', fontSize: '1rem', background: 'linear-gradient(135deg, #ffd166, #f9a825)' }}>
              ▶️ Resume My Test
            </button>
          </div>
        )}

        <button className="btn-primary" onClick={startDynamicTest} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          🚀 Start Your AI Math Challenge
        </button>
        {error && <div style={{ color: '#ef476f', marginTop: '16px', fontSize: '0.9rem' }}>❌ {error}</div>}
      </div>
    )
  }

  if (generating) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px', animation: 'bounce 2s infinite' }}>🤖</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px' }}>Sparky is crafting your test...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This takes about 30 seconds. Get ready!</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeIn" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '4px' }}>
              {testMode === 'dynamic' ? '✨ AI Challenge' : '📝 Practice Test'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Florida B.E.S.T. 5th Grade · {questions.length} Questions
            </p>
          </div>
          <div style={{
            background: 'rgba(79,142,247,0.1)',
            border: '1px solid rgba(79,142,247,0.25)',
            borderRadius: '12px',
            padding: '12px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button 
              onClick={handleFillSampleAnswers} 
              className="option-btn"
              style={{ 
                fontSize: '0.8rem', 
                padding: '6px 12px',
                background: 'rgba(79,142,247,0.15)',
                border: '1px solid var(--accent-blue)',
                color: 'var(--accent-blue)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              DEBUG: Fill Sample Answers
            </button>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-blue)' }}>
              {answeredCount} / {questions.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>answered</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <span>{Math.round(progressPercent)}% complete</span>
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {currentQuestions.map((q, idx) => {
          const globalIdx = currentPage * QUESTIONS_PER_PAGE + idx
          const selected = answers[q.id]
          return (
            <div key={q.id} className="glass-card animate-fadeIn" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  minWidth: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: selected ? 'linear-gradient(135deg, #4f8ef7, #9b5de5)' : 'rgba(79,142,247,0.12)',
                  border: `2px solid ${selected ? 'transparent' : 'rgba(79,142,247,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  color: selected ? 'white' : 'var(--accent-blue)',
                  transition: 'all 0.2s ease',
                }}>
                  {globalIdx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {q.standard}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {q.text}
                  </p>
                  {q.diagram && (
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
                      dangerouslySetInnerHTML={{ __html: q.diagram.content }} 
                    />
                  )}
                </div>
              </div>

              {(!q.type || q.type === 'single-choice') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt: string, i: number) => (
                    <button
                      key={opt}
                      className={`option-btn${selected === opt ? ' selected' : ''}`}
                      onClick={() => handleSelect(q.id, opt)}
                    >
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%',
                        background: selected === opt ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)', marginRight: '10px', fontSize: '0.75rem', fontWeight: 900,
                        color: selected === opt ? 'var(--accent-blue)' : 'var(--text-secondary)', flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'multiple-select' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt: string) => {
                    const parsedSelection: string[] = answers[q.id] ? JSON.parse(answers[q.id]) : []
                    const isSelected = parsedSelection.includes(opt)
                    return (
                      <button
                        key={opt}
                        className={`option-btn${isSelected ? ' selected' : ''}`}
                        onClick={() => {
                          const newSelection = isSelected 
                            ? parsedSelection.filter(x => x !== opt) 
                            : [...parsedSelection, opt]
                          handleSelect(q.id, newSelection)
                        }}
                      >
                        <input type="checkbox" checked={isSelected} readOnly style={{ marginRight: '10px', accentColor: 'var(--accent-blue)' }} />
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'free-response' && (
                <div style={{ marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Type your answer here..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                    style={{
                      width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 'bold'
                    }}
                  />
                </div>
              )}

              {q.type === 'two-part' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {['partA', 'partB'].map((partKey) => {
                    const part = q[partKey as 'partA' | 'partB']
                    const currentAnswers = answers[q.id] ? JSON.parse(answers[q.id]) : {}
                    const selectedForPart = currentAnswers[partKey]
                    return (
                      <div key={partKey} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '0.95rem' }}>{part.text}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {part.options.map((opt, i) => (
                            <button
                              key={opt}
                              className={`option-btn${selectedForPart === opt ? ' selected' : ''}`}
                              onClick={() => {
                                handleSelect(q.id, { ...currentAnswers, [partKey]: opt })
                              }}
                            >
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%',
                                background: selectedForPart === opt ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)', marginRight: '10px', fontSize: '0.75rem', fontWeight: 900,
                                color: selectedForPart === opt ? 'var(--accent-blue)' : 'var(--text-secondary)'
                              }}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn-secondary"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{ opacity: currentPage === 0 ? 0.4 : 1 }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageAnswered = questions
              .slice(i * QUESTIONS_PER_PAGE, (i + 1) * QUESTIONS_PER_PAGE)
              .every((q) => answers[q.id])
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: `2px solid ${i === currentPage ? 'var(--accent-blue)' : pageAnswered ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}`,
                  background: i === currentPage
                    ? 'rgba(79,142,247,0.2)'
                    : pageAnswered
                      ? 'rgba(6,214,160,0.1)'
                      : 'transparent',
                  color: i === currentPage
                    ? 'var(--accent-blue)'
                    : pageAnswered
                      ? 'var(--accent-green)'
                      : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {i + 1}
              </button>
            )
          })}
        </div>

        {currentPage < totalPages - 1 ? (
          <button
            className="btn-primary"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            style={{
              background: allAnswered
                ? 'linear-gradient(135deg, #06d6a0, #4f8ef7)'
                : undefined,
              opacity: !allAnswered ? 0.5 : 1,
            }}
          >
            {submitting ? '⏳ Grading...' : allAnswered ? '✅ Submit Test' : `Answer all questions first (${questions.length - answeredCount} left)`}
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '14px',
          background: 'rgba(239,71,111,0.1)',
          border: '1px solid rgba(239,71,111,0.3)',
          borderRadius: '10px',
          color: 'var(--accent-red)',
          textAlign: 'center',
          fontWeight: 600,
        }}>
          ❌ {error}
        </div>
      )}

      {/* Unanswered warning */}
      {!allAnswered && currentPage === totalPages - 1 && answeredCount > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255,209,102,0.08)',
          border: '1px solid rgba(255,209,102,0.25)',
          borderRadius: '10px',
          color: '#ffd166',
          fontSize: '0.875rem',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ⚠️ You have {questions.length - answeredCount} unanswered question{questions.length - answeredCount !== 1 ? 's' : ''}. Use the page buttons above to find them.
        </div>
      )}
    </div>
  )
}
