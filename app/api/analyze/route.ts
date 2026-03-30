import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { tomCategories, InterviewSession, AIAnalysis } from "@/lib/tom-questions";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildAnalysisPrompt(session: InterviewSession): string {
  const categoryAnswers = tomCategories.map((cat) => {
    const qas = cat.questions
      .map((q) => {
        const answer = session.answers[q.id];
        if (answer === undefined || answer === null || answer === "") return null;
        const answerStr = Array.isArray(answer) ? answer.join(", ") : String(answer);
        return `  Spørsmål: ${q.question}\n  Svar: ${answerStr}`;
      })
      .filter(Boolean)
      .join("\n\n");

    return `### ${cat.icon} ${cat.name}\n${qas}`;
  });

  return `Du er en erfaren management konsulent spesialisert på Target Operating Model (TOM) analyser for norske virksomheter. Du skal analysere svarene fra et TOM-intervju og gi konkrete, handlingsrettede forbedringsanbefalinger.

**Intervjudata:**
- Organisasjon: ${session.organisasjon}
- Intervjuobjekt: ${session.intervjuobjekt} (${session.rolle})
- Dato: ${session.dato}

**Besvarelse per kategori:**

${categoryAnswers.join("\n\n")}

---

Analyser besvarelsen grundig og returner KUN en JSON-struktur (ingen annen tekst) med følgende format:

{
  "sammendrag": "Et analytisk sammendrag på 3-4 setninger som beskriver organisasjonens TOM-modenhet og de viktigste funnene.",
  "styrker": [
    "Konkret styrke 1 – spesifikt og faktabasert fra svarene",
    "Konkret styrke 2",
    "Konkret styrke 3",
    "Konkret styrke 4"
  ],
  "utviklingsomrader": [
    "Konkret utviklingsområde 1 – med referanse til spesifikk del av besvarelsen",
    "Konkret utviklingsområde 2",
    "Konkret utviklingsområde 3",
    "Konkret utviklingsområde 4"
  ],
  "anbefalinger": [
    {
      "kategori": "Teknologi og IT",
      "tittel": "Kort, handlingsrettet tittel",
      "beskrivelse": "Detaljert beskrivelse av anbefalingen – hva som bør gjøres, hvorfor, og forventet effekt. Minst 3-4 setninger.",
      "prioritet": "Høy",
      "tidshorisont": "0-6 måneder",
      "estimertVerdi": "Kostnadsreduksjon / Effektivitetsgevinst / Risikoreduksjon"
    },
    {
      "kategori": "Prosesser",
      "tittel": "Tittel",
      "beskrivelse": "Beskrivelse",
      "prioritet": "Høy",
      "tidshorisont": "3-12 måneder",
      "estimertVerdi": "Verdi"
    },
    {
      "kategori": "Organisasjon",
      "tittel": "Tittel",
      "beskrivelse": "Beskrivelse",
      "prioritet": "Medium",
      "tidshorisont": "6-18 måneder",
      "estimertVerdi": "Verdi"
    },
    {
      "kategori": "Strategi",
      "tittel": "Tittel",
      "beskrivelse": "Beskrivelse",
      "prioritet": "Medium",
      "tidshorisont": "12-24 måneder",
      "estimertVerdi": "Verdi"
    },
    {
      "kategori": "Governance",
      "tittel": "Tittel",
      "beskrivelse": "Beskrivelse",
      "prioritet": "Lav",
      "tidshorisont": "6-18 måneder",
      "estimertVerdi": "Verdi"
    }
  ],
  "modenhetsscore": {
    "strategi": 3,
    "organisasjon": 2,
    "prosesser": 3,
    "teknologi": 2,
    "governance": 3,
    "kunde": 4,
    "okonomi": 3
  },
  "totalScore": 3,
  "risikoer": [
    "Konkret risiko 1 som fremkommer av besvarelsen",
    "Konkret risiko 2",
    "Konkret risiko 3"
  ],
  "prioriteringer": [
    "Prioritet 1: Spesifikk og konkret handling organisasjonen bør starte med umiddelbart",
    "Prioritet 2",
    "Prioritet 3",
    "Prioritet 4"
  ]
}

VIKTIG:
- Modenhetsscore skal være mellom 1-5 basert på besvarelsen (1=svært lav, 5=svært høy)
- Anbefalinger skal være spesifikke for DENNE organisasjonens situasjon, ikke generelle
- Bruk innsikter fra alle kategoriene på tvers i analysen
- Skriv alt på norsk bokmål`;
}

export async function POST(req: NextRequest) {
  try {
    const session: InterviewSession = await req.json();

    if (!session.answers || Object.keys(session.answers).length === 0) {
      return NextResponse.json({ error: "Ingen svar å analysere" }, { status: 400 });
    }

    const prompt = buildAnalysisPrompt(session);

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Ugyldig svar fra AI");
    }

    // Extract JSON from response
    const text = content.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Klarte ikke å parse AI-respons");
    }

    const analysis: AIAnalysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Intern feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
