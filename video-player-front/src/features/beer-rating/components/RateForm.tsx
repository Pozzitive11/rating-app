import { Camera, SaveIcon } from "lucide-react";
import { FlavorProfiles } from "@/features/beer-rating/components/FlavorProfiles";
import { Input } from "@/shared/ui/primitives/input";
import { Textarea } from "@/shared/ui/primitives/textarea";
import { PresentationStyle } from "@/features/beer-rating/components/PresentationStyle";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button, FieldWrapper } from "@/shared/ui";
import { RangeRating } from "./range-rating/RangeRating";
import { isEmpty } from "@/shared/utils";

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
  isUploading,
}: {
  onSubmit: (value: RateFormValues) => void;
  isUploading: boolean;
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
          <FieldWrapper
            label="Ваша оцінка"
            required
            errors={field.state.meta.errors}
            htmlFor="rating"
          >
            <RangeRating
              rating={field.state.value}
              onRate={rating => field.handleChange(rating)}
            />
          </FieldWrapper>
        )}
      />
      <form.Field
        name="flavorProfiles"
        mode="array"
        validators={{
          onChange: ({ value }) =>
            isEmpty(value)
              ? "Виберіть хоча б один смаковий профіль"
              : undefined,
        }}
        children={field => (
          <FieldWrapper
            label="Смакові Профілі"
            required
            errors={field.state.meta.errors}
            htmlFor="flavorProfiles"
          >
            <FlavorProfiles
              value={field.state.value}
              onChange={value => field.handleChange(value)}
              aria-invalid={!isEmpty(field.state.meta.errors)}
            />
          </FieldWrapper>
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
          <FieldWrapper
            label="Стиль Подачі"
            required
            errors={field.state.meta.errors}
            htmlFor="presentationStyle"
          >
            <PresentationStyle
              value={field.state.value}
              onChange={value => field.handleChange(value)}
            />
          </FieldWrapper>
        )}
      />
      <form.Field
        name="location"
        children={field => (
          <FieldWrapper
            label="Місце"
            errors={field.state.meta.errors}
            htmlFor="location"
          >
            <Input
              id="location"
              type="text"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Де ти пив це пиво?"
              aria-invalid={!isEmpty(field.state.meta.errors)}
            />
          </FieldWrapper>
        )}
      />
      <form.Field
        name="comment"
        children={field => (
          <FieldWrapper
            label="Коментар"
            errors={field.state.meta.errors}
            htmlFor="comment"
          >
            <Textarea
              id="comment"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Що ти думаєш про це пиво?"
              aria-invalid={!isEmpty(field.state.meta.errors)}
            />
          </FieldWrapper>
        )}
      />
      <form.Field
        name="photos"
        mode="array"
        children={() => (
          // <FieldWrapper
          //   label="Фото"
          //   errors={field.state.meta.errors}
          //   htmlFor="photos"
          // >
          //   <div className="relative">
          //     <input
          //       id="photos"
          //       type="file"
          //       multiple
          //       accept="image/*"
          //       onChange={e => {
          //         const files = e.target.files;
          //         if (files) {
          //           field.handleChange(Array.from(files));
          //         }
          //       }}
          //       onBlur={field.handleBlur}
          //       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          //       aria-invalid={!isEmpty(field.state.meta.errors)}
          //     />
          //     <div className="flex items-center justify-center gap-2 w-full h-10 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
          //       <Camera className="w-5 h-5 text-black" />
          //       <span className="text-black font-medium">
          //         Додати Фото
          //       </span>
          //     </div>
          //   </div>
          // </FieldWrapper>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium mb-1">
              Завантаження фото
            </p>
            <p className="text-xs text-gray-500">
              Функціонал буде реалізовано пізніше
            </p>
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
              isLoading={isUploading}
              icon={<SaveIcon className="w-4 h-4" />}
            >
              Зберегти Оцінку
            </Button>
          </div>
        )}
      />
    </form>
  );
};
