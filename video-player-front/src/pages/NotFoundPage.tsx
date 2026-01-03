import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/primitives/button";
import { Home } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">
          Сторінку не знайдено
        </h2>
        <p className="text-muted-foreground text-lg">
          Вибачте, але сторінка, яку ви шукаєте, не існує.
        </p>
      </div>
      <Link to="/">
        <Button size="lg" className="mt-4">
          <Home className="w-5 h-5 mr-2" />
          Повернутися на головну
        </Button>
      </Link>
    </div>
  );
};
