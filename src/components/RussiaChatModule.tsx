'use client'

import { useState } from 'react'

interface ChatResponse {
  response: string
  perspective: string
  success: boolean
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  perspective?: string
  timestamp: Date
}

export default function RussiaChatModule() {
  const [selectedPerspective, setSelectedPerspective] = useState('neorealism')
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const perspectives = [
    {
      value: 'neorealism',
      label: 'Neorealisme',
      description: 'Focus op macht, veiligheid en structurele dwang',
      emoji: '⚔️',
      color: 'text-red-600'
    },
    {
      value: 'neo-institutionalism',
      label: 'Neo-institutionalisme', 
      description: 'Focus op instituties, samenwerking en wederzijdse afhankelijkheid',
      emoji: '🤝',
      color: 'text-green-600'
    },
    {
      value: 'social-constructivism',
      label: 'Sociaal-constructivisme',
      description: 'Focus op identiteit, normen en ideeën',
      emoji: '🧠',
      color: 'text-blue-600'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Voer een vraag in')
      return
    }

    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setChatHistory(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/russia-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          perspective: selectedPerspective
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await response.json()
      
      // Add AI response to chat history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        perspective: data.perspective,
        timestamp: new Date()
      }

      setChatHistory(prev => [...prev, aiMessage])
      setMessage('') // Clear input after successful send
    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden')
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setChatHistory([])
    setError(null)
  }

  const getPerspectiveInfo = (perspectiveValue: string) => {
    return perspectives.find(p => p.value === perspectiveValue) || perspectives[0]
  }

  const exampleQuestions = [
    "Waarom viel Rusland Georgië aan in 2008?",
    "Hoe verklaart dit perspectief de annexatie van de Krim?", 
    "Waarom werkte samenwerking tussen Rusland en het Westen niet?",
    "Wat is de rol van Poetins identiteit in het buitenlandbeleid?",
    "Hoe belangrijk zijn economische sancties tegen Rusland?"
  ]

  return (
    <section className="ai-chat-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>
          <span className="chat-icon">🤖</span>
          Denk mee met de AI
        </h3>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearChat}
            style={{
              background: 'var(--border-color)',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.9em',
              cursor: 'pointer',
              color: 'var(--text-color)'
            }}
          >
            🗑️ Wis gesprek
          </button>
        )}
      </div>
      
      <p>De AI stelt je vragen om je te helpen denken vanuit verschillende theoretische perspectieven. Geen kant-en-klare antwoorden, maar uitdagende vragen!</p>

      <form onSubmit={handleSubmit}>
        <div className="perspective-selector">
          <label htmlFor="perspective-select">
            Vanuit welk perspectief wil je nadenken?
          </label>
          <select
            id="perspective-select"
            value={selectedPerspective}
            onChange={(e) => setSelectedPerspective(e.target.value)}
          >
            {perspectives.map((perspective) => (
              <option key={perspective.value} value={perspective.value}>
                {perspective.emoji} {perspective.label} - {perspective.description}
              </option>
            ))}
          </select>
        </div>

        <div className="chat-input-area">
          <label htmlFor="message-input">
            Jouw vraag of gedachte:
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bijvoorbeeld: Waarom viel Rusland Georgië aan in 2008?"
            disabled={isLoading}
            rows={3}
          />
          
          {/* Example questions */}
          {chatHistory.length === 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '0.9em', color: 'var(--text-color)', marginBottom: '8px' }}>
                💡 Voorbeeldvragen:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMessage(question)}
                    style={{
                      background: 'var(--code-bg)',
                      border: '1px solid var(--border-color)',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8em',
                      cursor: 'pointer',
                      color: 'var(--text-color)'
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? 'AI denkt na...' : 'Stel vraag'}
        </button>
      </form>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--header-color)' }}>
            💬 Gesprek
          </h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '15px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: msg.type === 'user' ? 'var(--code-bg)' : 'var(--container-bg)',
                  border: msg.type === 'ai' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                <div style={{ 
                  fontSize: '0.85em', 
                  color: 'var(--accent-color)', 
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  {msg.type === 'user' ? (
                    `👤 Jij (${getPerspectiveInfo(selectedPerspective).emoji} ${getPerspectiveInfo(selectedPerspective).label})`
                  ) : (
                    `🤖 AI Leraar (${getPerspectiveInfo(msg.perspective || '').emoji} ${getPerspectiveInfo(msg.perspective || '').label})`
                  )}
                </div>
                <div style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>De AI denkt na over je vraag vanuit het {getPerspectiveInfo(selectedPerspective).label.toLowerCase()} perspectief...</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Fout:</strong> {error}
        </div>
      )}
    </section>
  )
}