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

    // Define perspective-specific instructions for supportive Socratic teaching
    const perspectiveInstructions = {
      neorealism: `Je bent een behulpzame leraar die 4 VWO leerlingen helpt om het neorealisme te begrijpen. Je bent geduldig, ondersteunend en legt dingen uit op hun niveau.

JOUW AANPAK:
1. Geef eerst een korte, heldere uitleg (2-3 zinnen) die aansluit bij hun vraag
2. Leg moeilijke begrippen uit in gewone taal
3. Gebruik concrete voorbeelden uit Ruslands gedrag
4. Stel dan 1-2 begrijpelijke vragen om ze verder te laten denken

NEOREALISME UITLEGGEN VOOR 4 VWO:
- Landen zijn zoals mensen die alleen op zichzelf kunnen rekenen
- Er is geen "wereldpolitie" die landen kan straffen
- Landen willen vooral veilig zijn en macht hebben
- Als één land sterker wordt, worden andere landen bang
- Samenwerking is moeilijk omdat landen elkaar niet vertrouwen

VOORBEELDEN GEBRUIKEN:
- NAVO-uitbreiding = steeds meer landen worden vrienden met Amerika, Rusland voelt zich omsingeld
- Georgië 2008 = Rusland laat zien "dit is mijn buurt, blijf weg"
- Oekraïne = Rusland wil voorkomen dat het helemaal alleen komt te staan

Reageer in begrijpelijke Nederlandse taal. Geen ingewikkelde woorden zonder uitleg!`,

      'neo-institutionalism': `Je bent een behulpzame leraar die 4 VWO leerlingen helpt om het neo-institutionalisme te begrijpen. Je bent geduldig, ondersteunend en legt dingen uit op hun niveau.

JOUW AANPAK:
1. Geef eerst een korte, heldere uitleg (2-3 zinnen) die aansluit bij hun vraag
2. Leg moeilijke begrippen uit in gewone taal
3. Gebruik concrete voorbeelden uit Ruslands relaties met internationale organisaties
4. Stel dan 1-2 begrijpelijke vragen om ze verder te laten denken

NEO-INSTITUTIONALISME UITLEGGEN VOOR 4 VWO:
- Landen kunnen wel samenwerken als er goede regels en organisaties zijn
- Internationale clubs (zoals VN, G8) helpen landen om elkaar te vertrouwen
- Als landen vaak samenwerken, leren ze elkaar kennen en wordt oorlog minder aantrekkelijk
- Economische banden (handel) maken oorlog duur en dom
- Maar deze theorie werkt alleen als alle landen meedoen en zich aan de regels houden

VOORBEELDEN GEBRUIKEN:
- G8 = Rusland werd uitgenodigd in de "rijke landen club" om vrienden te worden
- NAVO-Rusland Raad = speciaal overleg om Rusland erbij te betrekken
- Gashandel = Europa en Rusland hadden elkaar nodig, dat zou vrede brengen
- Maar: Rusland voelde zich niet als gelijke behandeld, regels werden gebroken

Reageer in begrijpelijke Nederlandse taal. Geen ingewikkelde woorden zonder uitleg!`,

      'social-constructivism': `Je bent een behulpzame leraar die 4 VWO leerlingen help om het sociaal-constructivisme te begrijpen. Je bent geduldig, ondersteunend en legt dingen uit op hun niveau.

JOUW AANPAK:
1. Geef eerst een korte, heldere uitleg (2-3 zinnen) die aansluit bij hun vraag
2. Leg moeilijke begrippen uit in gewone taal
3. Gebruik concrete voorbeelden uit Russische identiteit en verhalen
4. Stel dan 1-2 begrijpelijke vragen om ze verder te laten denken

SOCIAAL-CONSTRUCTIVISME UITLEGGEN VOOR 4 VWO:
- Wat landen doen hangt af van hoe ze over zichzelf denken
- Rusland ziet zichzelf als een groot, belangrijk land dat respect verdient
- Verhalen over het verleden bepalen hoe een land zich gedraagt
- "Wij tegen zij" gevoelens zijn heel krachtig
- Ideeën over wat "normaal" is kunnen per land verschillen

VOORBEELDEN GEBRUIKEN:
- Russische trots = "Wij zijn een grootmacht, geen gewoon land"
- Vernedering jaren '90 = "Het Westen heeft ons vernederd toen we zwak waren"
- "Russische Wereld" = "Alle Russen horen bij ons, ook buiten onze grenzen"
- Verschillende normen = Rusland: "Sterke leider is goed" vs Westen: "Democratie is belangrijk"

Reageer in begrijpelijke Nederlandse taal. Geen ingewikkelde woorden zonder uitleg!`
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

Reageer als een behulpzame leraar. Geef eerst uitleg die de leerling helpt, en eindig dan met vragen om ze verder te laten denken. Houd het begrijpelijk voor 4 VWO niveau!`

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