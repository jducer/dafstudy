'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
    console.error('[404 Diagnostic] Page Not Found:', window.location.href)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🧙‍♂️</div>
      <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '16px' }}>Sparky can't find that page!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        The path <code>{url || '...'}</code> doesn't seem to exist. 
        If you're on Mobile Safari, try returning to the home page!
      </p>
      
      <Link href="/">
        <button className="btn-primary" style={{ padding: '12px 32px' }}>
          🏠 Back to Home
        </button>
      </Link>
    </div>
  )
}
