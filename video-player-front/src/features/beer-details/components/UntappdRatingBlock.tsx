import { Beer } from "lucide-react";
import { InfoBlock, StarRating } from "@/shared/ui";
import { formatNumber } from "@/shared/utils/format-number";

interface UntappdRatingBlockProps {
  untappdRating: number | null;
  untappdNumberOfRatings: number | null;
}

export const UntappdRatingBlock = ({
  untappdRating,
  untappdNumberOfRatings,
}: UntappdRatingBlockProps) => {
  const formattedRating = untappdRating
    ? untappdRating
        .toFixed(2)
        .replace(/\.00$/, ".0")
        .replace(/(\.\d)0$/, "$1")
    : null;

  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4">
      {untappdRating ? (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                <Beer className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>Untappd</span>
            </div>
            <StarRating
              rating={untappdRating}
              numberOfRatings={untappdNumberOfRatings ?? 0}
              shortFormat
              showRatingValue={false}
              isShowStatistics={false}
              className="text-amber-600"
            />
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-amber-700">
              {formattedRating}
            </p>
            {untappdNumberOfRatings !== null && untappdNumberOfRatings !== undefined && (
              <p className="text-sm text-amber-700/80">
                {formatNumber(untappdNumberOfRatings)}{" "}
                {untappdNumberOfRatings === 1 ? "відгук" : "відгуків"}
              </p>
            )}
          </div>
        </div>
      ) : (
        <InfoBlock title="Оцінка Untappd відсутня" variant="info" />
      )}
    </div>
  );
};
