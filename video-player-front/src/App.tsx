import { useState } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { Plus } from "lucide-react";
import SearchInput from "./components/SearchInput";
import { mockBeers } from "./mock-data";
import BeerSmallItem from "./components/BeerSmallItem";
import { Link } from "@tanstack/react-router";
import { MainTabs } from "./shared/ui/Tabs";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  return (
    <>
      {/* Header Section with improved spacing */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">🍺 Beer Rater</h1>
        <p className="text-muted-foreground text-responsive">
          Відкривай та оцінюй свої улюблені сорти пива
        </p>
      </header>

      {/* Main Action Button with better spacing */}
      <div className="mb-8">
        <Link to="/rate-beer/$beerId" params={{ beerId: "new" }}>
          <Button
            className="w-full h-10 text-lg font-semibold bg-primary"
            size="lg"
          >
            <Plus className="w-8 h-8" />
            Додати нову оцінку
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <MainTabs
          ratedBeersNumber={0}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {activeTab === "search" && (
        <>
          <div className="mb-6">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="spacing-md">
            {mockBeers.map((beer) => (
              <BeerSmallItem key={beer.id} beer={beer} />
            ))}
          </div>
        </>
      )}

      {activeTab === "ratings" && (
        <div>
          <h1>My Ratings</h1>
        </div>
      )}
    </>
  );
}

export default App;
