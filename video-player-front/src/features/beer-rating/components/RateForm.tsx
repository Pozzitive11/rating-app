import { Camera, SaveIcon } from "lucide-react";
import { Label } from "@/shared/ui/primitives/label";
import { FlavorProfiles } from "@/features/beer-rating/components/FlavorProfiles";
import { Input } from "@/shared/ui/primitives/input";
import { Textarea } from "@/shared/ui/primitives/textarea";
import { PresentationStyle } from "@/features/beer-rating/components/PresentationStyle";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/shared/ui";
import { RangeRating } from "./range-rating/RangeRating";

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
        validators={{
          onChange: ({ value }) =>
            value === 0 ? "Оцінка обов'язкова" : undefined,
        }}
        children={field => (
          <div>
            <Label className="mb-2">
              Ваша оцінка
              <span className="text-red-500">*</span>
            </Label>
            <div
              className={
                field.state.meta.errors?.length
                  ? "ring-2 ring-red-500 rounded-lg p-2"
                  : ""
              }
            >
              <RangeRating
                rating={field.state.value}
                onRate={rating =>
                  field.handleChange(rating)
                }
              />
            </div>
            {field.state.meta.errors &&
              field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="font-medium">⚠️</span>
                  {field.state.meta.errors[0]}
                </p>
              )}
          </div>
        )}
      />
      <form.Field
        name="flavorProfiles"
        mode="array"
        validators={{
          onChange: ({ value }) =>
            value.length === 0
              ? "Виберіть хоча б один смаковий профіль"
              : undefined,
        }}
        children={field => (
          <div>
            <Label className="mb-2">
              Смакові Профілі{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div
              className={
                field.state.meta.errors?.length
                  ? "ring-2 ring-red-500 rounded-lg p-2"
                  : ""
              }
            >
              <FlavorProfiles
                value={field.state.value}
                onChange={value =>
                  field.handleChange(value)
                }
              />
            </div>
            {field.state.meta.errors &&
              field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="font-medium">⚠️</span>
                  {field.state.meta.errors[0]}
                </p>
              )}
          </div>
        )}
      />
      <form.Field
        name="presentationStyle"
        validators={{
          onChange: ({ value }) =>
            value === null
              ? "Виберіть стиль подачі"
              : undefined,
        }}
        children={field => (
          <div>
            <Label className="mb-2">
              Стиль Подачі{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div
              className={
                field.state.meta.errors?.length
                  ? "ring-2 ring-red-500 rounded-lg p-2"
                  : ""
              }
            >
              <PresentationStyle
                value={field.state.value}
                onChange={value =>
                  field.handleChange(value)
                }
              />
            </div>
            {field.state.meta.errors &&
              field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="font-medium">⚠️</span>
                  {field.state.meta.errors[0]}
                </p>
              )}
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
      <form.Subscribe
        selector={state => [
          state.canSubmit,
          state.isSubmitting,
        ]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={() => navigate({ to: "/" })}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-1/2"
              disabled={!canSubmit || isSubmitting}
            >
              <SaveIcon className="w-4 h-4" />
              {isSubmitting
                ? "Збереження..."
                : "Зберегти Оцінку"}
            </Button>
          </div>
        )}
      />
    </form>
  );
};
