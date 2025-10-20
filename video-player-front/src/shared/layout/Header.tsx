import { User } from "lucide-react";
import { Button } from "../ui";

const Header = () => {
  const handleLoginClick = () => {
    // TODO: Implement login/register logic
    console.log("Login/Register clicked");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">
              Beer Rating
            </h1>
          </div>

          {/* Login/Register Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLoginClick}
            aria-label="Login or Register"
          >
            <User className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;
