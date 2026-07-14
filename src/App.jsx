import { useMemo, useState } from 'react'
import { encode, decode } from './base62'
import './App.css'

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function App() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const { result, error } = useMemo(() => {
    if (!input) return { result: '', error: null }
    try {
      const result = mode === 'encode' ? encode(input) : decode(input)
      return { result, error: null }
    } catch (err) {
      return { result: '', error: err.message }
    }
  }, [input, mode])

  function switchMode(next) {
    setMode(next)
    setInput(result || '')
    setCopied(false)
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Base62 Converter</h1>

        <div className="tabs">
          <button
            type="button"
            className={mode === 'encode' ? 'tab active' : 'tab'}
            onClick={() => switchMode('encode')}
          >
            Encode
          </button>
          <button
            type="button"
            className={mode === 'decode' ? 'tab active' : 'tab'}
            onClick={() => switchMode('decode')}
          >
            Decode
          </button>
        </div>

        <label className="field-label" htmlFor="input">
          {mode === 'encode' ? 'Text' : 'Base62 string'}
        </label>
        <textarea
          id="input"
          className="input"
          placeholder={mode === 'encode' ? 'Type text to encode…' : 'Paste a base62 string to decode…'}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setCopied(false)
          }}
          rows={4}
        />

        <label className="field-label" htmlFor="output">
          {mode === 'encode' ? 'Encoded' : 'Decoded'}
        </label>
        <div className="output-wrap">
          <textarea
            id="output"
            className="output"
            readOnly
            value={error ? '' : result}
            placeholder="Result will appear here"
            rows={4}
          />
          <button
            type="button"
            className={copied ? 'copy-btn copied' : 'copy-btn'}
            onClick={handleCopy}
            disabled={!result}
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}

export default App
