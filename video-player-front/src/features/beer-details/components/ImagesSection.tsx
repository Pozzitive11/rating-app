import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import { Button } from "@/shared/ui/primitives/button";
import { MoveRight } from "lucide-react";

export const ImagesSection = ({
  images,
}: {
  images: string[];
}) => {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Зображення
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto cursor-pointer"
          >
            Дивитися всі
            <MoveRight className="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={image || "beer-img.jpeg"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              Зображення недоступні
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
