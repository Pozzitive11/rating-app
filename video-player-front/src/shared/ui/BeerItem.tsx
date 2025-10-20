import { type Beer } from "@/api/beer/api";
import {
  Card,
  CardContent,
} from "@/shared/ui/primitives/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/ui/primitives/avatar";
import { Badge } from "@/shared/ui/primitives/badge";
import { Link } from "@tanstack/react-router";
import { StarRating } from "@/shared/ui";
import { cn } from "@/shared/utils";

interface BeerItemProps {
  beer: Beer;
  variant?: "big" | "small";
  linkTo?: string;
  className?: string;
}

export const BeerItem = ({
  beer,
  variant = "small",
  linkTo,
  className,
}: BeerItemProps) => {
  const isSmall = variant === "small";
  const hasHover = isSmall && linkTo;
  const showRating = variant === "small";

  const cardContent = (
    <Card
      className={cn(
        "p-4",
        hasHover &&
          "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage
              src={beer.mainImage || "beer-img.jpeg"}
              alt={beer.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg">
              🍺
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3
                className={cn(
                  "font-semibold leading-tight truncate",
                  isSmall ? "text-lg" : "text-2xl"
                )}
              >
                {beer.name}
              </h3>
              <p
                className={cn(
                  "text-muted-foreground mt-1",
                  isSmall ? "text-sm" : "text-lg"
                )}
              >
                {beer.brewery}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="secondary"
                className={cn(
                  "font-medium max-w-[150px] inline-block overflow-hidden text-ellipsis whitespace-nowrap",
                  isSmall ? "text-xs" : "text-sm"
                )}
              >
                {beer.style}
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  isSmall ? "text-xs" : "text-sm"
                )}
              >
                {beer.abv}% ABV
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  isSmall ? "text-xs" : "text-sm"
                )}
              >
                {beer.ibu} IBU
              </Badge>
            </div>

            {showRating && (
              <StarRating
                rating={beer.rating}
                numberOfRatings={3}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} params={{ beerId: beer.id }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
