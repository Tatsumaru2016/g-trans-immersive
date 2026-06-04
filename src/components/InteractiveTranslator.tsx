/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ArrowLeftRight, Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { translateOffline } from "../translateFallback";

export default function InteractiveTranslator() {
  const [inputText, setInputText] = useState("こんにちは。言語という障壁を取り払い、世界中とリアルタイムに繋がる体験をG.transでお楽しみください。");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("English");
  const [sourceLang, setSourceLang] = useState("Japanese");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  const presets = [
    { text: "こんにちは。お時間ありますか？", from: "Japanese", to: "English" },
    { text: "Have a seat. Screen translation G.trans works actively without limits.", from: "English", to: "Japanese" },
    { text: "ようこそ未来へ、最先端の人工知能技術が対話を加速させます。", from: "Japanese", to: "Spanish" },
    { text: "Connect everyone, translate everything instantly.", from: "English", to: "Korean" }
  ];

  const handleTranslate = async (textToTranslate = inputText) => {
    if (!textToTranslate.trim()) return;
    setLoading(true);
    setWarningMsg("");
    const startTime = Date.now();

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          targetLang,
          sourceLang
        })
      });

      if (!response.ok) {
        throw new Error("API call failed structure");
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      setLatency(Date.now() - startTime);

      if (data.isFallback && data.warning) {
        setWarningMsg(data.warning);
      }
    } catch (err: any) {
      console.warn("API unavailable, using offline dictionary", err);
      const off = translateOffline(textToTranslate, targetLang);
      setTranslatedText(off.text);
      setWarningMsg(off.warning);
      setLatency(Date.now() - startTime);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText || "");
    setTranslatedText(inputText);
  };

  const triggerPreset = (preset: typeof presets[0]) => {
    setSourceLang(preset.from);
    setTargetLang(preset.to);
    setInputText(preset.text);
    setTranslatedText("");
    handleTranslate(preset.text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl glass-panel p-5 sm:p-7 border border-white/60 relative overflow-hidden pointer-events-auto select-none shadow-2xl">
      {/* Decorative colored glow indicators */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-zinc-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between mb-5 border-b border-black/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 rounded-full bg-[#1D1D1F] text-white font-mono text-[9px] font-bold uppercase tracking-widest leading-none">
            Realtime Core
          </div>
          <span className="text-xs font-bold text-[#1D1D1F]/50 font-mono">MODEL: GEMINI-3.5-FLASH</span>
        </div>
        {latency !== null && (
          <span className="text-[10px] font-mono text-slate-400">
            Latency: <strong className="text-[#0066CC] font-bold">{latency}ms</strong>
          </span>
        )}
      </div>

      {/* Warning message about missing API key / Falling back */}
      {warningMsg && (
        <div className="mb-4 text-[11px] bg-amber-50/70 border border-amber-200/55 text-amber-800 p-2.5 rounded-xl flex items-start gap-2 max-w-full">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            {warningMsg} - Running in smart translation preview. Set realistic <code>GEMINI_API_KEY</code> in secrets to unlock live AI.
          </span>
        </div>
      )}

      {/* Preset Selector Chips */}
      <div className="mb-5">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-2 block">
          Try Interactive Scenarios:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => triggerPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#FBFBFD] border border-black/[0.08] text-[#1D1D1F]/70 hover:bg-[#1D1D1F] hover:text-white hover:border-[#1D1D1F] transition-all duration-200 text-left cursor-pointer"
            >
              {preset.from.slice(0, 2)} → {preset.to.slice(0, 2)}: "{preset.text.slice(0, 18)}..."
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Text Box */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1D1D1F]/60 font-mono uppercase tracking-widest">
              From: {sourceLang}
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type anything here..."
            className="w-full h-32 p-3 bg-white/60 border border-black/[0.08] rounded-2xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-1 focus:ring-[#0066CC] focus:border-[#0066CC] resize-none font-sans transition-all duration-200"
          />
        </div>

        {/* Target Text Box */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0066CC] font-mono uppercase tracking-widest">
              To: {targetLang}
            </span>
            {translatedText && (
              <button
                onClick={copyToClipboard}
                className="text-[10px] text-slate-400 hover:text-[#1D1D1F] font-mono flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-[#0066CC]" /> Copied!
                  </>
                ) : (
                  "Copy Outcome"
                )}
              </button>
            )}
          </div>
          <div className="w-full h-32 p-3 bg-[#1D1D1F]/[0.02] border border-black/[0.08] rounded-2xl text-[#1D1D1F] text-sm relative overflow-y-auto font-sans">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white/90 rounded-2xl">
                <Spinner3D />
                <span className="text-xs text-[#0066CC] font-mono uppercase tracking-widest animate-pulse">
                  AI Transponding...
                </span>
              </div>
            ) : translatedText ? (
              <p className="text-[#1D1D1F] font-medium leading-relaxed leading-6">{translatedText}</p>
            ) : (
              <span className="text-slate-400 text-xs italic">Translated text will appear here instantly...</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={() => handleTranslate()}
          disabled={loading || !inputText.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D1D1F] text-white font-medium text-sm hover:bg-[#0066CC] active:scale-95 disabled:opacity-40 transition-all cursor-pointer border border-[#1D1D1F] hover:border-[#0066CC]"
        >
          <Sparkles className="w-4 h-4 text-white" />
          {loading ? "Translating..." : "Translate with AI Engine"}
        </button>

        <button
          onClick={swapLanguages}
          className="p-3 bg-white hover:bg-slate-50 active:scale-95 border border-black/[0.08] rounded-2xl text-slate-600 hover:text-[#1D1D1F] transition-all flex items-center justify-center cursor-pointer"
          title="Swap Languages"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      {/* Decorative subtle speed info footer */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>G.TRANS V1.2.0 • SERVER SIDE TRANSCRIPTION</span>
        <span>POWERED BY DEEP-TRANSMISSION PIPELINE</span>
      </div>
    </div>
  );
}

// Inline loading spinner with elegant ring animations
function Spinner3D() {
  return (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 border-2 border-slate-200 rounded-full" />
      <div className="absolute inset-0 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
