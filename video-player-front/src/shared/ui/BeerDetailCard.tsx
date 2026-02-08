import type { UntappdBeerDetails } from "@/api/types";
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

interface BeerDetailCardProps {
  beer: UntappdBeerDetails;
}

export const BeerDetailCard = ({
  beer,
}: BeerDetailCardProps) => {
  const cardContent = (
    <Card
      className="p-4 hover:shadow-md transition-shadow duration-200"
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
              <h3 className="font-semibold leading-tight truncate text-lg">
                {beer.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {beer.brewery ?? ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="secondary"
                className="font-medium max-w-[150px] text-xs inline-block overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {beer.style ?? ""}
              </Badge>

              <Badge
                variant="outline"
                className="font-medium text-xs"
              >
                {beer.abv ?? 0}% ABV
              </Badge>
              <Badge
                variant="outline"
                className="font-medium text-xs"
              >
                {beer.ibu ?? 0} IBU
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  return cardContent;
};
