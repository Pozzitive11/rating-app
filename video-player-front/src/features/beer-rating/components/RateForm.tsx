import { Camera, SaveIcon } from "lucide-react";
import { RangeRating } from "@/features/beer-rating/components/RangeRating";
import { Label } from "@/shared/ui/primitives/label";
import { FlavorProfiles } from "@/features/beer-rating/components/FlavorProfiles";
import { Input } from "@/shared/ui/primitives/input";
import { Textarea } from "@/shared/ui/primitives/textarea";
import { PresentationStyle } from "@/features/beer-rating/components/PresentationStyle";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/shared/ui";

export interface RateFormValues {
  rating: number;
  flavorProfiles: number[];
  presentationStyle: number | null;
  location: string;
  comment: string;
  photos: File[];
}

export const RateForm = ({
  onSubmit,
}: {
  onSubmit: (value: RateFormValues) => void;
}) => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      rating: 0,
      flavorProfiles: [] as number[],
      presentationStyle: null as number | null,
      location: "",
      comment: "",
      photos: [] as File[],
    },
    onSubmit: ({ value }: { value: RateFormValues }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <form.Field
        name="rating"
        children={field => (
          <div>
            <Label className="mb-2">Ваша оцінка</Label>
            <RangeRating
              rating={field.state.value}
              onRate={rating => field.handleChange(rating)}
            />
          </div>
        )}
      />
      <form.Field
        name="flavorProfiles"
        mode="array"
        children={field => (
          <div>
            <Label className="mb-2">Смакові Профілі</Label>
            <FlavorProfiles
              value={field.state.value}
              onChange={value => field.handleChange(value)}
            />
          </div>
        )}
      />
      <form.Field
        name="presentationStyle"
        children={field => (
          <div>
            <Label className="mb-2">Стиль Подачі</Label>
            <PresentationStyle
              value={field.state.value}
              onChange={value => field.handleChange(value)}
            />
          </div>
        )}
      />
      <form.Field
        name="location"
        children={field => (
          <div>
            <Label className="mb-2">Місце</Label>
            <Input
              type="text"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              placeholder="Де ти пив це пиво?"
            />
          </div>
        )}
      />
      <form.Field
        name="comment"
        children={field => (
          <div>
            <Label className="mb-2">Коментар</Label>
            <Textarea
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              placeholder="Що ти думаєш про це пиво?"
            />
          </div>
        )}
      />
      <form.Field
        name="photos"
        mode="array"
        children={field => (
          <div>
            <Label className="mb-2">Фото</Label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => {
                  const files = e.target.files;
                  if (files) {
                    field.handleChange(Array.from(files));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center gap-2 w-full h-10 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <Camera className="w-5 h-5 text-black" />
                <span className="text-black font-medium">
                  Додати Фото
                </span>
              </div>
            </div>
          </div>
        )}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={() => navigate({ to: "/" })}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="default"
          className="w-1/2"
        >
          <SaveIcon className="w-4 h-4" />
          Зберегти Оцінку
        </Button>
      </div>
    </form>
  );
};
