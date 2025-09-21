import { Input } from "@/shared/ui/primitives/input";
import { Search } from "lucide-react";

export const SearchInput = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (search: string) => void;
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        placeholder="Пошук пива, пивоварень або типів..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="pl-12 pr-4 py-3 h-12 text-base rounded-lg border border-input bg-background
         placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent 
         transition-all duration-200"
        type="search"
        aria-label="Пошук пива"
      />
    </div>
  );
};
