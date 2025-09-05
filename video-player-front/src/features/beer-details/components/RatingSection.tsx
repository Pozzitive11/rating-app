import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import { Button } from "@/shared/ui/primitives/button";
import { Separator } from "@/shared/ui/primitives/separator";
import StarRating from "@/shared/ui/StarRating";
import { Link } from "@tanstack/react-router";

export default function RatingSection({
  beerId,
  rating,
  numberOfRatings,
}: {
  beerId: string;
  rating: number;
  numberOfRatings: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Оцінки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-2 mb-4">
          <Link to="/rate-beer/$beerId" params={{ beerId: beerId }}>
            <Button>Додати Оцінку</Button>
          </Link>
        </div>
        <Separator className="my-4" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Оцінка Спільноти</p>
          <div className="flex items-center justify-center flex-col">
            <StarRating
              rating={rating}
              numberOfRatings={numberOfRatings}
              shortFormat={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
