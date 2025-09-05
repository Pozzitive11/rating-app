import { type Beer } from "@/lib/api";
import { Card, CardContent } from "@/shared/ui/primitives/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/ui/primitives/avatar";
import { Badge } from "@/shared/ui/primitives/badge";

export default function BeerItemBig({ beer }: { beer: Beer }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage
              src={"beer-img.jpeg"}
              alt={beer.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg">🍺</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3 className="font-semibold text-2xl leading-tight truncate">
                {beer.name}
              </h3>
              <p className="text-lg text-muted-foreground mt-1">
                {beer.brewery}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-sm font-medium">
                {beer.style}
              </Badge>
              <Badge variant="outline" className="text-sm font-medium">
                {beer.abv}% ABV
              </Badge>
              <Badge variant="outline" className="text-sm font-medium">
                {beer.ibu} IBU
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
