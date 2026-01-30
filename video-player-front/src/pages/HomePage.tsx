import { useMemo, useState } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Tabs } from "@/shared/ui/Tabs";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";
import { getMyAllRatings, type Beer } from "@/api/beer/api";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/features/beer-search/components/SearchInput";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import { InfoBlock } from "@/shared/ui";
import { isEmpty } from "@/shared/utils";

export const HomePage = () => {
  const [selectedBeer, setSelectedBeer] =
    useState<Beer | null>(null);
  const [ratingsSearchTerm, setRatingsSearchTerm] =
    useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    showLoadingState,
    showResultsList,
    searchError,
  } = useSearchBeer();

  const {
    data: myRatings = [],
    isLoading: isRatingsLoading,
    error: ratingsError,
  } = useQuery({
    queryKey: ["my-ratings"],
    queryFn: getMyAllRatings,
    staleTime: 2 * 60 * 1000,
  });

  const activeTab = location.pathname.startsWith("/my-ratings")
    ? "ratings"
    : "search";

  const filteredRatings = useMemo(() => {
    if (isEmpty(ratingsSearchTerm)) {
      return myRatings;
    }
    const term = ratingsSearchTerm.toLowerCase();
    return myRatings.filter(beer =>
      [beer.name, beer.brewery, beer.style].some(value =>
        (value || "").toLowerCase().includes(term)
      )
    );
  }, [myRatings, ratingsSearchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "ratings") {
      navigate({ to: "/my-ratings" });
      return;
    }
    navigate({ to: "/" });
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">
          🍺 Beer Rater
        </h1>
        <p className="text-muted-foreground text-responsive">
          Відкривай та оцінюй свої улюблені сорти пива
        </p>
      </header>

      <div className="mb-8">
        <Link to="/search">
          <Button
            className="w-full h-10 text-lg font-semibold bg-primary cursor-pointer"
            size="lg"
          >
            <Plus className="w-8 h-8" />
            Додати нову оцінку
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}

          tabs={[
            { label: "Пошук", value: "search" },
            {
              label: `Мої оцінки (${myRatings.length})`,
              value: "ratings",
            },
          ]}
        />
      </div>

      {activeTab === "search" && (
        <BeerSearchResults
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          showLoadingState={showLoadingState}
          showResultsList={showResultsList}
          selectedBeer={selectedBeer}
          searchResults={searchResults}
          handleBeerSelect={handleBeerSelect}
          searchError={searchError?.message}
          linkTo="/beer-details/$beerId"
        />
      )}

      {activeTab === "ratings" && (
        <div>
          <div className="mb-4">
            <SearchInput
              searchTerm={ratingsSearchTerm}
              setSearchTerm={setRatingsSearchTerm}
            />
          </div>

          {isRatingsLoading && (
            <InfoBlock
              variant="loading"
              title="Завантаження оцінок..."
            />
          )}

          {!isRatingsLoading && ratingsError && (
            <InfoBlock
              variant="error"
              title="Не вдалося завантажити оцінки"
              description="Спробуйте оновити сторінку"
            />
          )}

          {!isRatingsLoading &&
            !ratingsError &&
            filteredRatings.length === 0 && (
              <InfoBlock
                variant="info"
                title="Оцінок не знайдено"
                description={
                  isEmpty(ratingsSearchTerm)
                    ? "Додайте першу оцінку через кнопку вище"
                    : "Спробуйте змінити запит пошуку"
                }
              />
            )}

          {!isRatingsLoading &&
            !ratingsError &&
            filteredRatings.length > 0 && (
              <div className="mb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">
                    Знайдено {filteredRatings.length} результат(ів):
                  </h3>
                </div>
                <ul className="space-y-2 max-h-[700px] overflow-y-auto list-none">
                  {filteredRatings.map(beer => (
                    <li className="list-none" key={beer.id}>
                      <Link
                        to="/beer-details/$beerId"
                        params={{ beerId: beer.id.toString() }}
                      >
                        <BeerListItem beer={beer} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </>
  );
};
