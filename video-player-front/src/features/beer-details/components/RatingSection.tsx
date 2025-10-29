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

export const RatingSection = ({
  beerId,
  userRating,
  communityRating,
  numberOfRatings,
}: {
  beerId: string;
  userRating?: number;
  communityRating?: number;
  numberOfRatings?: number;
}) => {
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
            <div className="flex items-center justify-center flex-col">
              <StarRating
                rating={userRating}
                shortFormat={false}
              />
            </div>
          ) : (
            <Link
              to="/rate-beer/$beerId"
              params={{ beerId: beerId }}
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
