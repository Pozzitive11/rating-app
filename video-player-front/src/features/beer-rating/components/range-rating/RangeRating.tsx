import styles from "./RangeRating.module.css";

const RATING_CONFIG = {
  ranges: [
    { min: 4.5, text: "🌟 Відмінно" },
    { min: 3.5, text: "👍 Дуже добре" },
    { min: 2.5, text: "👌 Добре" },
    { min: 1.5, text: "😐 Задовільно" },
    { min: 0, text: "👎 Погано" },
  ],
  max: 5,
  step: 0.25,
  notRatedText: "Не оцінено",
} as const;

export const RangeRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (rating: number) => void;
}) => {
  const { max, step, ranges, notRatedText } = RATING_CONFIG;
  const percentage = (rating / max) * 100;

  const getRatingText = (rating: number): string => {
    const matchingRange = ranges.find(
      range => rating >= range.min
    );
    return (
      matchingRange?.text || ranges[ranges.length - 1].text
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseFloat(e.target.value);
    onRate(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative py-2">
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={rating}
          onChange={handleChange}
          className={`w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer ${styles.rangeSlider}`}
          style={{
            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-3">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold">
          {rating > 0
            ? `${parseFloat(rating.toFixed(2))}/${max}`
            : notRatedText}
        </span>
        {rating > 0 && (
          <div className="text-sm text-muted-foreground">
            {getRatingText(rating)}
          </div>
        )}
      </div>
    </div>
  );
};
