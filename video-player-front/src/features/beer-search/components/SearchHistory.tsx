import { X, Clock } from "lucide-react";

interface SearchHistoryProps {
  history: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

const SearchHistory = ({
  history,
  onSelect,
  onRemove,
}: SearchHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="animate-in fade-in-0 duration-200">
      <ul className="list-none divide-y divide-border/50">
        {history.map((term) => (
          <li
            key={term}
            className="flex items-center gap-3 py-3 px-1 cursor-pointer
             hover:bg-accent/50 transition-colors duration-150 rounded-md"
            onClick={() => onSelect(term)}
            aria-label={`Шукати "${term}"`}
          >
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm truncate">{term}</span>
            <button
              className="p-1 text-muted-foreground hover:text-destructive
               transition-colors duration-150 cursor-pointer shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
              aria-label={`Видалити "${term}" з історії`}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
