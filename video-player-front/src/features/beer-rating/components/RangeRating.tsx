export const RangeRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  allowHalf?: boolean;
}) => {
  const step = 0.25;
  const max = 5;
  const percentage = (rating / max) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    onRate?.(value);
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
          className={`w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider`}
          style={{
            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />

        <style>
          {`
            .range-slider::-webkit-slider-thumb {
              appearance: none;
              -webkit-appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #fbbf24;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .range-slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #fbbf24;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              border: none;
            }
            
            .range-slider::-moz-range-track {
              height: 4px;
              background: transparent;
            }
`}
        </style>
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
          {rating > 0 ? `${rating.toFixed(2)}/5` : "Не оцінено"}
        </span>
        {rating > 0 && (
          <div className="text-sm text-muted-foreground">
            {rating >= 4.5
              ? "🌟 Відмінно"
              : rating >= 3.5
                ? "👍 Дуже добре"
                : rating >= 2.5
                  ? "👌 Добре"
                  : rating >= 1.5
                    ? "😐 Задовільно"
                    : "👎 Погано"}
          </div>
        )}
      </div>
    </div>
  );
};
