import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import { Button } from "@/shared/ui/primitives/button";
import { Link } from "@tanstack/react-router";
import {
  InfoBlock,
  Separator,
  StarRating,
} from "@/shared/ui";
import { format } from "date-fns";

export const RatingSection = ({
  beerId,
  userRating,
  communityRating,
  numberOfRatings,
  rateDate,
  isLoading,
  error,
}: {
  beerId: number;
  userRating?: number;
  communityRating?: number;
  numberOfRatings?: number;
  rateDate?: string;
  isLoading?: boolean;
  error?: Error | null;
}) => {
  if (isLoading) {
    return (
      <InfoBlock
        title="Завантаження оцінки..."
        variant="loading"
      />
    );
  }
  if (error) {
    return (
      <InfoBlock
        title={error.message}
        variant="error"
      />
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Моя оцінка
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-2 mb-4">
          {userRating ? (
            <div className="flex items-center justify-center flex-col gap-2">
              <StarRating
                rating={userRating}
                shortFormat={false}
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
        <Separator className="my-4" />
        <div className="text-center space-y-2">
          {communityRating ? (
            <>
              <p className="text-lg font-medium">
                Оцінка Спільноти
              </p>
              <div className="flex items-center justify-center flex-col">
                <StarRating
                  rating={communityRating}
                  numberOfRatings={numberOfRatings}
                  shortFormat={false}
                />
              </div>
            </>
          ) : (
            <InfoBlock
              title="Оцінка Спільноти відсутня"
              variant="info"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
