/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Monitor, 
  Scan, 
  Globe, 
  Zap, 
  Cpu, 
  Sliders, 
  ArrowRight, 
  Download, 
  Terminal, 
  Languages, 
  ShieldCheck, 
  Layers,
  Heart
} from "lucide-react";
import ThreeCanvas from "./components/ThreeCanvas";
import OverlayUI from "./components/OverlayUI";
import InteractiveTranslator from "./components/InteractiveTranslator";
import { FEATURES } from "./types";

export default function App() {
  const [activeScene, setActiveScene] = useState<number>(1);

  // Map icon names from static definitions to Lucide Components
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor": return <Monitor className="w-5 h-5 text-[#0066CC]" />;
      case "Scan": return <Scan className="w-5 h-5 text-[#1D1D1F]" />;
      case "Globe": return <Globe className="w-5 h-5 text-[#0066CC]" />;
      case "Zap": return <Zap className="w-5 h-5 text-[#1D1D1F]" />;
      case "Cpu": return <Cpu className="w-5 h-5 text-[#0066CC]" />;
      case "Sliders": return <Sliders className="w-5 h-5 text-[#1D1D1F]" />;
      default: return <Languages className="w-5 h-5 text-[#0066CC]" />;
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FBFBFD] select-none text-[#1D1D1F] font-sans">
      
      {/* 3D WEBGL CORE ENGINE CANVAS - Full Screen */}
      <ThreeCanvas activeScene={activeScene} />

      {/* GLOBAL UI CONTROLS HUD (Absolute floating Overlay, captures scroll-wheel triggers) */}
      <OverlayUI activeScene={activeScene} setActiveScene={setActiveScene} />

      {/* ===============================================================
          DYNAMIC CONTENT OVERLAYS: Conditionally rendered based on activeScene
          =============================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-5 flex flex-col items-center justify-center p-6 sm:p-10">
        <AnimatePresence mode="wait">
          
          {/* ===============================================================
              SCENE 1: HERO INITIAL ENTRANCE OVERLAY
              =============================================================== */}
          {activeScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl flex flex-col items-center pointer-events-auto mt-[-40px]"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-[10px] font-mono font-bold tracking-widest text-[#1D1D1F]/60 uppercase mb-5 select-none">
                <SparklesIcon className="w-3.5 h-3.5 text-[#0066CC]" />
                Next Generation Translation
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#1D1D1F] mb-4 select-none">
                G.trans
              </h2>
              
              <p className="text-[#1D1D1F]/70 font-mono text-xs sm:text-sm tracking-wider uppercase font-medium max-w-sm mb-7 select-none">
                Translate Anything. Connect Everyone.
              </p>

              <button
                onClick={() => setActiveScene(2)}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#1D1D1F] text-white rounded-full font-medium text-xs tracking-wider uppercase hover:bg-[#0066CC] hover:shadow-none active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Launch Immersive Orbit <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 2: SPEECH METRICS OVERLAY
              =============================================================== */}
          {activeScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8 }}
              className="absolute left-6 sm:left-10 top-[18%] max-w-sm pointer-events-auto"
            >
              <div className="rounded-2xl glass-panel p-4 border border-black/[0.08] shadow-lg flex gap-3.5 items-start">
                <div className="p-2 bg-[#0066CC]/5 rounded-xl shrink-0">
                  <Languages className="w-5 h-5 text-[#0066CC] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#0066CC] tracking-wider uppercase mb-1">
                    Speech Centroid Connected
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Analyzing phonetic sequences near global nodes. G.trans decodes dialogue streams, morphing grammar packages mid-route instantly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 3: LANGUAGE VORTEX DETAILS
              =============================================================== */}
          {activeScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="absolute right-6 sm:right-[15%] top-[15%] max-w-xs pointer-events-auto"
            >
              <div className="rounded-2xl glass-panel p-4 border border-black/[0.08] shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-[#0066CC]" />
                  <span className="text-[10px] font-mono font-bold text-[#1D1D1F]/50 tracking-wider uppercase">
                    GLYPH TRAFFIC MAP
                  </span>
                </div>
                <p className="text-[#1D1D1F]/70 text-xs leading-relaxed">
                  Letters travel on custom vector routes. Opacity fluctuations denote computational translation load handled securely in our cognitive cloud.
                </p>
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 4: G.TRANS COGNITIVE AI FEATURE BENTO GRID
              =============================================================== */}
          {activeScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, staggerChildren: 0.08 }}
              className="absolute top-[16%] bottom-[42%] left-6 sm:left-10 right-6 lg:right-[42%] overflow-y-auto pointer-events-auto p-1.5"
            >
              <h3 className="text-xs font-mono font-bold text-[#0066CC] uppercase tracking-widest mb-4">
                // SYSTEM CORE FEATURES
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {FEATURES.map((feat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-4 rounded-2xl glass-panel border border-black/[0.06] hover:border-[#0066CC] hover:shadow-md transition-all duration-300 flex items-start gap-3 group"
                  >
                    <div className="p-2 bg-[#FBFBFD] border border-black/[0.04] rounded-xl group-hover:bg-[#0066CC]/5 transition-colors shrink-0">
                      {getFeatureIcon(feat.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0066CC] transition-colors">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                        {feat.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 5: INTERACTIVE METRIC CIRCLES
              =============================================================== */}
          {activeScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.8 }}
              className="absolute left-6 sm:left-10 lg:left-[45%] right-6 sm:right-[15%] top-[18%] pointer-events-auto"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl glass-panel p-4 text-center border border-black/[0.06] shadow-md">
                  <span className="block text-xl sm:text-2xl font-display font-extrabold text-[#0066CC]">
                    2.8B+
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1D1D1F]/40 uppercase tracking-wider">
                    WORDS TRANSLATED
                  </span>
                </div>

                <div className="rounded-2xl glass-panel p-4 text-center border border-black/[0.06] shadow-md">
                  <span className="block text-xl sm:text-2xl font-display font-extrabold text-[#1D1D1F]">
                    120+
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1D1D1F]/40 uppercase tracking-wider">
                    LANGUAGES ACTIVE
                  </span>
                </div>

                <div className="rounded-2xl glass-panel p-4 text-center border border-black/[0.06] shadow-md col-span-2 sm:col-span-1">
                  <span className="block text-xl sm:text-2xl font-display font-extrabold text-[#0066CC]">
                    99.98%
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1D1D1F]/40 uppercase tracking-wider">
                    RECOGNITION ACC
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 6: REALTIME INTERACTIVE TRANSLATOR
              =============================================================== */}
          {activeScene === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              className="absolute top-[8%] sm:top-[12%] bottom-[42%] lg:bottom-auto right-6 sm:right-10 left-6 lg:left-auto lg:w-[50%] overflow-y-auto"
            >
              <InteractiveTranslator />
            </motion.div>
          )}

          {/* ===============================================================
              SCENE 7: FINAL CALL TO ACTION (CTA)
              =============================================================== */}
          {activeScene === 7 && (
            <motion.div
              key="scene-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl flex flex-col items-center pointer-events-auto mt-[-40px]"
            >
              <div className="inline-flex items-center gap-1.5 bg-[#0066CC]/5 px-3.5 py-1.5 rounded-full border border-black/[0.08] text-[#0066CC] text-[10px] uppercase tracking-widest font-mono font-extrabold mb-5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                SECURE INFRASTRUCTURE • END-TO-END TRANSLATED
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#1D1D1F] tracking-tight leading-tight mb-3">
                Translate Anything.<br />Connect Everyone.
              </h2>
              
              <p className="text-xs sm:text-sm text-[#1D1D1F]/60 max-w-sm leading-relaxed mb-8">
                Eliminate language friction completely. Experience high-end AI overlay screen translation instantly on top of any active window.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                <button
                  onClick={() => setActiveScene(6)}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1D1D1F] hover:bg-[#0066CC] text-white font-semibold text-xs tracking-wider uppercase rounded-full shadow-none cursor-pointer transition-all duration-200"
                >
                  <Terminal className="w-4 h-4 text-white animate-pulse" />
                  Try Live Demonstration
                </button>

                <button
                  onClick={() => alert("G.trans client is prepared for download. In sandbox preview mode, download mimics mock triggers safely.")}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-black/[0.08] hover:bg-slate-50 text-[#1D1D1F] font-semibold text-xs tracking-wider uppercase rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download Overlay SDK
                </button>
              </div>

              {/* Mini credits footer */}
              <div className="absolute bottom-[-160px] md:bottom-[-200px] flex flex-col items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  Crafted by <span className="font-bold text-slate-700">G.trans Global team</span> with 
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </span>
                <span>© 2026 G.trans Inc. All Rights Reserved. Fully Certified.</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </main>
  );
}

// Sparkle inline SVG icon
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5l1-2.5Z" opacity="0.4" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" opacity="0.4" />
    </svg>
  );
}
