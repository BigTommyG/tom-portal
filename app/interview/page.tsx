"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tomCategories, TOMAnswers, InterviewSession } from "@/lib/tom-questions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Target,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

type FormData = {
  organisasjon: string;
  intervjuobjekt: string;
  rolle: string;
};

type Step = "intro" | "category" | "analyzing";

const categoryColors: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
};

const categoryBorders: Record<string, string> = {
  blue: "border-blue-200 focus:ring-blue-500",
  purple: "border-purple-200 focus:ring-purple-500",
  orange: "border-orange-200 focus:ring-orange-500",
  teal: "border-teal-200 focus:ring-teal-500",
  red: "border-red-200 focus:ring-red-500",
  green: "border-green-200 focus:ring-green-500",
  yellow: "border-yellow-200 focus:ring-yellow-500",
};

export default function InterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [formData, setFormData] = useState<FormData>({
    organisasjon: "",
    intervjuobjekt: "",
    rolle: "",
  });
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<TOMAnswers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const currentCategory = tomCategories[currentCategoryIndex];
  const totalCategories = tomCategories.length;
  const completedCategories = currentCategoryIndex;
  const overallProgress = Math.round((completedCategories / totalCategories) * 100);

  function handleAnswer(questionId: string, value: string | string[] | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => { const n = { ...prev }; delete n[questionId]; return n; });
    }
  }

  function toggleMultiselect(questionId: string, option: string) {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    handleAnswer(questionId, updated);
  }

  function validateCurrentCategory(): boolean {
    const newErrors: Record<string, string> = {};
    for (const q of currentCategory.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          newErrors[q.id] = "Dette feltet er påkrevd";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNextCategory() {
    if (!validateCurrentCategory()) return;
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  }

  function handlePrevCategory() {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep("intro");
    }
  }

  async function handleSubmit() {
    setIsAnalyzing(true);
    setStep("analyzing");
    setAnalyzeError(null);

    const session: InterviewSession = {
      id: crypto.randomUUID(),
      organisasjon: formData.organisasjon,
      intervjuobjekt: formData.intervjuobjekt,
      rolle: formData.rolle,
      dato: new Date().toLocaleDateString("nb-NO"),
      answers,
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analyse feilet");
      }

      const { analysis } = await res.json();
      session.aiAnalysis = analysis;

      // Store in sessionStorage for the rapport page
      sessionStorage.setItem("tomSession", JSON.stringify(session));
      router.push("/rapport");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ukjent feil";
      setAnalyzeError(message);
      setIsAnalyzing(false);
    }
  }

  function validateIntro(): boolean {
    if (!formData.organisasjon.trim() || !formData.intervjuobjekt.trim() || !formData.rolle.trim()) {
      return false;
    }
    return true;
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {analyzeError ? (
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Analyse feilet</h2>
              <p className="text-slate-600 mb-6 text-sm">{analyzeError}</p>
              <button
                onClick={() => { setStep("category"); setIsAnalyzing(false); }}
                className="btn-primary"
              >
                Prøv igjen
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-300 animate-spin" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AI analyserer besvarelsen</h2>
              <p className="text-blue-300 text-lg mb-2">Identifiserer styrker og utviklingsområder...</p>
              <p className="text-blue-400 text-sm">Genererer handlingsplan og rapport</p>
              <div className="mt-8 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <header className="border-b border-blue-800/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold">TOM-portalen</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">Start TOM-intervju</h1>
              <p className="text-slate-500 leading-relaxed">
                Fyll inn informasjon om organisasjonen og intervjuobjektet før du starter.
                Intervjuet dekker {tomCategories.length} analyseområder.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label">Organisasjon / Virksomhet *</label>
                <input
                  type="text"
                  placeholder="f.eks. Acme AS"
                  className="input-field"
                  value={formData.organisasjon}
                  onChange={(e) => setFormData((p) => ({ ...p, organisasjon: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Intervjuobjektets navn *</label>
                <input
                  type="text"
                  placeholder="Fullt navn"
                  className="input-field"
                  value={formData.intervjuobjekt}
                  onChange={(e) => setFormData((p) => ({ ...p, intervjuobjekt: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Rolle / Stilling *</label>
                <input
                  type="text"
                  placeholder="f.eks. CIO, CEO, Operations Manager"
                  className="input-field"
                  value={formData.rolle}
                  onChange={(e) => setFormData((p) => ({ ...p, rolle: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-700 text-sm font-medium mb-2">Hva du kan forvente:</p>
              <ul className="space-y-1">
                {[
                  `${tomCategories.length} analyseområder med ${tomCategories.reduce((s, c) => s + c.questions.length, 0)} spørsmål totalt`,
                  "Ca. 30–45 minutter for gjennomføring",
                  "AI-analyse av alle svar etter fullføring",
                  "Nedlastbar PDF-rapport med handlingsplan",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-blue-600 text-sm">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { if (validateIntro()) setStep("category"); }}
              disabled={!validateIntro()}
              className="btn-primary w-full mt-6 justify-center text-base"
            >
              Start intervjuet
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Category step
  const color = currentCategory.color;
  const borderClass = categoryBorders[color] || "border-slate-200 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold", categoryColors[color])}>
                {currentCategoryIndex + 1}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{currentCategory.name}</p>
                <p className="text-slate-500 text-xs">
                  Steg {currentCategoryIndex + 1} av {totalCategories}
                </p>
              </div>
            </div>
            <span className="text-slate-500 text-sm font-medium">{overallProgress}% fullført</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-24 pb-10 max-w-4xl mx-auto px-6">
        {/* Category header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{currentCategory.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{currentCategory.name}</h2>
              <p className="text-slate-500 mt-1">{currentCategory.description}</p>
            </div>
          </div>

          {/* All categories pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tomCategories.map((cat, i) => (
              <div
                key={cat.id}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all",
                  i < currentCategoryIndex
                    ? "bg-green-100 text-green-700"
                    : i === currentCategoryIndex
                    ? clsx("text-white", categoryColors[cat.color])
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {i < currentCategoryIndex ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <span>{cat.icon}</span>
                )}
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {currentCategory.questions.map((q, qi) => (
            <div key={q.id} className="card p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className={clsx("flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center", categoryColors[color])}>
                  {qi + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    {q.question}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {q.helpText && (
                    <p className="text-slate-500 text-sm mt-1">{q.helpText}</p>
                  )}
                </div>
              </div>

              {/* Text/Textarea input */}
              {(q.type === "text" || q.type === "textarea") && (
                <textarea
                  rows={q.type === "textarea" ? 4 : 2}
                  placeholder="Skriv ditt svar her..."
                  className={clsx("input-field border", borderClass)}
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
              )}

              {/* Scale input */}
              {q.type === "scale" && q.scale && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {Array.from({ length: q.scale.max - q.scale.min + 1 }, (_, i) => i + q.scale!.min).map((val) => (
                      <button
                        key={val}
                        onClick={() => handleAnswer(q.id, val)}
                        className={clsx(
                          "flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-200 border-2",
                          answers[q.id] === val
                            ? clsx("text-white border-transparent", categoryColors[color])
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{q.scale.minLabel}</span>
                    <span>{q.scale.maxLabel}</span>
                  </div>
                </div>
              )}

              {/* Select input */}
              {q.type === "select" && q.options && (
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(q.id, option)}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3",
                        answers[q.id] === option
                          ? clsx("text-white border-transparent", categoryColors[color])
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Multiselect input */}
              {q.type === "multiselect" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((option) => {
                    const selected = ((answers[q.id] as string[]) || []).includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => toggleMultiselect(q.id, option)}
                        className={clsx(
                          "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                          selected
                            ? clsx("text-white border-transparent", categoryColors[color])
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                        )}
                      >
                        {selected && <CheckCircle className="w-3.5 h-3.5" />}
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {errors[q.id] && (
                <p className="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[q.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={handlePrevCategory} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Tilbake
          </button>
          <div className="text-slate-500 text-sm">
            {currentCategoryIndex + 1} / {totalCategories}
          </div>
          <button
            onClick={handleNextCategory}
            className="btn-primary"
          >
            {currentCategoryIndex === totalCategories - 1 ? (
              <>
                Analyser besvarelsen
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Neste kategori
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
