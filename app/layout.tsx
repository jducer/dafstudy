// app/layout.tsx
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sparky Study – Florida FAST Math Practice',
  description:
    'Interactive Florida FAST 5th-grade math practice tests with AI-powered tutoring. Take randomized 10-question tests, review mistakes, and get personalized hints from Sparky the AI tutor.',
  keywords: ['Florida FAST', '5th grade math', 'practice test', 'BEST standards', 'math tutor'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(15,15,26,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(79,142,247,0.15)',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.6rem' }}>🧮</span>
            <span style={{
              fontWeight: 900,
              fontSize: '1.25rem',
              background: 'linear-gradient(135deg, #4f8ef7, #9b5de5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Sparky Study</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'rgba(79,142,247,0.15)',
              color: '#4f8ef7',
              border: '1px solid rgba(79,142,247,0.3)',
              borderRadius: '999px',
              padding: '2px 8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>Florida FAST</span>
          </Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/test" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                📝 New Test
              </button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                📊 Dashboard
              </button>
            </Link>
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
