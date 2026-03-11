import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";

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

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface CardPos {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  floatType: number;
  delay: number;
}

function estimateCardSize(text: string) {
  const charW = 9;
  const emojiW = 18;
  const padding = 28;
  let w = padding;
  for (const ch of text) {
    w += ch.charCodeAt(0) > 255 || ch.codePointAt(0)! > 0xffff ? emojiW : charW;
  }
  w = Math.min(Math.max(w, 100), 220);
  const h = 48;
  return { w, h };
}

function layoutCards(screenW: number, screenH: number): CardPos[] {
  const placed: CardPos[] = [];
  const titleW = 320;
  const titleH = 80;
  const titleX = (screenW - titleW) / 2;
  const titleY = (screenH - titleH) / 2;
  const margin = 6;

  const isOverlapping = (x: number, y: number, w: number, h: number) => {
    // Check title overlap
    if (
      x < titleX + titleW + margin &&
      x + w > titleX - margin &&
      y < titleY + titleH + margin &&
      y + h > titleY - margin
    ) {
      return true;
    }
    // Check other cards
    for (const p of placed) {
      if (
        x < p.x + p.w + margin &&
        x + w > p.x - margin &&
        y < p.y + p.h + margin &&
        y + h > p.y - margin
      ) {
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < sweetWords.length; i++) {
    const { w, h } = estimateCardSize(sweetWords[i]);
    let bestX = 0;
    let bestY = 0;
    let found = false;

    // Try many random positions using seeded random
    for (let attempt = 0; attempt < 300; attempt++) {
      const rx = seededRandom(i * 1000 + attempt * 7 + 1) * (screenW - w - 16) + 8;
      const ry = seededRandom(i * 1000 + attempt * 13 + 3) * (screenH - h - 16) + 8;
      if (!isOverlapping(rx, ry, w, h)) {
        bestX = rx;
        bestY = ry;
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback: place it somewhere with seeded random even if overlapping
      bestX = seededRandom(i * 7 + 1) * (screenW - w - 16) + 8;
      bestY = seededRandom(i * 13 + 3) * (screenH - h - 16) + 8;
    }

    placed.push({
      x: bestX,
      y: bestY,
      w,
      h,
      rotate: seededRandom(i * 17 + 5) * 24 - 12,
      floatType: i % 4,
      delay: seededRandom(i * 3 + 11) * 1.5,
    });
  }

  return placed;
}

function VikusiaPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [screenSize, setScreenSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    setScreenSize({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const positions = useMemo(
    () => layoutCards(screenSize.w, screenSize.h),
    [screenSize.w, screenSize.h]
  );

  useEffect(() => {
    setVisibleCards([]);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    sweetWords.forEach((_, i) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, i]);
        }, i * 120)
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, [screenSize]);

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
        const hue = (i * 9) % 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: pos.w,
              zIndex: i + 1,
              background: `linear-gradient(135deg, hsla(${hue}, 80%, 65%, 0.9), hsla(${hue + 40}, 90%, 55%, 0.9))`,
              backdropFilter: "blur(10px)",
              borderRadius: "0.85rem",
              padding: "0.7rem 0.9rem",
              textAlign: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              boxShadow: `0 4px 20px hsla(${hue}, 70%, 40%, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)`,
              border: "1px solid rgba(255,255,255,0.2)",
              transform: isVisible
                ? `rotate(${pos.rotate}deg) scale(1)`
                : `rotate(${pos.rotate}deg) scale(0)`,
              opacity: isVisible ? 1 : 0,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "default",
              animation: isVisible
                ? `float-${pos.floatType} ${3 + pos.delay}s ease-in-out ${pos.delay}s infinite`
                : "none",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `rotate(0deg) scale(1.2)`;
              e.currentTarget.style.zIndex = "50";
              e.currentTarget.style.boxShadow = `0 8px 36px hsla(${hue}, 70%, 40%, 0.7), inset 0 1px 0 rgba(255,255,255,0.35)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${pos.rotate}deg) scale(1)`;
              e.currentTarget.style.zIndex = String(i + 1);
              e.currentTarget.style.boxShadow = `0 4px 20px hsla(${hue}, 70%, 40%, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)`;
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
