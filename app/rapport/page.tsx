"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InterviewSession, tomCategories } from "@/lib/tom-questions";
import {
  Target,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Star,
  Clock,
  Loader2,
  BarChart2,
  Lightbulb,
  Shield,
} from "lucide-react";
import clsx from "clsx";

const CATEGORY_NAMES: Record<string, string> = {
  strategi: "Strategi",
  organisasjon: "Organisasjon",
  prosesser: "Prosesser",
  teknologi: "Teknologi",
  governance: "Governance",
  kunde: "Kunde",
  okonomi: "Økonomi",
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

const PRIORITY_COLORS: Record<string, string> = {
  Høy: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Lav: "bg-green-100 text-green-700 border-green-200",
};

const PRIORITY_BG: Record<string, string> = {
  Høy: "border-l-red-500",
  Medium: "border-l-yellow-500",
  Lav: "border-l-green-500",
};

function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    score >= 4 ? "bg-green-500" : score >= 3 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8 text-right">
        {score}/5
      </span>
    </div>
  );
}

function RadarScore({ scores }: { scores: Record<string, number> }) {
  const entries = Object.entries(scores);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;

  const points = entries.map((_, i) => {
    const angle = (i / entries.length) * 2 * Math.PI - Math.PI / 2;
    return { angle };
  });

  const scorePoints = entries.map(([, score], i) => {
    const angle = points[i].angle;
    const dist = (score / 5) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  });

  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const gridPoints = points.map(({ angle }) => {
          const dist = (level / 5) * r;
          return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
        });
        return (
          <polygon
            key={level}
            points={gridPoints.join(" ")}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {points.map(({ angle }, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + r * Math.cos(angle)}
          y2={cy + r * Math.sin(angle)}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Score polygon */}
      <polygon
        points={scorePoints.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Score dots */}
      {scorePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
      ))}

      {/* Labels */}
      {entries.map(([key], i) => {
        const angle = points[i].angle;
        const labelR = r + 18;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        return (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#64748b"
            fontWeight="600"
          >
            {CATEGORY_ICONS[key]} {CATEGORY_NAMES[key]}
          </text>
        );
      })}
    </svg>
  );
}

