"use client";

import Link from "next/link";
import { tomCategories } from "@/lib/tom-questions";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Sparkles,
  Target,
  Users,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#008A00" }}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg leading-none">TOM-portalen</p>
              <p className="text-sm text-slate-500">Target Operating Model · Atea</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/interview"
              className="text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
              style={{ background: "#008A00" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#006E00")}
              onMouseLeave={e => (e.currentTarget.style.background = "#008A00")}
            >
              Start intervju
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-8 border"
          style={{ background: "rgba(0,138,0,0.08)", borderColor: "rgba(0,138,0,0.3)", color: "#006E00" }}
        >
          <Sparkles className="w-4 h-4" />
          AI-drevet intervjuverktøy for TOM-prosessen
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Strukturer din{" "}
          <span style={{ color: "#008A00" }}>
            TOM-analyse
          </span>
          <br />med AI-innsikt
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-10 leading-relaxed text-slate-500">
          Gjennomfør strukturerte intervjuer basert på Target Operating Model-rammeverket.
          AI analyserer svarene og genererer konkrete forbedringsforslag og en profesjonell PDF-rapport.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/interview"
            className="text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center gap-3 text-lg"
            style={{ background: "#008A00", boxShadow: "0 12px 32px rgba(0,138,0,0.25)" }}
          >
            Start nytt intervju
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="text-sm flex items-center gap-2 text-slate-500">
            <CheckCircle className="w-4 h-4" style={{ color: "#008A00" }} />
            Ca. 30–45 minutter
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <FileText className="w-6 h-6" style={{ color: "#008A00" }} />,
              title: "Strukturert intervju",
              desc: `${tomCategories.length} kategorier med ${tomCategories.reduce((sum, c) => sum + c.questions.length, 0)} målrettede spørsmål dekker alle dimensjoner av Target Operating Model.`,
            },
            {
              icon: <Sparkles className="w-6 h-6" style={{ color: "#008A00" }} />,
              title: "AI-drevet analyse",
              desc: "Claude AI analyserer alle svarene, identifiserer styrker og svakheter, og gir prioriterte forbedringsanbefalinger.",
            },
            {
              icon: <BarChart3 className="w-6 h-6" style={{ color: "#008A00" }} />,
              title: "Profesjonell PDF-rapport",
              desc: "Generer en komplett PDF-rapport med modenhetsscore, analyse og handlingsplan klar for ledelse og styre.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,138,0,0.10)" }}>
                {f.icon}
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Categories overview */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {tomCategories.length} analyseområder
          </h2>
          <p className="text-slate-500">
            Intervjuet dekker alle viktige dimensjoner i en Target Operating Model-analyse
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tomCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="rounded-xl p-5 border border-slate-200 bg-white hover:border-green-300 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: "#008A00" }}>
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-slate-800 font-semibold text-sm">{cat.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{cat.description}</p>
                  <p className="text-xs mt-2 font-medium" style={{ color: "#7BC87A" }}>
                    {cat.questions.length} spørsmål
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl p-10 text-center" style={{ background: "#008A00" }}>
          <Users className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Klar til å starte analysen?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Fyll inn organisasjonsinformasjon og gå gjennom intervjuet steg for steg.
            Hele prosessen tar ca. 30–45 minutter.
          </p>
          <Link
            href="/interview"
            className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-2xl transition-all hover:bg-slate-50 shadow-xl"
            style={{ background: "white", color: "#008A00" }}
          >
            Start TOM-intervju nå
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Target className="w-4 h-4" style={{ color: "#7BC87A" }} />
            TOM-portalen – Target Operating Model Intervjuverktøy
          </div>
          <p className="text-xs text-slate-400">
            Drevet av Anthropic Claude AI · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
