import { User, LogOut } from "lucide-react";
import { Button } from "../ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/primitives/popover";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";

const Header = () => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (err) {
    } finally {
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-lg font-semibold">
              Beer Rating
            </Link>
          </div>

          {/* Login/Register Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Login or Register"
              >
                <User className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-40 p-1"
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={handleLogoutClick}
                disabled={isLoading}
              >
                <LogOut className="size-4" />
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
export default Header;
