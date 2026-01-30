import { cn } from "@/shared/utils";
import { useMemo } from "react";
import { RatingButton, Rating } from "./primitives";

interface StarRatingProps {
  rating: number;
  numberOfRatings?: number;
  shortFormat?: boolean;
  showRatingValue?: boolean;
  className?: string;
  isShowStatistics?: boolean;
}

const starSize = {
  SMALL: 17,
  MEDIUM: 30,
} as const;

export const StarRating = ({
  rating,
  numberOfRatings,
  shortFormat = true,
  showRatingValue = true,
  className,
  isShowStatistics = true,
}: StarRatingProps) => {
  // Memoize star buttons to avoid recreating on every render
  const starButtons = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => (
        <RatingButton
          size={17}
          className="text-yellow-500"
          key={index}
        />
      )),
    []
  );

  const formattedRating = rating.toFixed(2);

  // Create accessible label
  const ariaLabel = `Оцінка: ${formattedRating} з 5 зірок, на основі ${numberOfRatings} відгук${numberOfRatings !== 1 ? "ів" : "у"
    }`;

  const currentStarSize = shortFormat
    ? starSize.SMALL
    : starSize.MEDIUM;

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
          <span className="font-medium text-foreground">
            {formattedRating}
          </span>
          {numberOfRatings && (
            <span className="text-muted-foreground">
              ({numberOfRatings})
            </span>
          )}
        </div>
      )}

      {showRatingValue && !shortFormat && (
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            {formattedRating}/5
          </p>
          {isShowStatistics && (
            <p className="text-sm text-muted-foreground">
              На основі {numberOfRatings} відгуків
            </p>
          )}
        </div>
      )}
    </div>
  );
};
