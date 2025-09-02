import { ArrowLeftIcon, Camera, SaveIcon, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/SearchInput";
import BeerItemBig from "@/components/BeerItemBig";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import type { Beer } from "@/lib/api";
import { searchBeers } from "@/lib/api";
import { RangeRating } from "@/components/RangeRating";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PresentationStyle } from "./components/PresentationStyle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FlavorProfiles from "./components/FlavorProfiles";
import BeerSmallItem from "@/components/BeerSmallItem";

export default function RateBeerPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Clear selected beer when search is cleared
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSelectedBeer(null);
    }
  }, [searchTerm]);

  // React Query for beer search
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["searchBeers", debouncedSearchTerm],
    queryFn: () => searchBeers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null); // Reset selected beer when search changes
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  const form = useForm({
    defaultValues: {
      rating: 0,
      flavorProfiles: [] as string[],
      presentationStyle: "",
      location: "",
      comment: "",
      photos: [] as File[],
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <div
        className="text-2xl font-bold flex items-center gap-2 mb-4"
        onClick={() => navigate({ to: "/" })}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Оцінити Пиво
      </div>
      <div className="mb-4">
        <SearchInput searchTerm={searchTerm} setSearchTerm={handleSearch} />
      </div>

      {/* Loading state */}
      {(isSearching ||
        (searchTerm.length > 0 && searchTerm !== debouncedSearchTerm)) && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-lg mb-4">
          Пошук пива...
        </div>
      )}

      {/* Error state */}
      {searchError &&
        debouncedSearchTerm.length > 0 &&
        !isSearching &&
        searchTerm === debouncedSearchTerm && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-4">
            Помилка пошуку: {searchError.message}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchSearch()}
              className="ml-2"
            >
              Спробувати знову
            </Button>
          </div>
        )}

      {/* Search results list */}
      {searchResults.length > 0 &&
        debouncedSearchTerm.length > 0 &&
        !isSearching &&
        searchTerm === debouncedSearchTerm && (
          <div className="mb-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold">
                Знайдено {searchResults.length} результат(ів):
              </h3>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((beer, index) => (
                <li className="list-none" key={index}>
                  <BeerSmallItem beer={beer} />
                </li>
              ))}
            </div>
          </div>
        )}

      {/* Selected beer details */}
      {selectedBeer && (
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Обране пиво для оцінки:</h3>
          </div>
          <BeerItemBig beer={selectedBeer} />
        </div>
      )}

      {/* No results */}
      {debouncedSearchTerm.length > 0 &&
        searchResults.length === 0 &&
        !isSearching &&
        !searchError &&
        searchTerm === debouncedSearchTerm && (
          <div className="text-center text-muted-foreground bg-muted p-4 rounded-lg mb-4">
            Пиво не знайдено
          </div>
        )}

      {/* Rating form - only show when beer is selected */}
      {selectedBeer && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          <form.Field
            name="rating"
            children={(field) => (
              <div>
                <Label className="mb-2">Ваша оцінка</Label>
                <RangeRating
                  rating={field.state.value}
                  onRate={(rating) => field.handleChange(rating)}
                />
              </div>
            )}
          />
          <form.Field
            name="flavorProfiles"
            mode="array"
            children={(field) => (
              <div>
                <Label className="mb-2">Смакові Профілі</Label>
                <FlavorProfiles
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                />
              </div>
            )}
          />
          <form.Field
            name="presentationStyle"
            children={(field) => (
              <div>
                <Label className="mb-2">Стиль Подачі</Label>
                <PresentationStyle
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                />
              </div>
            )}
          />
          <form.Field
            name="location"
            children={(field) => (
              <div>
                <Label className="mb-2">Місце</Label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Де ти пив це пиво?"
                />
              </div>
            )}
          />
          <form.Field
            name="comment"
            children={(field) => (
              <div>
                <Label className="mb-2">Коментар</Label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Що ти думаєш про це пиво?"
                />
              </div>
            )}
          />
          <form.Field
            name="photos"
            mode="array"
            children={(field) => (
              <div>
                <Label className="mb-2">Фото</Label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        field.handleChange(Array.from(files));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 w-full h-10 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <Camera className="w-5 h-5 text-black" />
                    <span className="text-black font-medium">Додати Фото</span>
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
            <Button type="submit" variant="default" className="w-1/2">
              <SaveIcon className="w-4 h-4" />
              Зберегти Оцінку
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
