const LIBRARY: Record<string, Record<string, string>> = {
  こんにちは: { en: "Hello", es: "Hola", fr: "Bonjour", de: "Hallo", ko: "안녕하세요", zh: "你好" },
  ありがとう: { en: "Thank You", es: "Gracias", fr: "Merci", de: "Danke", ko: "감사합니다", zh: "谢谢" },
  你好: { en: "Hello", ja: "こんにちは", ko: "안녕하세요", es: "Hola" },
  안녕하세요: { en: "Hello", ja: "こんにちは", zh: "你好", es: "Hola" },
  "screen translation": { ja: "画面翻訳", ko: "화면 번역", zh: "屏幕翻译", es: "traducción de pantalla" },
};

export function translateOffline(text: string, targetLang: string): { text: string; warning: string } {
  const lowerText = text.toLowerCase().trim();
  for (const [key, transMap] of Object.entries(LIBRARY)) {
    if (lowerText.includes(key) || key.includes(lowerText)) {
      const target = targetLang?.toLowerCase().slice(0, 2) || "en";
      if (transMap[target]) {
        return {
          text: transMap[target],
          warning: "GitHub Pages モード: ローカル辞書で翻訳しています。",
        };
      }
    }
  }
  if (targetLang?.toLowerCase().startsWith("ja")) {
    return { text: "画面翻訳「G.trans」", warning: "GitHub Pages モード（ローカル辞書）" };
  }
  if (targetLang?.toLowerCase().startsWith("en")) {
    return { text: `${text} [Live Translated]`, warning: "GitHub Pages モード（ローカル辞書）" };
  }
  return { text: `${text} (${targetLang})`, warning: "GitHub Pages モード（ローカル辞書）" };
}
