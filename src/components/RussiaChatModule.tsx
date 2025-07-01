'use client'

import { useState } from 'react'

interface ChatResponse {
  response: string
  perspective: string
  success: boolean
}

export default function RussiaChatModule() {
  const [selectedPerspective, setSelectedPerspective] = useState('neorealism')
  const [message, setMessage] = useState('')
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const perspectives = [
    {
      value: 'neorealism',
      label: 'Neorealisme',
      description: 'Focus op macht, veiligheid en structurele dwang'
    },
    {
      value: 'neo-institutionalism',
      label: 'Neo-institutionalisme',
      description: 'Focus op instituties, samenwerking en wederzijdse afhankelijkheid'
    },
    {
      value: 'social-constructivism',
      label: 'Sociaal-constructivisme',
      description: 'Focus op identiteit, normen en ideeën'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Voer een vraag in')
      return
    }

    setIsLoading(true)
    setError(null)
    setChatResponse(null)

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
      setChatResponse(data)
    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden')
    } finally {
      setIsLoading(false)
    }
  }

  const getPerspectiveEmoji = (perspective: string) => {
    switch (perspective) {
      case 'neorealism': return '⚔️'
      case 'neo-institutionalism': return '🤝'
      case 'social-constructivism': return '🧠'
      default: return '💭'
    }
  }

  const getPerspectiveColor = (perspective: string) => {
    switch (perspective) {
      case 'neorealism': return 'text-red-600'
      case 'neo-institutionalism': return 'text-green-600'
      case 'social-constructivism': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <section className="ai-chat-module">
      <h3>
        <span className="chat-icon">🤖</span>
        Praat met de AI over Rusland
      </h3>
      <p>Stel vragen over Ruslands rol in de internationale betrekkingen en krijg antwoorden vanuit verschillende theoretische perspectieven.</p>

      <form onSubmit={handleSubmit}>
        <div className="perspective-selector">
          <label htmlFor="perspective-select">
            Kies een theoretisch perspectief:
          </label>
          <select
            id="perspective-select"
            value={selectedPerspective}
            onChange={(e) => setSelectedPerspective(e.target.value)}
          >
            {perspectives.map((perspective) => (
              <option key={perspective.value} value={perspective.value}>
                {perspective.label} - {perspective.description}
              </option>
            ))}
          </select>
        </div>

        <div className="chat-input-area">
          <label htmlFor="message-input">
            Jouw vraag:
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bijvoorbeeld: Waarom viel Rusland Georgië aan in 2008? Of: Hoe verklaart dit perspectief de annexatie van de Krim?"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? 'AI denkt na...' : 'Verstuur vraag'}
        </button>
      </form>

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>De AI analyseert je vraag vanuit het {perspectives.find(p => p.value === selectedPerspective)?.label.toLowerCase()} perspectief...</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Fout:</strong> {error}
        </div>
      )}

      {chatResponse && (
        <div className="ai-response">
          <h4>
            <span className={getPerspectiveColor(chatResponse.perspective)}>
              {getPerspectiveEmoji(chatResponse.perspective)} {perspectives.find(p => p.value === chatResponse.perspective)?.label} Perspectief
            </span>
          </h4>
          <div className="response-content">
            {chatResponse.response}
          </div>
        </div>
      )}
    </section>
  )
}