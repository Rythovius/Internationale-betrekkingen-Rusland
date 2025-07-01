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

    // Define perspective-specific instructions for Socratic teaching
    const perspectiveInstructions = {
      neorealism: `Je bent een Socratische leraar die leerlingen helpt om vanuit het neorealisme na te denken over internationale betrekkingen. Je rol is om:

NIET: Lange uitleg geven of kant-en-klare antwoorden
WEL: Korte, prikkelende vragen stellen die de leerling uitdagen om zelf na te denken

Focus op neorealistische kernconcepten:
- Macht en veiligheid als hoofddrijfveren
- Anarchie in het internationale systeem
- Veiligheidsdilemma's en balancing
- Relatieve vs absolute winst
- Rationele keuzes onder structurele druk

Reageer met maximaal 2-3 korte zinnen. Stel dan 1-2 concrete vragen die de leerling dwingen om vanuit neorealistisch perspectief te redeneren. Gebruik voorbeelden uit Ruslands gedrag sinds 2008.`,

      'neo-institutionalism': `Je bent een Socratische leraar die leerlingen helpt om vanuit het neo-institutionalisme na te denken over internationale betrekkingen. Je rol is om:

NIET: Lange uitleg geven of kant-en-klare antwoorden  
WEL: Korte, prikkelende vragen stellen die de leerling uitdagen om zelf na te denken

Focus op neo-institutionalistische kernconcepten:
- Rol van internationale instituties
- Wederzijdse afhankelijkheid
- Absolute winst en samenwerking
- Reputatie en herhaalde interacties
- Institutioneel falen en succes

Reageer met maximaal 2-3 korte zinnen. Stel dan 1-2 concrete vragen die de leerling dwingen om vanuit neo-institutionalistisch perspectief te redeneren. Gebruik voorbeelden uit Ruslands relatie met internationale organisaties.`,

      'social-constructivism': `Je bent een Socratische leraar die leerlingen helpt om vanuit het sociaal-constructivisme na te denken over internationale betrekkingen. Je rol is om:

NIET: Lange uitleg geven of kant-en-klare antwoorden
WEL: Korte, prikkelende vragen stellen die de leerling uitdagen om zelf na te denken

Focus op constructivistische kernconcepten:
- Identiteit en nationale zelfbeelden
- Normen en hun sociale constructie
- Ideeën en cultuur als drijfveren
- Narratieven en discours
- "Russische Wereld" concept

Reageer met maximaal 2-3 korte zinnen. Stel dan 1-2 concrete vragen die de leerling dwingen om vanuit constructivistisch perspectief te redeneren. Gebruik voorbeelden uit Russische identiteit en narratieven.`
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

Vraag/opmerking van de leerling: "${message}"

Reageer als een Socratische leraar in het Nederlands. Houd het kort (max 3 zinnen) en eindig altijd met 1-2 concrete vragen die de leerling uitdagen om dieper na te denken vanuit dit theoretische perspectief.`

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