export default function RapportPage() {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("tomSession");
    if (!stored) {
      router.push("/interview");
      return;
    }
    setSession(JSON.parse(stored));
  }, [router]);

  async function handleDownloadPdf() {
    if (!session) return;
    setIsGeneratingPdf(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      if (!res.ok) throw new Error("PDF-generering feilet");

      const html = await res.text();
      // Open in new window for print-to-PDF
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Popup ble blokkert. Tillat popups for denne siden.");
      }
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => { printWindow.print(); }, 500);
      };
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Ukjent feil";
      alert(`Kunne ikke generere PDF: ${msg}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const analysis = session.aiAnalysis;
  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-600">Ingen analyse funnet.</p>
          <button onClick={() => router.push("/interview")} className="btn-primary mt-4">
            Start ny
          </button>
        </div>
      </div>
    );
  }

  const scoreColor =
    analysis.totalScore >= 4
      ? "text-green-600"
      : analysis.totalScore >= 3
      ? "text-yellow-600"
      : "text-red-600";

  const scoreLabel =
    analysis.totalScore >= 4
      ? "Høy modenhet"
      : analysis.totalScore >= 3
      ? "Middels modenhet"
      : "Lav modenhet – kritisk fokus nødvendig";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">TOM-rapport</p>
              <p className="text-slate-500 text-xs">{session.organisasjon}</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn-primary text-sm"
          >
            {isGeneratingPdf ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Genererer...</>
            ) : (
              <><Download className="w-4 h-4" /> Last ned PDF</>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Report header */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-300 text-sm mb-3">
                <Target className="w-4 h-4" />
                Target Operating Model – Analyse
              </div>
              <h1 className="text-3xl font-bold mb-2">{session.organisasjon}</h1>
              <p className="text-blue-200">
                {session.intervjuobjekt} · {session.rolle}
              </p>
              <p className="text-blue-400 text-sm mt-1">{session.dato}</p>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-6 min-w-36">
              <p className="text-blue-300 text-sm mb-1">TOM-score</p>
              <p className={clsx("text-6xl font-bold mb-1", scoreColor.replace("text-", "text-"))}>
                {analysis.totalScore}
                <span className="text-2xl text-blue-300">/5</span>
              </p>
              <p className="text-blue-200 text-xs">{scoreLabel}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Sammendrag</h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-base">{analysis.sammendrag}</p>
        </div>

        {/* Scores + Radar */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Modenhet per kategori</h2>
            <div className="space-y-4">
              {Object.entries(analysis.modenhetsscore).map(([key, score]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      {CATEGORY_ICONS[key]} {CATEGORY_NAMES[key] || key}
                    </span>
                    <span className="text-xs text-slate-500">
                      {score >= 4 ? "Høy" : score >= 3 ? "Middels" : "Lav"}
                    </span>
                  </div>
                  <ScoreBar score={score} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Radardiagram</h2>
            <RadarScore scores={analysis.modenhetsscore} />
          </div>
        </div>

        {/* Strengths & Development */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-slate-800">Styrker</h2>
            </div>
            <ul className="space-y-3">
              {analysis.styrker.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Utviklingsområder</h2>
            </div>
            <ul className="space-y-3">
              {analysis.utviklingsomrader.map((u, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Risks */}
        {analysis.risikoer && analysis.risikoer.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-slate-800">Identifiserte risikoer</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {analysis.risikoer.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-slate-800">
              AI-anbefalinger ({analysis.anbefalinger.length})
            </h2>
          </div>
          <div className="space-y-4">
            {analysis.anbefalinger.map((rec, i) => (
              <div
                key={i}
                className={clsx(
                  "border border-slate-200 rounded-xl p-5 border-l-4",
                  PRIORITY_BG[rec.prioritet]
                )}
              >
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {rec.kategori}
                      </span>
                      <span
                        className={clsx(
                          "badge border text-xs",
                          PRIORITY_COLORS[rec.prioritet]
                        )}
                      >
                        {rec.prioritet} prioritet
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mt-1">{rec.tittel}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {rec.tidshorisont}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{rec.beskrivelse}</p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 text-xs font-medium">{rec.estimertVerdi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priorities */}
        {analysis.prioriteringer && analysis.prioriteringer.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Neste steg – prioritert handlingsplan</h2>
            </div>
            <div className="space-y-3">
              {analysis.prioriteringer.map((p, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed pt-1">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answers overview */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Besvarelsesdetaljer</h2>
          <div className="space-y-6">
            {tomCategories.map((cat) => {
              const catAnswers = cat.questions.filter(
                (q) => session.answers[q.id] !== undefined && session.answers[q.id] !== ""
              );
              if (catAnswers.length === 0) return null;
              return (
                <div key={cat.id}>
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.name}
                  </h3>
                  <div className="space-y-3 pl-6">
                    {catAnswers.map((q) => {
                      const val = session.answers[q.id];
                      const display = Array.isArray(val) ? val.join(", ") : String(val);
                      return (
                        <div key={q.id} className="border-l-2 border-slate-200 pl-4">
                          <p className="text-xs text-slate-500 mb-1">{q.question}</p>
                          <p className="text-sm text-slate-700 font-medium">{display}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center no-print">
          <Download className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Last ned PDF-rapport</h3>
          <p className="text-blue-200 text-sm mb-5">
            Komplett rapport med analyse, anbefalinger og handlingsplan klar for ledelse og styre.
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all inline-flex items-center gap-2"
          >
            {isGeneratingPdf ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Genererer PDF...</>
            ) : (
              <><Download className="w-4 h-4" /> Last ned TOM-rapport</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
