'use client'
// app/page.tsx — Hero landing page

import Link from 'next/link'
import { useState, useEffect } from 'react'

const STANDARDS = [
  { icon: '🔢', label: 'Number Sense', color: '#4f8ef7' },
  { icon: '½', label: 'Fractions', color: '#9b5de5' },
  { icon: '📐', label: 'Geometry', color: '#00b4d8' },
  { icon: '📏', label: 'Measurement', color: '#06d6a0' },
  { icon: '📊', label: 'Data & Stats', color: '#ffd166' },
  { icon: '🔣', label: 'Algebra', color: '#ef476f' },
]

export default function HomePage() {
  const [pastTestCount, setPastTestCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/tests')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPastTestCount(data.length)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Hero */}
      <div className="animate-fadeIn" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(79,142,247,0.1)',
          border: '1px solid rgba(79,142,247,0.25)',
          borderRadius: '999px',
          padding: '6px 18px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#4f8ef7',
          letterSpacing: '0.05em',
        }}>
          ⭐ Florida B.E.S.T. Standards Aligned
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '20px',
        }}>
          <span className="gradient-text">Master Florida FAST</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>5th Grade Math</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Practice with randomized 40-question tests, get instant grades, and learn from your mistakes with <strong style={{ color: '#9b5de5' }}>Sparky</strong>, your personal AI math tutor! 🤖✨
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/test">
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              🚀 Start New Test
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
              📊 View Dashboard
              {pastTestCount !== null && pastTestCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  background: 'var(--accent-blue)',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                }}>
                  {pastTestCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '48px',
      }}>
        {[
          { number: '65+', label: 'Practice Questions', icon: '📝' },
          { number: '40', label: 'Questions Per Test', icon: '🎯' },
          { number: '6', label: 'Math Standards', icon: '📚' },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: 'var(--accent-blue)',
            }}>{s.number}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Standards covered */}
      <div className="glass-card animate-fadeIn" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '20px' }}>
          📚 Topics Covered
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}>
          {STANDARDS.map((s) => (
            <div key={s.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${s.color}33`,
              fontWeight: 700,
              fontSize: '0.9rem',
            }}>
              <span style={{
                fontSize: '1.4rem',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${s.color}22`,
                borderRadius: '8px',
              }}>{s.icon}</span>
              <span style={{ color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card animate-fadeIn" style={{ padding: '32px' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '20px' }}>
          ⚡ How It Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { step: '1', title: 'Take a Practice Test', desc: '40 random questions from 65+ aligned to Florida B.E.S.T. standards.', color: '#4f8ef7' },
            { step: '2', title: 'Get Instant Results', desc: 'See your score immediately. Every test is saved to your history.', color: '#9b5de5' },
            { step: '3', title: 'Review Mistakes', desc: 'On the dashboard, open any test to see which questions you got wrong.', color: '#00b4d8' },
            { step: '4', title: 'Ask Sparky for Help', desc: 'Click "Rectify" for AI-powered hints explaining your mistake — no direct answers!', color: '#06d6a0' },
            { step: '5', title: 'Resubmit & Master It', desc: 'Re-answer wrong questions until you reach 100%. The ⭐ Fully Rectified badge unlocks!', color: '#ffd166' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                minWidth: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `${item.color}22`,
                border: `2px solid ${item.color}`,
                color: item.color,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}>{item.step}</div>
              <div>
                <div style={{ fontWeight: 700, color: item.color }}>{item.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
