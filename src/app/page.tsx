'use client'

import { useState, useEffect, useRef } from 'react'
import RussiaChatModule from '@/components/RussiaChatModule'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showBackBtn, setShowBackBtn] = useState(false)
  const [lastClickedTermId, setLastClickedTermId] = useState<string | null>(null)
  const [backBtnText, setBackBtnText] = useState('↑')
  const [backBtnTitle, setBackBtnTitle] = useState('Naar boven')

  // Load theme preference
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      const isDark = currentTheme === 'dark'
      setIsDarkMode(isDark)
      if (isDark) {
        document.body.classList.add('dark-mode')
      }
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        setIsDarkMode(true)
        document.body.classList.add('dark-mode')
      }
    }
  }, [])

  // Handle scroll for back button
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = document.body.scrollTop > 300 || document.documentElement.scrollTop > 300
      setShowBackBtn(shouldShow)
      
      if (shouldShow && lastClickedTermId) {
        setBackBtnText('← Terug naar tekst')
        setBackBtnTitle('Terug naar de tekst')
      } else if (shouldShow) {
        setBackBtnText('↑')
        setBackBtnTitle('Naar boven')
      }
      
      if (!shouldShow) {
        setLastClickedTermId(null)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastClickedTermId])

  // Handle term link clicks
  useEffect(() => {
    const termLinks = document.querySelectorAll('.term-link')
    
    const handleTermClick = (event: Event) => {
      event.preventDefault()
      const link = event.currentTarget as HTMLAnchorElement
      const termId = link.id
      const targetId = link.getAttribute('href')
      
      setLastClickedTermId(termId)
      
      if (targetId) {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    termLinks.forEach(link => {
      link.addEventListener('click', handleTermClick)
    })

    return () => {
      termLinks.forEach(link => {
        link.removeEventListener('click', handleTermClick)
      })
    }
  }, [])

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked)
    if (checked) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleBackBtnClick = () => {
    if (lastClickedTermId) {
      const sourceElement = document.getElementById(lastClickedTermId)
      if (sourceElement) {
        sourceElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setLastClickedTermId(null)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <button 
        id="backBtn" 
        title={backBtnTitle}
        style={{ display: showBackBtn ? 'block' : 'none' }}
        onClick={handleBackBtnClick}
        dangerouslySetInnerHTML={{ __html: backBtnText }}
      />

      <div className="container">
        <header className="app-header">
          <h1>Rusland op het Wereldtoneel</h1>
          <div className="dark-mode-toggle">
            <span>Dark Mode</span>
            <label className="switch">
              <input 
                type="checkbox" 
                id="darkModeToggle"
                checked={isDarkMode}
                onChange={(e) => handleDarkModeToggle(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </header>

        <main>
          <section className="intro">
            <h2>Inleiding: Hoe kijk je naar de wereldpolitiek?</h2>
            <p>Stel je voor dat er een groot conflict is, zoals de oorlog in Oekraïne. Iedereen vraagt zich af: "Waarom doet Rusland dit?" Er is niet één simpel antwoord. Politieke wetenschappers gebruiken verschillende theorieën, die je kunt zien als <strong>verschillende soorten brillen</strong>. Elke bril laat je andere dingen zien en helpt je om het gedrag van een land op een andere manier te begrijpen.</p>
            <p>We gaan drie van die brillen opzetten om naar het gedrag van Rusland sinds 2008 te kijken:</p>
            <ul>
              <li><strong>De Neorealistische bril:</strong> Focust op macht, veiligheid en wantrouwen.</li>
              <li><strong>De Neo-institutionele bril:</strong> Focust op samenwerking, regels en gezamenlijke voordelen.</li>
              <li><strong>De Sociaal-constructivistische bril:</strong> Focust op ideeën, identiteit en "wij tegen zij"-gevoelens.</li>
            </ul>
          </section>

          <section className="history">
            <h2>De Voorgeschiedenis: Van Ingestorte Reus tot Ontevreden Grootmacht</h2>
            <p>Om het gedrag van Rusland na 2008 te begrijpen, moeten we terug in de tijd. Het Rusland van vandaag is namelijk het resultaat van een turbulente periode die begon met een enorme klap: het einde van de <a id="source-sovjet-unie-1" href="#term-sovjet-unie" className="term-link"><strong>Sovjet-Unie</strong></a> in 1991.</p>
            <h3>De jaren '90: Een land in crisis</h3>
            <p>Toen de Sovjet-Unie uit elkaar viel, veranderde alles. Rusland was plotseling geen supermacht meer, maar een land in diepe crisis. Miljoenen mensen verloren hun baan, de economie stortte in en er was veel armoede en criminaliteit. Voor veel Russen was dit een periode van vernedering. Ze waren de <a id="source-koude-oorlog-1" href="#term-koude-oorlog" className="term-link"><strong>Koude Oorlog</strong></a> 'verloren' en hun land, dat ooit de hele wereld uitdaagde, leek nu een tweederangs natie. Het Russische leger was zwak en verouderd, terwijl de Verenigde Staten als enige supermacht overbleef.</p>
            <p>In deze moeilijke tijd zocht Rusland toenadering tot het Westen. President Boris Jeltsin probeerde een partnerschap op te bouwen. Rusland kreeg financiële hulp en er werden gesprekken gevoerd over samenwerking. Het Westen beloofde dat de <a id="source-navo-1" href="#term-navo" className="term-link"><strong>NAVO</strong></a>, het militaire bondgenootschap van het Westen, niet "één inch" naar het oosten zou uitbreiden. Dit was een belangrijke belofte voor de Russen, die zich na decennia van vijandschap onveilig voelden.</p>
            <h3>Poetin aan de macht: Orde en herstel</h3>
            <p>Toen Vladimir Poetin rond het jaar 2000 aan de macht kwam, veranderde de sfeer. Zijn belangrijkste belofte was het herstellen van orde en stabiliteit. Hij maakte een einde aan de chaos van de jaren '90 en dankzij stijgende olieprijzen begon de economie weer te groeien. Hiermee begon hij ook te werken aan het herstel van de nationale trots. Rusland moest weer een sterke staat worden, die met respect werd behandeld op het wereldtoneel.</p>
            <p>Ondertussen gebeurde er in de wereld iets wat Moskou met argusogen bekeek. De NAVO breidde wél uit. Landen die vroeger bij de Sovjet-Unie hoorden, zoals Polen, Hongarije en later ook de Baltische staten, werden lid. Hoewel Rusland werd uitgenodigd om deel te nemen aan nieuwe overlegorganen, zoals de <a id="source-g8-1" href="#term-g8" className="term-link"><strong>G8</strong></a> en de NAVO-Rusland Raad, voelde Moskou zich vaak niet als een gelijke partner behandeld. De Russische bezwaren tegen de uitbreiding van de NAVO werden weggewuifd.</p>
            <h3>De spanning loopt op: Rode lijnen</h3>
            <p>In de jaren na 2000 vonden er in de buurlanden van Rusland zogenaamde "Kleurenrevoluties" plaats. In Georgië (2003) en Oekraïne (2004) kwamen door massale protesten nieuwe, pro-westerse regeringen aan de macht. Vanuit Moskou werd dit gezien als een gevaarlijke ontwikkeling. Het Westen leek zich direct te bemoeien met Ruslands "achtertuin", de regio die Rusland historisch en cultureel als zijn eigen <a id="source-invloedssfeer-1" href="#term-invloedssfeer" className="term-link"><strong>invloedssfeer</strong></a> beschouwde.</p>
            <p>De onvrede van Rusland werd steeds duidelijker. In een beroemde toespraak in München in 2007, beschuldigde Poetin de VS ervan de wereld te willen domineren en de belangen van andere landen, zoals Rusland, te negeren.</p>
            <p>Het echte kookpunt kwam in 2008. Tijdens een NAVO-top in Boekarest werd besproken of Georgië en Oekraïne in de toekomst lid konden worden. Voor Rusland was dit onacceptabel. De belofte van een mogelijk NAVO-lidmaatschap voor deze twee buurlanden werd door Moskou gezien als het oversteken van een <a id="source-rode-lijn-1" href="#term-rode-lijn" className="term-link"><strong>'rode lijn'</strong></a>. De jaren van opgekropte frustratie over de verloren status, de gebroken beloften en de oprukkende westerse invloed stonden op het punt om te exploderen. Enkele maanden later brak de oorlog tussen Rusland en Georgië uit. De toon was gezet voor de jaren die zouden volgen.</p>
          </section>

          <h2>De Drie Brillen in Detail</h2>

          <div className="perspective">
            <h3>Bril 1: Het Neorealisme (De Wereld als Schoolplein zonder Toezicht)</h3>
            <p>Als we deze bril opzetten, is het gedrag van Rusland geen uiting van emotie of ideologie, maar een koude, rationele reactie op de harde realiteit van de wereldpolitiek. Voor een neorealist begint alles bij de structuur van het internationale systeem.</p>
            <ul>
              <li><strong>De onvermijdelijke reactie op de NAVO-uitbreiding:</strong> Na de Koude Oorlog was de VS de enige overgebleven supermacht. De NAVO, een militaire alliantie opgericht tégen Rusland's voorganger, begon op te schuiven naar de Russische grens. Dit creëerde een klassiek <a id="source-veiligheidsdilemma-1" href="#term-veiligheidsdilemma" className="term-link"><strong>veiligheidsdilemma</strong></a>. Wat het Westen een 'defensieve' uitbreiding noemt om nieuwe democratieën te beschermen, ziet Moskou onvermijdelijk als een strop die langzaam wordt aangetrokken. De belofte in 2008 dat Oekraïne en Georgië lid konden worden, was vanuit dit perspectief een existentiële dreiging. In een wereld van <a id="source-anarchie-1" href="#term-anarchie" className="term-link"><strong>anarchie</strong></a> en <strong>zelfhulp</strong> kon Rusland niet anders dan militair ingrijpen om een strategische bufferzone te behouden. Het was een pure overlevingskwestie.</li>
              <li><strong>Het herstellen van de machtsbalans:</strong> Een verzwakt Rusland moest de Amerikaanse dominantie in de jaren '90 accepteren. Maar zodra het land economisch en militair weer sterker werd, begon het zich te gedragen zoals elke opkomende <a id="source-grootmacht-1" href="#term-grootmacht" className="term-link"><strong>grootmacht</strong></a> volgens neorealisten zou doen: het begon te <em>balanceren</em> tegen de dominante macht. De oorlogen in Georgië en Oekraïne, de annexatie van de Krim en zelfs de interventie in Syrië zijn allemaal acties om de Amerikaanse invloed te counteren en de wereldorde te dwingen van een <a id="source-unipolaire-wereld-1" href="#term-multipolaire-wereld" className="term-link"><strong>unipolaire</strong></a> naar een <a id="source-multipolaire-wereld-2" href="#term-multipolaire-wereld" className="term-link"><strong>multipolaire</strong></a> structuur, waarin Rusland een van de hoofdrolspelers is.</li>
              <li><strong>De focus op relatieve winst:</strong> Neorealisten stellen dat landen niet alleen kijken naar wat ze zelf winnen (<a id="source-winst-1" href="#term-winst" className="term-link"><strong>absolute winst</strong></a>), maar vooral naar wat ze winnen <em>in vergelijking met hun rivalen</em> (<a id="source-winst-2" href="#term-winst" className="term-link"><strong>relatieve winst</strong></a>). Een stabiel, welvarend en pro-westers Oekraïne zou een enorme relatieve winst voor het Westen betekenen en een catastrofaal relatief verlies voor Rusland. Vanuit dit oogpunt is het voor Rusland rationeel om enorme kosten (sancties, militaire verliezen) te accepteren, zolang het maar voorkomt dat zijn belangrijkste rivaal een strategisch voordeel behaalt.</li>
            </ul>
          </div>

          <div className="perspective">
            <h3>Bril 2: Het Neo-institutioneel Liberalisme (De Wereld als een Spel met Regels)</h3>
            <p>Als we deze bril opzetten, zien we het gedrag van Rusland niet als een onvermijdelijk gevolg van machtspolitiek, maar als het resultaat van een tragisch mislukt experiment in samenwerking.</p>
            <ul>
              <li><strong>Het falen van de instituties:</strong> Na de Koude Oorlog was er een gouden kans. Er werden allerlei <a id="source-instituties-1" href="#term-instituties" className="term-link"><strong>instituties</strong></a> opgericht of uitgebreid om Rusland bij het Westen te betrekken, zoals de <strong>G8</strong> en de NAVO-Rusland Raad. Het idee was dat door constante dialoog en samenwerking het wantrouwen zou afnemen. Dit experiment is mislukt. Rusland had het gevoel dat het in deze clubs nooit als een gelijke partner werd behandeld, maar als een 'junior partner' die de westerse regels maar moest accepteren. De Russische bezwaren tegen bijvoorbeeld de NAVO-uitbreiding of de westerse interventie in Kosovo werden genegeerd. Omdat de instituties niet in staat bleken de Russische belangen te accommoderen, verloren ze hun legitimiteit en nut in de ogen van Moskou.</li>
              <li><strong>De verkeerde inschatting van wederzijdse afhankelijkheid:</strong> De theorie stelt dat diepe economische banden oorlog onaantrekkelijk maken. Europa was afhankelijk van Russisch gas, en Rusland was afhankelijk van het Europese geld en de technologie. Jarenlang leek dit te werken. De invasie van 2022 laat echter de beperking van deze theorie zien. Het Kremlin besloot uiteindelijk dat de strategische verliezen (de verschuiving van Oekraïne naar het Westen) zwaarder wogen dan de <strong>absolute winsten</strong> van de energiehandel. In plaats van een garantie voor vrede, werd de wederzijdse afhankelijkheid zelf een wapen: Rusland gebruikte de gaskraan als chantagemiddel, en Europa gebruikte sancties om de Russische economie te raken.</li>
              <li><strong>Het breken van de spelregels:</strong> Het hele institutionele bouwwerk is gebaseerd op het idee dat staten zich aan de regels houden omdat ze waarde hechten aan hun reputatie en toekomstige samenwerking. Door internationale verdragen zoals het Handvest van de VN en het Boedapestmemorandum (waarin de grenzen van Oekraïne werden gegarandeerd) openlijk te schenden, liet Rusland zien dat wanneer een <strong>grootmacht</strong> zijn vitale belangen bedreigd acht, het bereid is het hele spelbord om te gooien. De instituties bleken te zwak om dit te voorkomen.</li>
            </ul>
          </div>
          
          <div className="perspective">
            <h3>Bril 3: Het Sociaal-Constructivisme (De Wereld van Ideeën en Identiteit)</h3>
            <p>Deze bril vraagt ons om de wereld van legers en grenzen even los te laten en te focussen op wat Russen en hun leiders <em>denken</em> en <em>voelen</em>. Het gedrag van Rusland komt voort uit een specifieke, geconstrueerde kijk op de wereld en op zichzelf.</p>
            <ul>
              <li><strong>De kracht van de Russische identiteit:</strong> De kern van de verklaring is de <a id="source-identiteit-1" href="#term-identiteit" className="term-link"><strong>identiteit</strong></a> die onder Poetin is gevormd. Deze bestaat uit twee cruciale, met elkaar verweven ideeën. Ten eerste, de <strong>identiteit</strong> als historische <strong>grootmacht</strong> (een <em>Derzhava</em>) met een unieke beschaving en een goddelijk recht op een speciale rol in de wereld. Dit is geen objectief feit, maar een diepgeworteld geloof dat het buitenlandbeleid stuurt. Ten tweede, de <strong>identiteit</strong> als een <em>gekränkte en vernederde natie</em> door het Westen in de jaren '90. Dit slachtoffer-narratief fungeert als een krachtige rechtvaardiging: agressieve acties worden niet gezien als agressie, maar als het rechtmatige herstel van trots en het terugslaan na jaren van vernedering.</li>
              <li><strong>De oorlog van normen en waarden:</strong> Dit is geen conflict over grondgebied alleen, maar een botsing van wereldbeelden. Het Westen praat over de universele <a id="source-normen-1" href="#term-normen" className="term-link"><strong>normen</strong></a> van democratie, mensenrechten en de soevereiniteit van elk land. Rusland stelt daar een heel ander 'normenpakket' tegenover: de absolute <a id="source-soevereiniteit-1" href="#term-soevereiniteit" className="term-link"><strong>soevereiniteit</strong></a> van de staat (geen buitenlandse inmenging), de verdediging van "traditionele waarden" tegen een "decadent" Westen, en het recht om de belangen van de <a id="source-russkiy-mir-1" href="#term-russkiy-mir" className="term-link"><strong>"Russische Wereld" (Russkiy Mir)</strong></a> te beschermen, zelfs als die zich buiten de eigen landsgrenzen bevindt. De oorlog is daarmee ook een poging om de liberale internationale orde te ondermijnen en te vervangen door een wereld waarin meerdere, verschillende normensystemen naast elkaar bestaan.</li>
              <li><strong>De realiteit die gecreëerd wordt door taal:</strong> Constructivisten benadrukken de macht van het <a id="source-narratief-1" href="#term-narratief" className="term-link"><strong>narratief</strong></a>. Door de invasie consequent te framen als een "speciale militaire operatie", een strijd tegen "nazi's" en "genocide", en een verdedigingsoorlog tegen de NAVO, creëert het Kremlin een sociale realiteit voor zijn bevolking waarin de oorlog niet alleen logisch, maar ook moreel juist is. Deze taal is geen versiering, het is een instrument om de wereld te vormen en actie te legitimeren.</li>
            </ul>
          </div>

          <section className="comparison">
            <h2>Afsluiting: De Drie Brillen Vergeleken</h2>
            <p>Nu we door drie verschillende brillen naar het gedrag van Rusland hebben gekeken, is de belangrijkste conclusie dat geen enkele bril het 'juiste' antwoord geeft. Ze zijn niet bedoeld om elkaar uit te sluiten, maar om elkaar aan te vullen. Ze helpen ons de complexiteit te begrijpen door steeds een ander deel van het verhaal te belichten. Waar zitten de verschillen nu precies?</p>

            <h4>1. Wat is de belangrijkste drijfveer van Rusland?</h4>
            <ul>
              <li>Volgens het <strong>Neorealisme</strong> is de drijfveer <strong>extern en structureel</strong>. Het is de druk van het anarchistische internationale systeem en de dreiging van de oprukkende NAVO die Rusland dwingt te reageren. Het land had bijna geen andere keuze.</li>
              <li>Volgens het <strong>Neo-institutionalisme</strong> is de drijfveer een <strong>rationele kosten-batenanalyse</strong>. Rusland koos voor conflict omdat de voordelen van samenwerking binnen de bestaande instituties uiteindelijk niet opwogen tegen de gepercipieerde strategische nadelen.</li>
              <li>Volgens het <strong>Sociaal-Constructivisme</strong> is de drijfveer <strong>intern en ideëel</strong>. Het is de Russische identiteit van een gekrenkte grootmacht en de afwijzing van westerse normen die het land aanzetten tot confrontatie. Het gedrag komt van binnenuit.</li>
            </ul>

            <h4>2. Waarom ontstaat er conflict?</h4>
            <ul>
              <li>Voor een <strong>Neorealist</strong> is conflict een <strong>normaal en bijna onvermijdelijk onderdeel</strong> van de internationale politiek. Het is een logisch gevolg van het veiligheidsdilemma in een wereld van wantrouwende staten.</li>
              <li>Voor een <strong>Neo-institutionalist</strong> is dit conflict juist een <strong>abnormale mislukking</strong>. Het is het bewijs dat de instituties en de mechanismen voor samenwerking hebben gefaald om het conflict te voorkomen.</li>
              <li>Voor een <strong>Constructivist</strong> is het conflict een <strong>botsing van identiteiten en realiteiten</strong>. Twee kampen die in een fundamenteel andere wereld leven en elkaars taal en normen niet meer begrijpen, komen onvermijdelijk met elkaar in botsing.</li>
            </ul>

            <h4>Hoe verhouden de brillen zich tot elkaar?</h4>
            <p>Je kunt de drie brillen zien als lagen die samen een completer beeld geven:</p>
            <p>Het <strong>Neorealisme</strong> schetst het <strong>speelveld</strong>: een gevaarlijke arena waarin grootmachten strijden om macht en veiligheid (de oprukkende NAVO versus een herrijzend Rusland).</p>
            <p>Het <strong>Neo-institutionalisme</strong> legt uit waarom de <strong>vangnetten en spelregels</strong> op dat speelveld niet werkten. De instituties die het conflict hadden moeten dempen, bleken te zwak of werden als oneerlijk ervaren.</p>
            <p>Het <strong>Sociaal-Constructivisme</strong> geeft ons het <strong>script van de acteurs</strong>. Het verklaart <em>waarom</em> Rusland het speelveld en de spelregels interpreteerde zoals het dat deed: vanuit een diepgeworteld gevoel van vernedering, een grootmacht-identiteit en een fundamenteel andere visie op hoe de wereld zou moeten werken.</p>
            <p>Samen laten ze zien dat het gedrag van Rusland wordt gedreven door een combinatie van externe druk, institutioneel falen en een krachtige, zelf gecreëerde nationale identiteit.</p>
          </section>

          {/* AI Chat Module */}
          <RussiaChatModule />

          <section id="begrippenlijst">
            <h2>Begrippenlijst</h2>
            <dl>
              <dt id="term-anarchie">Anarchie</dt>
              <dd>In de internationale politiek betekent dit niet chaos, maar de afwezigheid van een wereldregering. Er is geen 'baas' boven de landen die wetten kan handhaven of straffen kan uitdelen.</dd>
              
              <dt id="term-multipolaire-wereld">Bipolaire / Unipolaire / Multipolaire wereld</dt>
              <dd>Termen die de machtsverdeling in de wereld beschrijven.
                <ul>
                  <li><strong>Bipolaire wereld:</strong> De macht is verdeeld tussen twee supermachten (bv. de VS en de Sovjet-Unie tijdens de Koude Oorlog).</li>
                  <li><strong>Unipolaire wereld:</strong> Er is één overduidelijke supermacht die domineert (bv. de VS direct na de Koude Oorlog).</li>
                  <li><strong>Multipolaire wereld:</strong> De macht is verdeeld over meerdere grootmachten (bv. de VS, China, Rusland, EU).</li>
                </ul>
              </dd>
              
              <dt id="term-g8">G8 (Groep van 8)</dt>
              <dd>Een overlegclub van de acht grootste industriële landen. Rusland werd lid in 1997, wat gezien werd als een teken van samenwerking. In 2014 werd Rusland echter geschorst na de annexatie van de Krim. De groep ging verder als de G7.</dd>
              
              <dt id="term-grootmacht">Grootmacht</dt>
              <dd>Een land met zeer veel politieke, economische en militaire invloed in de wereld (bv. de VS, China en historisch gezien Rusland).</dd>
              
              <dt id="term-identiteit">Identiteit</dt>
              <dd>Het beeld dat een land van zichzelf heeft: zijn geschiedenis, cultuur, waarden en zijn rol in de wereld. Deze identiteit bepaalt wat een land belangrijk vindt.</dd>
              
              <dt id="term-instituties">Instituties</dt>
              <dd>Formele en informele regels, afspraken en organisaties die het gedrag van landen sturen. Voorbeelden zijn de Verenigde Naties (VN), de NAVO of internationale milieuverdragen.</dd>
              
              <dt id="term-invloedssfeer">Invloedssfeer</dt>
              <dd>Een regio of groep landen waar een grootmacht (meestal onofficieel) claimt bijzondere invloed te hebben. Vaak wordt dit gezien als de 'achtertuin' van die grootmacht.</dd>
              
              <dt id="term-koude-oorlog">Koude Oorlog</dt>
              <dd>De periode van vijandschap en spanning (ca. 1947-1991) tussen het communistische blok (onder leiding van de Sovjet-Unie) en het kapitalistische Westen (onder leiding van de VS). Er was geen directe oorlog tussen de twee, maar wel constante dreiging en conflicten in andere delen van de wereld.</dd>
              
              <dt id="term-machtsbalans">Machtsbalans</dt>
              <dd>Een toestand waarin de militaire en politieke macht min of meer gelijk verdeeld is tussen verschillende landen of groepen landen, zodat geen enkele partij te dominant kan worden.</dd>
              
              <dt id="term-narratief">Narratief</dt>
              <dd>Het (politieke) verhaal dat een land of leider vertelt om gebeurtenissen te verklaren, het eigen handelen te rechtvaardigen en steun te krijgen. Een narratief creëert vaak een 'wij tegen zij'-gevoel.</dd>
              
              <dt id="term-navo">NAVO (Noord-Atlantische Verdragsorganisatie)</dt>
              <dd>Een militair bondgenootschap opgericht in 1949, oorspronkelijk bedoeld als verdediging tegen de Sovjet-Unie. Het belangrijkste principe is dat een aanval op één lid wordt gezien als een aanval op alle leden.</dd>
              
              <dt id="term-normen">Normen</dt>
              <dd>Gedeelde opvattingen of ongeschreven regels over wat als normaal en acceptabel gedrag wordt gezien in de internationale gemeenschap (bv. het respecteren van de grenzen van een ander land).</dd>
              
              <dt id="term-rode-lijn">Rode lijn</dt>
              <dd>Een denkbeeldige grens die een land stelt in een conflict of onderhandeling. Als een andere partij die grens overschrijdt, wordt dit als onacceptabel gezien en kan er een zware reactie volgen (bv. militair ingrijpen).</dd>
              
              <dt id="term-russkiy-mir">Russkiy Mir ("Russische Wereld")</dt>
              <dd>Het idee dat Rusland een speciale band heeft met en verantwoordelijkheid draagt voor alle Russisch-sprekenden en mensen met een Russische culturele achtergrond, ook als ze buiten de grenzen van de Russische Federatie wonen. Dit idee wordt gebruikt om ingrijpen in buurlanden te rechtvaardigen.</dd>
              
              <dt id="term-soevereiniteit">Soevereiniteit</dt>
              <dd>Het principe dat een staat de hoogste macht heeft over zijn eigen grondgebied en bevolking. Andere landen mogen zich volgens dit principe niet met de binnenlandse zaken van die staat bemoeien.</dd>
              
              <dt id="term-sovjet-unie">Sovjet-Unie</dt>
              <dd>De communistische staat (bestaand van 1922-1991) die bestond uit Rusland en 14 andere republieken. Na het uiteenvallen in 1991 wordt Rusland gezien als de officiële opvolgerstaat.</dd>
              
              <dt id="term-veiligheidsdilemma">Veiligheidsdilemma</dt>
              <dd>Een situatie waarin de stappen die een land neemt om zijn eigen veiligheid te vergroten (bv. zijn leger versterken), door andere landen als een bedreiging worden gezien. Hierdoor gaan zij zich ook bewapenen, wat onbedoeld leidt tot meer spanning en onveiligheid voor iedereen.</dd>
              
              <dt id="term-winst">Winst (Absoluut vs. Relatief)</dt>
              <dd>
                <ul>
                  <li><strong>Absolute winst:</strong> De totale winst die een land uit een samenwerking haalt, ongeacht wat andere landen winnen. ("Ik win 10, jij wint 20. Prima, want ik ben blij met mijn 10.")</li>
                  <li><strong>Relatieve winst:</strong> De winst van een land vergeleken met een ander land. ("Ik win 10, maar jij wint 20. Dit is een probleem, want jij wordt nu sterker in vergelijking met mij.")</li>
                </ul>
              </dd>
            </dl>
          </section>
        </main>
        
        <footer>
          <p>Rythovius College</p>
        </footer>
      </div>
    </>
  )
}