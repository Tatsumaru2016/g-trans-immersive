/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SceneDefinition {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

export interface TranslationNode {
  language: string;
  flag: string;
  phrase: string;
  translated: string;
  coordinates: [number, number, number]; // [x, y, z] in 3D scene space
}

export const SCENES: SceneDefinition[] = [
  {
    id: 1,
    badge: "01 / GLOBAL CONNECTION",
    title: "Global Connectivity",
    subtitle: "Connecting People Through Language",
    description: "A living 3D globe spinning in light, mapping millions of communication pathways across countries in real time."
  },
  {
    id: 2,
    badge: "02 / HUMAN COMMUNICATION",
    title: "Instant Connection",
    subtitle: "Real-Time Speech Transformation",
    description: "Watch barriers dissolve as spoken words dynamically transform and cross the ocean instantly. It feels like standing side by side."
  },
  {
    id: 3,
    badge: "03 / LANGUAGE FLOW",
    title: "The Flowing Ecosystem",
    subtitle: "Beautiful Linguistic Flows",
    description: "An animated stream of Japanese kana, the Roman alphabet, Chinese characters, Arabic script, and Hangul traveling on fluid mathematical curves."
  },
  {
    id: 4,
    badge: "04 / G.TRANS ENGINE",
    title: "Cognitive Neural Engine",
    subtitle: "Advanced AI Translation Architecture",
    description: "Walk inside G.trans' neural network. Glassmorphism holographic HUDs illuminate OCR capabilities and latency-free computational mapping."
  },
  {
    id: 5,
    badge: "05 / GLOBAL NETWORK",
    title: "Cooperative Oceans",
    subtitle: "Empowering Global Collaborations",
    description: "Eliminating language friction for developers, travelers, gamers, businesses, and seekers worldwide on a single integrated system."
  },
  {
    id: 6,
    badge: "06 / POWERFUL SIMPLICITY",
    title: "Experience G.trans",
    subtitle: "Minimal Interface, Powerful Capability",
    description: "Try G.trans live below. Witness complex translation algorithms distilled into a pure, instantaneous interactive design."
  },
  {
    id: 7,
    badge: "07 / EMPOWER TOMORROW",
    title: "G.trans",
    subtitle: "Translate Anything. Connect Everyone.",
    description: "Join millions who cross boundaries without friction. Connect with anyone, anywhere, instantly."
  }
];

export const TRANS_NODES: TranslationNode[] = [
  { language: "Japanese", flag: "🇯🇵", phrase: "こんにちは", translated: "Hello", coordinates: [-1.8, 1.2, 1.5] },
  { language: "Spanish", flag: "🇪🇸", phrase: "Hola", translated: "Hello", coordinates: [1.3, -1.0, 1.8] },
  { language: "Chinese", flag: "🇨🇳", phrase: "你好", translated: "Hello", coordinates: [-2.2, -0.6, -1.2] },
  { language: "French", flag: "🇫🇷", phrase: "Bonjour", translated: "Hello", coordinates: [0.3, 2.1, 0.5] },
  { language: "Korean", flag: "🇰🇷", phrase: "안녕하세요", translated: "Hello", coordinates: [-1.2, -1.8, 1.0] },
  { language: "German", flag: "🇩🇪", phrase: "Hallo", translated: "Hello", coordinates: [0.8, 1.5, -1.5] },
  { language: "Arabic", flag: "🇸🇦", phrase: "مرحباً", translated: "Hello", coordinates: [2.0, 0.4, -0.8] },
  { language: "English", flag: "🇺🇸", phrase: "Hello", translated: "Hello", coordinates: [1.5, 1.8, 0.8] }
];

export const FEATURES: FeatureCard[] = [
  {
    title: "Real-time Screen Translation",
    description: "Translate overlay streams on any viewport continuously without refreshing.",
    icon: "Monitor"
  },
  {
    title: "OCR Auto-Recognition",
    description: "Highly adaptive optical character scanning supporting 120+ languages.",
    icon: "Scan"
  },
  {
    title: "Multi-Language Support",
    description: "Instantaneous syntactic mappings between complex localized dialects.",
    icon: "Globe"
  },
  {
    title: "Lightweight Engine",
    description: "Optimized client load using tiny memory Footprints, delivering extreme speed.",
    icon: "Zap"
  },
  {
    title: "Neural Convergence",
    description: "Deep-learning transformer pipelines optimized for natural phrasing contexts.",
    icon: "Cpu"
  },
  {
    title: "Zero Friction Interaction",
    description: "A gorgeous modern HUD floating in user spaces designed for perfect usability.",
    icon: "Sliders"
  }
];
