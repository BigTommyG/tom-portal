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
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-blue-800/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">TOM-portalen</p>
              <p className="text-blue-300 text-xs">Target Operating Model</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/interview"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
            >
              Start intervju
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" />
          AI-drevet intervjuverktøy for TOM-prosessen
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Strukturer din{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
            TOM-analyse
          </span>
          <br />med AI-innsikt
        </h1>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-10 leading-relaxed">
          Gjennomfør strukturerte intervjuer basert på Target Operating Model-rammeverket.
          AI analyserer svarene og genererer konkrete forbedringsforslag og en profesjonell PDF-rapport.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/interview"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center gap-3 text-lg shadow-xl shadow-blue-500/30"
          >
            Start nytt intervju
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="text-blue-300 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Ca. 30–45 minutter
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Strukturert intervju</h3>
            <p className="text-blue-300 text-sm leading-relaxed">
              {tomCategories.length} kategorier med{" "}
              {tomCategories.reduce((sum, c) => sum + c.questions.length, 0)} målrettede
              spørsmål dekker alle dimensjoner av Target Operating Model.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">AI-drevet analyse</h3>
            <p className="text-blue-300 text-sm leading-relaxed">
              Claude AI analyserer alle svarene, identifiserer styrker og
              svakheter, og gir prioriterte forbedringsanbefalinger.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Profesjonell PDF-rapport</h3>
            <p className="text-blue-300 text-sm leading-relaxed">
              Generer en komplett PDF-rapport med modenhetsscore, analyse og
              handlingsplan klar for ledelse og styre.
            </p>
          </div>
        </div>

        {/* Categories overview */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            {tomCategories.length} analyseområder
          </h2>
          <p className="text-blue-300">
            Intervjuet dekker alle viktige dimensjoner i en Target Operating Model-analyse
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tomCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 text-xs font-bold">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  </div>
                  <p className="text-blue-300 text-xs leading-relaxed">{cat.description}</p>
                  <p className="text-blue-400 text-xs mt-2 font-medium">
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center">
          <Users className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Klar til å starte analysen?
          </h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">
            Fyll inn organisasjonsinformasjon og gå gjennom intervjuet steg for steg.
            Hele prosessen tar ca. 30–45 minutter.
          </p>
          <Link
            href="/interview"
            className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
          >
            Start TOM-intervju nå
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <Target className="w-4 h-4" />
            TOM-portalen – Target Operating Model Intervjuverktøy
          </div>
          <p className="text-blue-500 text-xs">
            Drevet av Anthropic Claude AI · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
