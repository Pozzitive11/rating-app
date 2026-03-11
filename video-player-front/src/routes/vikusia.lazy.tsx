import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";

export const Route = createLazyFileRoute("/vikusia")({
  component: VikusiaPage,
});

const sweetWords = [
  "Ти найкраща 💕",
  "Сонечко моє ☀️",
  "Ти неймовірна ✨",
  "Люблю тебе 💖",
  "Ти — моє щастя 🌈",
  "Красуня 🌸",
  "Розумниця 🧠",
  "Ти моя зірочка ⭐",
  "Найніжніша 🌷",
  "Ти — диво 💫",
  "Мій скарб 💎",
  "Найдобріша 🤍",
  "Чарівна 🪄",
  "Ти — натхнення 🎨",
  "Промінчик 🌟",
  "Найсолодша 🍯",
  "Ти — казка 📖",
  "Квіточка 🌺",
  "Найрідніша 💗",
  "Ти — все для мене 🌍",
  "Ти — мій всесвіт 🪐",
  "Найчарівніша усмішка 😊",
  "Ти — моя мелодія 🎶",
  "Янголятко 😇",
  "Ти — моє сонце і зорі 🌙",
  "Найтепліша 🔥",
  "Ти — мій рай 🏝️",
  "Зіронька ясна 🌠",
  "Ти — моя весна 🌿",
  "Найкрасивіша у світі 👑",
  "Ти — моя усмішка 😍",
  "Перлинка 🫧",
  "Ти — моя мрія 💭",
  "Найсвітліша 🕯️",
  "Ти — моя радість 🎉",
  "Ягідка 🍓",
  "Ти — моє серце 💓",
  "Найтендітніша 🦋",
  "Ти — моя любов 💘",
  "Зайчик мій 🐰",
];

// Seeded pseudo-random to keep positions stable across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface CardPosition {
  top: number;
  left: number;
  rotate: number;
  scale: number;
  floatType: number;
  delay: number;
}

function generatePositions(): CardPosition[] {
  return sweetWords.map((_, i) => ({
    top: 5 + seededRandom(i * 7 + 1) * 80,      // 5% - 85%
    left: 2 + seededRandom(i * 13 + 3) * 85,     // 2% - 87%
    rotate: seededRandom(i * 17 + 5) * 30 - 15,   // -15 to +15 deg
    scale: 0.85 + seededRandom(i * 23 + 7) * 0.35, // 0.85 - 1.2
    floatType: i % 4,
    delay: seededRandom(i * 3 + 11) * 1.5,
  }));
}

function VikusiaPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const positions = useMemo(() => generatePositions(), []);

  useEffect(() => {
    sweetWords.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, i]);
      }, i * 180);
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundImage: "url('/cat.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Title — centered */}
      <h1
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          fontSize: "3rem",
          fontWeight: 800,
          color: "#fff",
          textShadow:
            "0 2px 16px rgba(0,0,0,0.7), 0 0 40px rgba(255,105,180,0.5)",
          textAlign: "center",
          padding: "0.8rem 2.5rem",
          borderRadius: "1.2rem",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          animation: "pulse-glow 2s ease-in-out infinite",
          whiteSpace: "nowrap",
        }}
      >
        💖 Вікуся 💖
      </h1>

      {/* Scattered cards */}
      {sweetWords.map((word, i) => {
        const pos = positions[i];
        const isVisible = visibleCards.includes(i);
        const hue = (i * 18) % 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              zIndex: i + 1,
              background: `linear-gradient(135deg, hsla(${hue}, 80%, 65%, 0.88), hsla(${hue + 40}, 90%, 55%, 0.88))`,
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "0.9rem 1.2rem",
              textAlign: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: `${0.9 * pos.scale}rem`,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              boxShadow: `0 4px 24px hsla(${hue}, 70%, 40%, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)`,
              border: "1px solid rgba(255,255,255,0.2)",
              transform: isVisible
                ? `rotate(${pos.rotate}deg) scale(${pos.scale})`
                : `rotate(${pos.rotate}deg) scale(0)`,
              opacity: isVisible ? 1 : 0,
              transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "default",
              animation: isVisible
                ? `float-${pos.floatType} ${3 + pos.delay}s ease-in-out ${pos.delay}s infinite`
                : "none",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `rotate(0deg) scale(${pos.scale * 1.25})`;
              e.currentTarget.style.zIndex = "50";
              e.currentTarget.style.boxShadow = `0 8px 40px hsla(${hue}, 70%, 40%, 0.7), inset 0 1px 0 rgba(255,255,255,0.35)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${pos.rotate}deg) scale(${pos.scale})`;
              e.currentTarget.style.zIndex = String(i + 1);
              e.currentTarget.style.boxShadow = `0 4px 24px hsla(${hue}, 70%, 40%, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)`;
            }}
          >
            {word}
          </div>
        );
      })}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes float-0 {
          0%, 100% { translate: 0 0; }
          50% { translate: 8px -10px; }
        }
        @keyframes float-1 {
          0%, 100% { translate: 0 0; }
          50% { translate: -6px -12px; }
        }
        @keyframes float-2 {
          0%, 100% { translate: 0 0; }
          50% { translate: 10px 6px; }
        }
        @keyframes float-3 {
          0%, 100% { translate: 0 0; }
          50% { translate: -8px 8px; }
        }
      `}</style>
    </div>
  );
}
