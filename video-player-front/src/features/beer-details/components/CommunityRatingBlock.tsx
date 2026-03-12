import { Users } from "lucide-react";
import { StarRating } from "@/shared/ui";
import { formatNumber } from "@/shared/utils/format-number";

interface CommunityRatingBlockProps {
  communityRating: number | null;
  numberOfRatings: number;
}

export const CommunityRatingBlock = ({
  communityRating,
  numberOfRatings,
}: CommunityRatingBlockProps) => {
  const rating = communityRating ?? 0;
  const count = numberOfRatings ?? 0;

  const formattedRating = rating
    .toFixed(2)
    .replace(/\.00$/, ".0")
    .replace(/(\.\d)0$/, "$1");

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-background">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>Оцінка спільноти</span>
          </div>
          <StarRating
            rating={rating}
            numberOfRatings={count}
            shortFormat
            showRatingValue={false}
            isShowStatistics={false}
          />
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-foreground">
            {formattedRating}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatNumber(count)} {count === 1 ? "відгук" : "відгуків"}
          </p>
        </div>
      </div>
    </div>
  );
};
