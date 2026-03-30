import { NextRequest, NextResponse } from "next/server";
import { InterviewSession } from "@/lib/tom-questions";

const CATEGORY_NAMES: Record<string, string> = {
  strategi: "Strategi og visjon",
  organisasjon: "Organisasjon og mennesker",
  prosesser: "Prosesser og operasjonell effektivitet",
  teknologi: "Teknologi og IT",
  governance: "Governance og styring",
  kunde: "Kunde og marked",
  okonomi: "Økonomi og ressurser",
};

const CATEGORY_ICONS: Record<string, string> = {
  strategi: "🎯",
  organisasjon: "👥",
  prosesser: "⚙️",
  teknologi: "💻",
  governance: "📋",
  kunde: "🤝",
  okonomi: "💰",
};

function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Svært høy";
  if (score >= 3.5) return "Høy";
  if (score >= 2.5) return "Middels";
  if (score >= 1.5) return "Lav";
  return "Svært lav";
}

function getScoreBarHtml(score: number): string {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "#22c55e" : score >= 3 ? "#f59e0b" : "#ef4444";
  return `<div style="flex:1; height:10px; background:#f1f5f9; border-radius:5px; overflow:hidden;">
    <div style="width:${pct}%; height:100%; background:${color}; border-radius:5px;"></div>
  </div>`;
}

function priorityColor(priority: string): string {
  if (priority === "Høy") return "#dc2626";
  if (priority === "Medium") return "#d97706";
  return "#16a34a";
}

function priorityBg(priority: string): string {
  if (priority === "Høy") return "#fef2f2";
  if (priority === "Medium") return "#fffbeb";
  return "#f0fdf4";
}

