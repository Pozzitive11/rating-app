import { type Beer } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { Link } from "@tanstack/react-router";

export default function BeerSmallItem({ beer }: { beer: Beer }) {
  return (
    <Link to={`/rate-beer/$beerId`} params={{ beerId: beer.id }}>
      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 flex-shrink-0">
              <AvatarImage
                src={beer.mainImage || "beer-img.jpeg"}
                alt={beer.name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">🍺</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="font-semibold text-lg leading-tight truncate">
                  {beer.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {beer.brewery}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs font-medium">
                  {beer.style}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  {beer.abv}% ABV
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  {beer.ibu} IBU
                </Badge>
              </div>

              <StarRating rating={beer.rating} numberOfRatings={3} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
