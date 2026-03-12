import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/primitives/button";
import { StarRating } from "@/shared/ui";
import { format } from "date-fns";

interface UserRatingBlockProps {
  beerId: number;
  userRating?: number;
  rateDate?: string;
}

export const UserRatingBlock = ({
  beerId,
  userRating,
  rateDate,
}: UserRatingBlockProps) => {
  return (
    <div className="text-center space-y-2 mb-4">
      {userRating ? (
        <div className="flex items-center justify-center flex-col gap-2">
          <StarRating
            rating={userRating}
            shortFormat={false}
            showRatingValue={true}
            isShowStatistics={false}
          />
          {rateDate && (
            <p className="text-sm text-muted-foreground">
              Оцінено: {format(rateDate, "dd.MM.yyyy")}
            </p>
          )}
          <Link
            to="/rate-beer/$beerId"
            params={{ beerId: beerId.toString() }}
          >
            <Button
              className="cursor-pointer"
              variant="outline"
            >
              Змінити Оцінку
            </Button>
          </Link>
        </div>
      ) : (
        <Link
          to="/rate-beer/$beerId"
          params={{ beerId: beerId.toString() }}
        >
          <Button className="cursor-pointer">
            Додати Власну Оцінку
          </Button>
        </Link>
      )}
    </div>
  );
};
