export interface TOMQuestion {
  id: string;
  question: string;
  type: "text" | "scale" | "multiselect" | "select" | "textarea";
  options?: string[];
  scale?: { min: number; max: number; minLabel: string; maxLabel: string };
  required: boolean;
  helpText?: string;
}

export interface TOMCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  questions: TOMQuestion[];
}

export const tomCategories: TOMCategory[] = [
  {
    id: "strategi",
    name: "Strategi og visjon",
    icon: "🎯",
    description: "Organisasjonens strategiske retning, mål og markedsposisjon",
    color: "blue",
    questions: [
      {
        id: "s1",
        question: "Hva er organisasjonens overordnede visjon og strategiske mål for de neste 3–5 årene?",
        type: "textarea",
        required: true,
        helpText: "Beskriv konkrete mål og ambisjonsnivå",
      },
      {
        id: "s2",
        question: "Hvilke markeder og kundesegmenter er organisasjonen primært rettet mot?",
        type: "textarea",
        required: true,
        helpText: "Geografiske markeder, bransjer, kundestørrelse",
      },
      {
        id: "s3",
        question: "Hva er organisasjonens viktigste konkurransefortrinn i dag?",
        type: "textarea",
        required: true,
        helpText: "Hva differensierer dere fra konkurrentene?",
      },
      {
        id: "s4",
        question: "I hvilken grad er den nåværende driftsmodellen i tråd med den strategiske visjonen?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Stor avstand", maxLabel: "Fullt alignet" },
      },
      {
        id: "s5",
        question: "Hvilke strategiske initiativer er pågående eller planlagt for de neste 12 månedene?",
        type: "textarea",
        required: false,
        helpText: "Transformasjoner, fusjoner, nye produkter/tjenester",
      },
    ],
  },
  {
    id: "organisasjon",
    name: "Organisasjon og mennesker",
    icon: "👥",
    description: "Organisasjonsstruktur, kompetanse, kultur og ledelse",
    color: "purple",
    questions: [
      {
        id: "o1",
        question: "Beskriv organisasjonens nåværende struktur (hierarki, matriseorganisasjon, flat struktur etc.)",
        type: "textarea",
        required: true,
        helpText: "Antall ansatte, avdelinger, styringslinjer",
      },
      {
        id: "o2",
        question: "Hvor godt fungerer samarbeidet på tvers av avdelinger og funksjoner?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Svært dårlig", maxLabel: "Svært godt" },
      },
      {
        id: "o3",
        question: "Hvilke kompetansegap er mest kritiske å tette for å nå strategiske mål?",
        type: "textarea",
        required: true,
        helpText: "Teknisk kompetanse, lederskap, bransjekunnskap",
      },
      {
        id: "o4",
        question: "Hvordan vil du beskrive organisasjonskulturen?",
        type: "multiselect",
        required: true,
        options: [
          "Innovasjonsdriven",
          "Prosessorientert",
          "Kundefokusert",
          "Hierarkisk",
          "Agil og fleksibel",
          "Tradisjonell og stabil",
          "Resultatfokusert",
          "Samarbeidsorientert",
        ],
      },
      {
        id: "o5",
        question: "Hva er de største utfordringene knyttet til talentanskaffelse og -beholdning?",
        type: "textarea",
        required: false,
        helpText: "Rekruttering, onboarding, turnover",
      },
      {
        id: "o6",
        question: "Hvor modent er endringsevnen i organisasjonen?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Lav endringsevne", maxLabel: "Høy endringsevne" },
      },
    ],
  },
  {
    id: "prosesser",
    name: "Prosesser og operasjonell effektivitet",
    icon: "⚙️",
    description: "Kjerneforretningsprosesser, støtteprosesser og operasjonell modenhet",
    color: "orange",
    questions: [
      {
        id: "p1",
        question: "Hvilke er de tre viktigste kjerneforretningsprosessene i organisasjonen?",
        type: "textarea",
        required: true,
        helpText: "De prosessene som direkte leverer verdi til kunden",
      },
      {
        id: "p2",
        question: "I hvilken grad er prosessene dokumentert og standardisert?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Udokumentert/ad-hoc", maxLabel: "Fullt dokumentert og standardisert" },
      },
      {
        id: "p3",
        question: "Hvor er de største flaskehalsene og ineffektivitetene i den daglige driften?",
        type: "textarea",
        required: true,
        helpText: "Manuelle prosesser, dobbeltarbeid, ventetider",
      },
      {
        id: "p4",
        question: "Hvilke prosesser er kandidater for automatisering eller digitalisering?",
        type: "textarea",
        required: false,
        helpText: "RPA, AI, systemintegrasjoner",
      },
      {
        id: "p5",
        question: "Hvordan måles og følges opp operasjonell ytelse?",
        type: "select",
        required: true,
        options: [
          "Ingen systematisk måling",
          "Ad-hoc og uformell oppfølging",
          "Grunnleggende KPIer og rapporter",
          "Strukturerte dashboards og jevnlig oppfølging",
          "Avansert analytikk og prediksjon",
        ],
      },
      {
        id: "p6",
        question: "Beskriv eventuelle utfordringer med leverandørkjede og partnerstyring",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "teknologi",
    name: "Teknologi og IT",
    icon: "💻",
    description: "IT-landskap, digitalisering, systemmodernitet og teknisk gjeld",
    color: "teal",
    questions: [
      {
        id: "t1",
        question: "Beskriv det nåværende IT-landskapet og kjerneplattformene",
        type: "textarea",
        required: true,
        helpText: "ERP, CRM, fagsystemer, infrastruktur, sky vs. on-premise",
      },
      {
        id: "t2",
        question: "Hva er digitaliseringsmodenheten i organisasjonen?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Primært manuell/analog", maxLabel: "Digitalt ledende" },
      },
      {
        id: "t3",
        question: "Hvilke systemintegrasjoner fungerer dårlig eller mangler?",
        type: "textarea",
        required: true,
        helpText: "Siloiserte systemer, manglende datautveksling",
      },
      {
        id: "t4",
        question: "Hva er omfanget av teknisk gjeld?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Kritisk høy teknisk gjeld", maxLabel: "Moderne og vedlikeholdt" },
      },
      {
        id: "t5",
        question: "Hvilke skyløsninger og moderne teknologier benyttes eller vurderes?",
        type: "multiselect",
        required: false,
        options: [
          "Microsoft Azure",
          "AWS",
          "Google Cloud",
          "SaaS-applikasjoner",
          "AI/ML",
          "Dataplatform/BI",
          "API-integrasjoner",
          "DevOps/CI-CD",
          "Containerisering",
        ],
      },
      {
        id: "t6",
        question: "Hva er de største IT-risikoscenariene og sårbarhetene?",
        type: "textarea",
        required: true,
        helpText: "Cybersikkerhet, tilgjengelighet, dataregulering",
      },
    ],
  },
  {
    id: "governance",
    name: "Governance og styring",
    icon: "📋",
    description: "Beslutningsprosesser, compliance, risikostyring og rapportering",
    color: "red",
    questions: [
      {
        id: "g1",
        question: "Hvordan er beslutningsprosessene organisert, og hvem har mandat på hvilke nivåer?",
        type: "textarea",
        required: true,
        helpText: "Delegering, eskalering, involvering",
      },
      {
        id: "g2",
        question: "Hva er kvaliteten på ledelsesinformasjonen og styringsdataene?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Lav – mangelfull data", maxLabel: "Høy – pålitelig og aktuell data" },
      },
      {
        id: "g3",
        question: "Hvilke compliance-krav og reguleringer er organisasjonen underlagt?",
        type: "textarea",
        required: true,
        helpText: "GDPR, ISO, bransjespesifikke krav",
      },
      {
        id: "g4",
        question: "Beskriv risikostyringsmodellen og -praksisen",
        type: "select",
        required: true,
        options: [
          "Ingen formell risikostyring",
          "Grunnleggende risikoregister",
          "Strukturert risikostyring med jevnlig gjennomgang",
          "Integrert enterprise risk management (ERM)",
          "Avansert prediksjon og proaktiv risikostyring",
        ],
      },
      {
        id: "g5",
        question: "Hva er de viktigste KPIene og måleparameterne ledelsen bruker?",
        type: "textarea",
        required: true,
        helpText: "Finansielle, operasjonelle og strategiske KPIer",
      },
    ],
  },
  {
    id: "kunde",
    name: "Kunde og marked",
    icon: "🤝",
    description: "Kundeopplevelse, verdileveranse og markedsposisjon",
    color: "green",
    questions: [
      {
        id: "k1",
        question: "Hva er den primære verdiproposisjonen til kundene?",
        type: "textarea",
        required: true,
        helpText: "Hva er grunnen til at kunder velger dere?",
      },
      {
        id: "k2",
        question: "Hvor god er kundeopplevelsen og kundetilfredsheten?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Lav tilfredshet", maxLabel: "Svært høy tilfredshet" },
      },
      {
        id: "k3",
        question: "Hvilke kanaler bruker dere for å nå og betjene kundene?",
        type: "multiselect",
        required: true,
        options: [
          "Direkte salg",
          "Netthandel/digitale kanaler",
          "Partnere/gjenforhandlere",
          "Callsenter/support",
          "Selvbetjening/portal",
          "Sosiale medier",
          "Fysisk/butikk",
        ],
      },
      {
        id: "k4",
        question: "Hva er de viktigste kundeklagene og forbedringspunktene i kundeopplevelsen?",
        type: "textarea",
        required: true,
      },
      {
        id: "k5",
        question: "Hvordan jobber dere med kundedata og CRM?",
        type: "select",
        required: false,
        options: [
          "Ingen strukturert tilnærming",
          "Grunnleggende CRM-bruk",
          "Segmentering og målrettet kommunikasjon",
          "Avansert dataanalyse og personalisering",
          "AI-drevet kundeintelligensi",
        ],
      },
    ],
  },
  {
    id: "okonomi",
    name: "Økonomi og ressurser",
    icon: "💰",
    description: "Finansiell modell, kostnadsstruktur og ressursallokering",
    color: "yellow",
    questions: [
      {
        id: "ø1",
        question: "Hva er organisasjonens finansielle modell og primære inntektsstrømmer?",
        type: "textarea",
        required: true,
        helpText: "Prosjektbasert, abonnement, produktsalg, tjenesteleveranse",
      },
      {
        id: "ø2",
        question: "Hva er de største kostnadspostene, og er disse i tråd med strategisk prioritering?",
        type: "textarea",
        required: true,
      },
      {
        id: "ø3",
        question: "Hva er kostnadseffektiviteten i organisasjonen sammenlignet med bransjen?",
        type: "scale",
        required: true,
        scale: { min: 1, max: 5, minLabel: "Godt over snitt", maxLabel: "Svært kostnadseffektiv" },
      },
      {
        id: "ø4",
        question: "Hvor mye investeres i teknologi og digitalisering som andel av omsetningen?",
        type: "select",
        required: false,
        options: [
          "Under 1%",
          "1–3%",
          "3–5%",
          "5–8%",
          "Over 8%",
          "Vet ikke",
        ],
      },
      {
        id: "ø5",
        question: "Hvilke muligheter for kostnadsoptimalisering og effektivitetsgevinster ser du?",
        type: "textarea",
        required: false,
        helpText: "Outsourcing, automatisering, konsolidering",
      },
    ],
  },
];

export type TOMAnswers = Record<string, string | string[] | number>;

export interface InterviewSession {
  id: string;
  organisasjon: string;
  intervjuobjekt: string;
  rolle: string;
  dato: string;
  answers: TOMAnswers;
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  sammendrag: string;
  styrker: string[];
  utviklingsomrader: string[];
  anbefalinger: Recommendation[];
  modenhetsscore: Record<string, number>;
  totalScore: number;
  risikoer: string[];
  prioriteringer: string[];
}

export interface Recommendation {
  kategori: string;
  tittel: string;
  beskrivelse: string;
  prioritet: "Høy" | "Medium" | "Lav";
  tidshorisont: string;
  estimertVerdi: string;
}
