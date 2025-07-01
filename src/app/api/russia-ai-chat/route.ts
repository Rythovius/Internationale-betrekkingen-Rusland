import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { 
          error: 'API configuratie ontbreekt. Check Environment Variables.',
          hint: 'Voeg GEMINI_API_KEY toe aan je environment variables'
        }, 
        { status: 500 }
      )
    }

    // Parse request data
    const body = await request.json()
    const { message, perspective } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Bericht is vereist' },
        { status: 400 }
      )
    }

    if (!perspective) {
      return NextResponse.json(
        { error: 'Perspectief is vereist' },
        { status: 400 }
      )
    }

    // Input validation
    if (typeof message !== 'string' || message.length > 10000) {
      return NextResponse.json(
        { error: 'Bericht moet een string zijn van maximaal 10.000 karakters' },
        { status: 400 }
      )
    }

    // Define perspective-specific instructions
    const perspectiveInstructions = {
      neorealism: `Je bent een expert in het neorealisme in de internationale betrekkingen. Beantwoord de vraag vanuit een strikt neorealistisch perspectief. Focus op:
- Machtspolitiek en veiligheidsdilemma's
- Anarchie in het internationale systeem
- Balancing en bandwagoning gedrag
- Relatieve winst vs absolute winst
- Structurele dwang van het internationale systeem
- Rationele keuzes gebaseerd op machtsverhoudingen

Gebruik concrete voorbeelden uit de Russische buitenlandpolitiek sinds 2008. Blijf binnen het neorealistische paradigma en vermijd verklaringen die gebaseerd zijn op normen, identiteit of institutionele factoren.`,

      'neo-institutionalism': `Je bent een expert in het neo-institutioneel liberalisme in de internationale betrekkingen. Beantwoord de vraag vanuit een neo-institutionalistisch perspectief. Focus op:
- De rol van internationale instituties en regimes
- Wederzijdse afhankelijkheid en absolute winst
- Samenwerking onder anarchie
- Het belang van reputatie en herhaalde interacties
- Institutioneel falen en succes
- Transactiekosten en informatieproblemen

Gebruik concrete voorbeelden uit de Russische betrokkenheid bij internationale instituties sinds 2008. Blijf binnen het neo-institutionalistische paradigma en leg uit hoe institutionele factoren het gedrag van Rusland hebben beïnvloed.`,

      'social-constructivism': `Je bent een expert in het sociaal-constructivisme in de internationale betrekkingen. Beantwoord de vraag vanuit een constructivistisch perspectief. Focus op:
- Identiteit en nationale zelfbeelden
- Normen en hun evolutie
- De sociale constructie van belangen
- Discours en narratieven
- De rol van ideeën en cultuur
- Intersubjectieve betekenissen
- De "Russische Wereld" (Russkiy Mir) concept

Gebruik concrete voorbeelden van hoe Russische identiteit en normen het buitenlandbeleid hebben gevormd sinds 2008. Blijf binnen het constructivistische paradigma en vermijd puur materialistische verklaringen.`
    }

    const instruction = perspectiveInstructions[perspective as keyof typeof perspectiveInstructions]
    
    if (!instruction) {
      return NextResponse.json(
        { error: 'Ongeldig perspectief geselecteerd' },
        { status: 400 }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Create the full prompt
    const fullPrompt = `${instruction}

Vraag van de student: ${message}

Geef een uitgebreid, academisch antwoord in het Nederlands dat geschikt is voor VWO-niveau. Gebruik concrete voorbeelden en leg complexe concepten helder uit. Zorg ervoor dat je antwoord volledig binnen het gevraagde theoretische perspectief blijft.`

    // Generate response
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ 
      response: text,
      perspective: perspective,
      success: true
    })

  } catch (error) {
    console.error('Russia AI Chat API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het verwerken van je vraag',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}