export async function POST(req: NextRequest) {
  try {
    const session: InterviewSession = await req.json();
    const analysis = session.aiAnalysis;

    if (!analysis) {
      return NextResponse.json({ error: "Ingen analyse tilgjengelig" }, { status: 400 });
    }

    const html = `<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; font-size: 12px; line-height: 1.5; }
  .page { padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 28px; font-weight: 800; }
  h2 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
  h3 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .section { margin-bottom: 28px; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .header-block { background: linear-gradient(135deg, #1e3a8a, #3730a3); color: white; border-radius: 16px; padding: 32px; margin-bottom: 28px; }
  .header-block h1 { color: white; margin-bottom: 6px; }
  .header-block .sub { color: #bfdbfe; font-size: 13px; }
  .score-big { font-size: 52px; font-weight: 900; color: #60a5fa; line-height: 1; }
  .score-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .score-name { font-size: 12px; font-weight: 600; color: #475569; width: 180px; }
  .score-num { font-size: 11px; font-weight: 700; color: #64748b; width: 40px; text-align: right; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .rec-card { border-radius: 10px; padding: 14px; margin-bottom: 12px; border-left: 4px solid; }
  .li-item { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
  .li-dot { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; margin-top: 1px; }
  .risk-item { background: #fef2f2; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; font-size: 11px; color: #7f1d1d; }
  .priority-item { background: #eff6ff; border-radius: 10px; padding: 12px; margin-bottom: 8px; display: flex; gap: 12px; align-items: flex-start; }
  .priority-num { width: 28px; height: 28px; border-radius: 50%; background: #1d4ed8; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
  .footer { text-align: center; color: #94a3b8; font-size: 10px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header-block">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px;">
      <div>
        <div class="sub" style="margin-bottom:8px;">🎯 Target Operating Model – Analyse</div>
        <h1>${session.organisasjon}</h1>
        <p class="sub" style="margin-top:6px;">${session.intervjuobjekt} · ${session.rolle}</p>
        <p class="sub">${session.dato}</p>
      </div>
      <div style="text-align:center; background:rgba(255,255,255,0.1); border-radius:12px; padding:16px 24px; min-width:120px;">
        <p class="sub" style="margin-bottom:4px;">TOM-score</p>
        <div class="score-big">${analysis.totalScore}</div>
        <p class="sub">/5 · ${getScoreLabel(analysis.totalScore)}</p>
      </div>
    </div>
  </div>

  <!-- Summary -->
  <div class="section">
    <div class="card">
      <h2>📊 Sammendrag</h2>
      <p style="color:#475569; line-height:1.7;">${analysis.sammendrag}</p>
    </div>
  </div>

  <!-- Scores -->
  <div class="section">
    <div class="card">
      <h2>📈 Modenhet per kategori</h2>
      ${Object.entries(analysis.modenhetsscore)
        .map(([key, score]) => `
        <div class="score-row">
          <span class="score-name">${CATEGORY_ICONS[key] || ""} ${CATEGORY_NAMES[key] || key}</span>
          ${getScoreBarHtml(score as number)}
          <span class="score-num">${score}/5</span>
        </div>`)
        .join("")}
    </div>
  </div>

  <!-- Strengths & Development -->
  <div class="two-col section">
    <div class="card">
      <h2>✅ Styrker</h2>
      ${analysis.styrker
        .map((s) => `
        <div class="li-item">
          <div class="li-dot" style="background:#dcfce7; color:#16a34a;">✓</div>
          <span style="color:#374151; font-size:11px; line-height:1.6;">${s}</span>
        </div>`)
        .join("")}
    </div>
    <div class="card">
      <h2>🔼 Utviklingsområder</h2>
      ${analysis.utviklingsomrader
        .map((u, i) => `
        <div class="li-item">
          <div class="li-dot" style="background:#dbeafe; color:#1d4ed8;">${i + 1}</div>
          <span style="color:#374151; font-size:11px; line-height:1.6;">${u}</span>
        </div>`)
        .join("")}
    </div>
  </div>

  ${analysis.risikoer && analysis.risikoer.length > 0 ? `
  <!-- Risks -->
  <div class="section">
    <div class="card">
      <h2>🛡️ Identifiserte risikoer</h2>
      ${analysis.risikoer.map((r) => `<div class="risk-item">⚠️ ${r}</div>`).join("")}
    </div>
  </div>` : ""}

  <div class="page-break"></div>

  <!-- Recommendations -->
  <div class="section">
    <h2 style="margin-bottom:16px;">💡 AI-anbefalinger (${analysis.anbefalinger.length})</h2>
    ${analysis.anbefalinger
      .map((rec) => `
      <div class="rec-card" style="background:${priorityBg(rec.prioritet)}; border-left-color:${priorityColor(rec.prioritet)};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
          <div>
            <span style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em;">${rec.kategori}</span>
            <div style="font-weight:700; color:#1e293b; font-size:13px; margin-top:2px;">${rec.tittel}</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <span class="badge" style="background:${priorityBg(rec.prioritet)}; color:${priorityColor(rec.prioritet)}; border:1px solid ${priorityColor(rec.prioritet)}20;">${rec.prioritet} prioritet</span>
            <span style="font-size:10px; color:#64748b;">⏱ ${rec.tidshorisont}</span>
          </div>
        </div>
        <p style="color:#374151; font-size:11px; line-height:1.7; margin-bottom:8px;">${rec.beskrivelse}</p>
        <div style="background:rgba(255,255,255,0.7); border-radius:6px; padding:6px 10px; font-size:11px; color:#374151;">
          <strong>Estimert verdi:</strong> ${rec.estimertVerdi}
        </div>
      </div>`)
      .join("")}
  </div>

  ${analysis.prioriteringer && analysis.prioriteringer.length > 0 ? `
  <!-- Priorities -->
  <div class="section">
    <div class="card">
      <h2>🚀 Neste steg – prioritert handlingsplan</h2>
      ${analysis.prioriteringer
        .map((p, i) => `
        <div class="priority-item">
          <div class="priority-num">${i + 1}</div>
          <p style="color:#374151; font-size:11px; line-height:1.7;">${p}</p>
        </div>`)
        .join("")}
    </div>
  </div>` : ""}

  <div class="footer">
    <p>TOM-portalen · Target Operating Model Intervjuverktøy · Drevet av Anthropic Claude AI</p>
    <p>Rapport generert ${new Date().toLocaleDateString("nb-NO")} – Konfidensielt</p>
  </div>
</div>
</body>
</html>`;

    // Return HTML for client-side PDF generation (Puppeteer not available in Edge)
    // We'll use the HTML approach and have the client convert it
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-PDF-Mode": "html",
      },
    });
  } catch (err: unknown) {
    console.error("PDF generation error:", err);
    const message = err instanceof Error ? err.message : "Intern feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
