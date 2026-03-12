import { useQuery } from "@tanstack/react-query";
import { getRandomBeers } from "@/api/beer/api";

export const useRandomBeers = () => {
  return useQuery({
    queryKey: ["randomBeers"],
    queryFn: getRandomBeers,
    // Refetching is disabled since we only want to fetch once when user lands on home page.
    // If they want to see new random beers they can just refresh. 
    // And staleTime is infinite so we don't spam the API.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export default useRandomBeers;
