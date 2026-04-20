'use client'
// app/dashboard/page.tsx — Past tests dashboard

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TestSummary {
  id: number
  createdAt: string
  totalQuestions: number
  originalScore: number
  currentScore: number
  isFullyRectified: boolean
  answers: { 
    id: number; 
    isCorrect: boolean; 
    isRectified: boolean; 
    solutionRevealed: boolean 
  }[]
}

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? '#06d6a0' : pct >= 60 ? '#4f8ef7' : '#ef476f'
  const cls = pct >= 80 ? 'excellent' : pct >= 60 ? 'good' : 'needs-work'
  return (
    <div className={`score-badge ${cls}`}>
      {pct}%
    </div>
  )
}

export default function DashboardPage() {
  const [tests, setTests] = useState<TestSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTests = () => {
    fetch('/api/tests')
      .then((r) => r.json())
      .then((data) => {
        setTests(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this test?')) return

    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTests((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const avgScore =
    tests.length > 0
      ? Math.round(
          tests.reduce((sum, t) => sum + (t.originalScore / t.totalQuestions) * 100, 0) /
            tests.length
        )
      : null
  const bestScore =
    tests.length > 0
      ? Math.max(...tests.map((t) => Math.round((t.originalScore / t.totalQuestions) * 100)))
      : null
  const rectifiedCount = tests.filter((t) => t.isFullyRectified).length

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '4px' }}>
              📊 <span className="gradient-text">Dafne's Learning Portal</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your progress and review past tests</p>
          </div>
          <Link href="/test">
            <button className="btn-primary">🚀 New Test</button>
          </Link>
        </div>

        {/* Stats */}
        {tests.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Tests Taken', value: tests.length, icon: '📝', color: '#4f8ef7' },
              { label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: '📈', color: '#9b5de5' },
              { label: 'Best Score', value: bestScore !== null ? `${bestScore}%` : '—', icon: '🏆', color: '#ffd166' },
              { label: 'Fully Rectified', value: rectifiedCount, icon: '⭐', color: '#06d6a0' },
            ].map((s) => (
              <div key={s.label} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${s.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tests List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Loading your tests...
          </div>
        ) : tests.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎯</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>No tests yet!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Take your first practice test to get started.</p>
            <Link href="/test">
              <button className="btn-primary">🚀 Take Your First Test</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tests.map((test) => {
              const pct = Math.round((test.originalScore / test.totalQuestions) * 100)
              const currentPct = Math.round((test.currentScore / test.totalQuestions) * 100)
              const rectifiedAnswers = test.answers.filter((a) => a.isRectified && !a.isCorrect).length
              const revealedCount = test.answers.filter((a) => a.solutionRevealed && !a.isRectified && !a.isCorrect).length
              const dateStr = new Date(test.createdAt).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })
              const timeStr = new Date(test.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit',
              })

              return (
                <div key={test.id} className="glass-card animate-slideIn" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <ScoreRing score={test.originalScore} total={test.totalQuestions} />

                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                          Test #{test.id}
                        </span>
                        {test.isFullyRectified && (
                          <span className="badge-rectified">⭐ Fully Rectified</span>
                        )}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {dateStr} · {timeStr}
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '0.85rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--accent-green)' }}>✅ {test.originalScore} Correct</span>
                        {rectifiedAnswers > 0 && (
                          <span style={{ color: '#ffd166' }}>🔄 {rectifiedAnswers} Fixed</span>
                        )}
                        {revealedCount > 0 && (
                          <span style={{ color: 'var(--text-secondary)' }}>💡 {revealedCount} Solutions Read</span>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {currentPct > pct && (
                        <div style={{ fontSize: '0.78rem', color: '#06d6a0', fontWeight: 700, marginBottom: '6px' }}>
                          ↑ Now {currentPct}% after rectification
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={(e) => handleDelete(e, test.id)}
                          className="btn-secondary" 
                          style={{ padding: '8px 12px', fontSize: '0.875rem', color: 'var(--accent-red)', borderColor: 'rgba(239,71,111,0.2)' }}
                          title="Delete test"
                        >
                          🗑️
                        </button>
                        <Link href={`/review/${test.id}`}>
                          <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                            🔍 Review
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div style={{ marginTop: '14px' }}>
                    <div className="progress-bar-track" style={{ height: '5px' }}>
                      <div className="progress-bar-fill" style={{
                        width: `${pct}%`,
                        background: pct >= 80 ? 'linear-gradient(90deg, #06d6a0, #4f8ef7)' : pct >= 60 ? 'linear-gradient(90deg, #4f8ef7, #9b5de5)' : 'linear-gradient(90deg, #ef476f, #ffd166)',
                      }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
