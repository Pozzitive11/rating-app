import { cn, formatNumber } from "@/lib/utils";
import { Rating, RatingButton } from "./ui/shadcn-io/rating";
import { useMemo } from "react";

interface StarRatingProps {
  rating: number;
  numberOfRatings: number;
  shortFormat?: boolean;
  showRatingValue?: boolean;
  className?: string;
}

const starSize = {
  SMALL: 17,
  MEDIUM: 30,
} as const;

export default function StarRating({
  rating,
  numberOfRatings,
  shortFormat = true,
  showRatingValue = true,
  className,
}: StarRatingProps) {
  // Memoize star buttons to avoid recreating on every render
  const starButtons = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => (
        <RatingButton size={17} className="text-yellow-500" key={index} />
      )),
    []
  );

  const formattedRating = rating.toFixed(1);
  const formattedNumberOfRatings = formatNumber(numberOfRatings);

  // Create accessible label
  const ariaLabel = `Оцінка: ${formattedRating} з 5 зірок, на основі ${numberOfRatings} відгук${
    numberOfRatings !== 1 ? "ів" : "у"
  }`;

  const currentStarSize = shortFormat ? starSize.SMALL : starSize.MEDIUM;

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        !shortFormat && "flex-col justify-center",
        className
      )}
      role="img"
      aria-label={ariaLabel}
    >
      <Rating
        value={rating}
        readOnly
        className="text-yellow-500"
        aria-hidden="true"
        size={currentStarSize}
      >
        {starButtons}
      </Rating>

      {showRatingValue && shortFormat && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium text-foreground">{formattedRating}</span>
          <span className="text-muted-foreground">
            ({formattedNumberOfRatings})
          </span>
        </div>
      )}

      {showRatingValue && !shortFormat && (
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            {formattedRating}/5
          </p>
          <p className="text-sm text-muted-foreground">
            На основі {formattedNumberOfRatings} відгук
            {numberOfRatings !== 1 ? "ів" : "у"}
          </p>
        </div>
      )}
    </div>
  );
}
