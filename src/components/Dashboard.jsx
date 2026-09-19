import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useRealtimeClipboard, uploadClipboard, clearClipboard } from '../hooks/useClipboard'
import LogoutButton from './LogoutButton'

function isUrl(text) {
  const trimmed = text.trim()
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(url.hostname)
  } catch {
    return false
  }
}

export default function Dashboard({ user }) {
  const { clipboard, loading } = useRealtimeClipboard(user.uid)
  const [status, setStatus] = useState('')
  const [clearing, setClearing] = useState(false)

  const handleInput = async () => {
    try {
      const text = await navigator.clipboard.readText()
      await uploadClipboard(user.uid, text)
      setStatus('Clipboard uploaded!')
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus('Failed to read clipboard. Check permissions.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clipboard)
      setStatus('Copied to clipboard!')
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus('Failed to copy.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      await clearClipboard(user.uid)
      setStatus('Clipboard cleared!')
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus('Failed to clear.')
      setTimeout(() => setStatus(''), 3000)
    }
    setClearing(false)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="user-name">{user.displayName}</span>
        <div className="header-buttons">
          <button className="switch-user-btn" onClick={() => {
            sessionStorage.setItem('switchUser', '1')
            signOut(auth)
          }}>Switch User</button>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-main">
        <div className="buttons-row">
          <button className="action-btn copy-btn" onClick={handleCopy} disabled={!clipboard}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button className="action-btn input-btn" onClick={handleInput}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Input
          </button>
        </div>

        <button className="clear-btn" onClick={handleClear} disabled={!clipboard || clearing}>
          {clearing ? 'Clearing...' : 'Clear'}
        </button>

        {status && <p className="status-msg">{status}</p>}

        {!loading && clipboard && (
          <div className="clipboard-display">
            {isUrl(clipboard) ? (
              <div className="clipboard-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="link-icon">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <a href={clipboard.trim()} target="_blank" rel="noopener noreferrer" className="link-url">{clipboard.trim()}</a>
              </div>
            ) : (
              <pre>{clipboard}</pre>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
