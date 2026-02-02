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
import { formatNumber } from "@/shared/utils/format-number";
import { Beer, Users } from "lucide-react";

export const RatingSection = ({
  beerId,
  userRating,
  communityRating,
  numberOfRatings,
  untappdRating,
  untappdNumberOfRatings,
  rateDate,
  isLoading,
  error,
}: {
  beerId: number;
  userRating?: number;
  communityRating?: number;
  numberOfRatings?: number;
  untappdRating?: number;
  untappdNumberOfRatings?: number;
  rateDate?: string;
  isLoading?: boolean;
  error?: Error | null;
}) => {
  const formatRatingValue = (value: number) =>
    value
      .toFixed(2)
      .replace(/\.00$/, ".0")
      .replace(/(\.\d)0$/, "$1");

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
        <div className="rounded-xl border border-border/60 bg-background p-4">
          {communityRating ? (
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-background">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>Оцінка спільноти</span>
                </div>
                <StarRating
                  rating={communityRating}
                  numberOfRatings={numberOfRatings}
                  shortFormat
                  showRatingValue={false}
                />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">
                  {formatRatingValue(communityRating)}
                </p>
                {numberOfRatings !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(numberOfRatings)}{" "}
                    {numberOfRatings === 1 ? "відгук" : "відгуків"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <InfoBlock
              title="Оцінка Спільноти відсутня"
              variant="info"
            />
          )}
        </div>
        <Separator className="my-4" />
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
                  numberOfRatings={untappdNumberOfRatings}
                  shortFormat
                  showRatingValue={false}
                  className="text-amber-600"
                />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-amber-700">
                  {formatRatingValue(untappdRating)}
                </p>
                {untappdNumberOfRatings !== undefined && (
                  <p className="text-sm text-amber-700/80">
                    {formatNumber(untappdNumberOfRatings)}{" "}
                    {untappdNumberOfRatings === 1
                      ? "відгук"
                      : "відгуків"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <InfoBlock title="Оцінка Untappd відсутня" variant="info" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
