/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Globe, Compass, Cpu, Zap, Activity } from "lucide-react";
import { SCENES } from "../types";
import { SITE_SHOWCASE } from "../siteLinks";

interface OverlayUIProps {
  activeScene: number;
  setActiveScene: (scene: number) => void;
  langCount?: number;
}

export default function OverlayUI({ activeScene, setActiveScene }: OverlayUIProps) {
  const scrollLockRef = useRef(false);

  // Intercept scroll wheel events to drive scene navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ignore horizontal or tiny accidental scrolls
      if (Math.abs(e.deltaY) < 15) return;
      if (scrollLockRef.current) return;

      scrollLockRef.current = true;
      setTimeout(() => {
        scrollLockRef.current = false;
      }, 850); // Cooldown to allow 3D transition rendering

      if (e.deltaY > 0) {
        if (activeScene < 7) {
          setActiveScene(activeScene + 1);
        }
      } else {
        if (activeScene > 1) {
          setActiveScene(activeScene - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeScene, setActiveScene]);

  // Handle keypress arrows up/down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (activeScene < 7) setActiveScene(activeScene + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (activeScene > 1) setActiveScene(activeScene - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScene, setActiveScene]);

  const currentSceneData = SCENES[activeScene - 1];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none">
      
      {/* ===============================================================
          TOP HEADER: Brand and status parameters
          =============================================================== */}
      <header className="w-full flex items-center justify-between pointer-events-auto shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          {/* Neon rotating geometric logo shield */}
          <div className="relative w-8 h-8 rounded-xl bg-[#1D1D1F] flex items-center justify-center overflow-hidden border border-black/5">
            <span className="text-white font-display font-black text-sm tracking-tight z-10 select-none">G.</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-display font-black tracking-tight text-[#1D1D1F] select-none">G.trans</span>
            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">SECURE AI INFRASTRUCTURE</span>
          </div>
        </div>

        <a
          href={SITE_SHOWCASE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0066CC] bg-white/80 border border-black/[0.08] px-3 py-1.5 rounded-full hover:bg-[#0066CC]/10 transition-colors"
        >
          3D Showcase →
        </a>

        {/* Global Connection Badge Status */}
        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 bg-[#FBFBFD] border border-black/[0.08] px-3 py-1.5 rounded-full select-none">
            <Globe className="w-3 h-3 text-[#0066CC] animate-spin" style={{ animationDuration: '10s' }} />
            <span>SATELLITE DOWNLINK: <strong className="text-slate-800 font-bold">ONLINE</strong></span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FBFBFD] border border-black/[0.08] px-3 py-1.5 rounded-full">
            <Activity className="w-3 h-3 text-[#0066CC]" />
            <span>SYS LATENCY: <strong className="text-slate-800 font-bold">12ms</strong></span>
          </div>
        </div>
      </header>

      {/* ===============================================================
          LEFT SIDEBAR: Coordinate visualizers (Apple Vision Pro HUD style)
          =============================================================== */}
      <aside className="absolute left-6 top-[28%] hidden lg:flex flex-col gap-6 text-[10px] font-mono text-slate-400 z-10 select-none">
        <div className="flex flex-col gap-1">
          <span className="text-slate-300 font-bold">ORBIT COORDS:</span>
          <span className="text-slate-700 font-bold">L: 37.7749° W : 122.4194°</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-slate-300 font-bold font-mono">DENSITY NODE SCALE:</span>
          <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0066CC] transition-all duration-700" 
              style={{ width: `${(activeScene / 7) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-slate-300 font-mono">NETWORK SECTOR:</span>
          <span className="text-slate-700 font-bold">S.ATL-09 • SECTOR CHANNELS</span>
        </div>
      </aside>

      {/* ===============================================================
          RIGHT STORY CONTROLS: Arrow indicators and visual timeline steps
          =============================================================== */}
      <nav className="absolute right-6 sm:right-10 top-[30%] flex flex-col items-center gap-4 pointer-events-auto z-10">
        
        {/* Scroll UP button */}
        <button
          onClick={() => activeScene > 1 && setActiveScene(activeScene - 1)}
          disabled={activeScene === 1}
          className="w-10 h-10 rounded-full border border-black/[0.08] bg-white/85 hover:bg-[#1D1D1F] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-900 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm select-none active:scale-95"
          title="Previous Scene"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* 1 to 7 dotted numeric timeline */}
        <div className="flex flex-col items-center gap-2.5 my-3">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className="group relative flex items-center justify-center cursor-pointer"
              title={`Go to ${scene.title}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeScene === scene.id
                    ? "bg-[#1D1D1F] scale-125 h-6"
                    : "bg-slate-300 hover:bg-[#1D1D1F]"
                }`}
              />
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1D1D1F] text-white text-[9px] font-mono tracking-wider font-bold p-1 px-2.5 rounded-lg pointer-events-none">
                {scene.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll DOWN button */}
        <button
          onClick={() => activeScene < 7 && setActiveScene(activeScene + 1)}
          disabled={activeScene === 7}
          className="w-10 h-10 rounded-full border border-black/[0.08] bg-white/85 hover:bg-[#1D1D1F] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-900 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm select-none active:scale-95"
          title="Next Scene"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </nav>

      {/* ===============================================================
          BOTTOM CONTAINER: Active scene visual narration panel (Desktop-First styled)
          =============================================================== */}
      <footer className="w-full max-w-lg shrink-0 pointer-events-auto z-10 select-none pb-2">
        <div className="flex flex-col gap-1.5 mb-2.5 animate-pulse">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#0066CC]">
            {currentSceneData.badge}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1D1D1F] tracking-tight leading-none mb-1.5">
          {currentSceneData.title}
        </h1>
        <h2 className="text-sm font-semibold text-slate-500 mb-3.5">
          {currentSceneData.subtitle}
        </h2>
        
        <p className="text-[#1D1D1F]/80 text-xs sm:text-sm leading-relaxed mb-4 max-w-md">
          {currentSceneData.description}
        </p>

        {/* Scroll helper visual trigger */}
        {activeScene < 7 && (
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest bg-black/[0.04] border border-black/[0.04] w-fit px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#0066CC] rounded-full animate-ping" />
            Scroll or Sweep Wheel to Transition Outer Dimensions
          </div>
        )}
      </footer>

    </div>
  );
}
