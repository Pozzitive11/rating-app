import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import { Button } from "@/shared/ui/primitives/button";
import { MoveRight, ImagePlus } from "lucide-react";
import { isEmpty } from "@/shared/utils";
import { EmptyState } from "@/shared/ui/EmptyState";

export const ImagesSection = ({
  images,
}: {
  images: string[];
}) => {
  const hasImages = !isEmpty([]);

  const handleAddPhoto = () => {
    // TODO: Implement photo upload functionality
    console.log("Add photo clicked");
  };

  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Зображення
          {hasImages && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto cursor-pointer"
            >
              Дивитися всі
              <MoveRight className="size-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasImages ? (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={image || "beer-img.jpeg"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Зображення відсутні"
            description="Додайте фотографії цього пива"
            buttonText="Додати фото"
            onButtonClick={handleAddPhoto}
            icon={<ImagePlus className="size-8" />}
            className="col-span-2"
          />
        )}
      </CardContent>
    </Card>
  );
};
