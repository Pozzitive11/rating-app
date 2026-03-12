import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import { InfoBlock, Separator } from "@/shared/ui";
import { UserRatingBlock } from "./UserRatingBlock";
import { CommunityRatingBlock } from "./CommunityRatingBlock";
import { UntappdRatingBlock } from "./UntappdRatingBlock";
import type { UserRatingResponse } from "@/api/types";

interface RatingSectionProps {
  beerId: number;
  userRating?: UserRatingResponse | null;
  community: {
    communityRating: number | null;
    communityNumberOfRatings: number;
  };
  untappd: {
    untappdRating: number | null;
    untappdNumberOfRatings: number | null;
  };
  isLoading?: boolean;
  error?: Error | null;
}

export const RatingSection = ({
  beerId,
  userRating,
  community,
  untappd,
  isLoading,
  error,
}: RatingSectionProps) => {
  if (isLoading) {
    return (
      <InfoBlock
        title="Завантаження оцінки..."
        variant="loading"
      />
    );
  }
  if (error) {
    return (
      <InfoBlock
        title={error.message}
        variant="error"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Моя оцінка
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserRatingBlock
          beerId={beerId}
          userRating={userRating?.rating}
          rateDate={userRating?.createdAt}
        />
        <Separator className="my-4" />
        <CommunityRatingBlock
          communityRating={community.communityRating}
          numberOfRatings={community.communityNumberOfRatings}
        />
        <Separator className="my-4" />
        <UntappdRatingBlock
          untappdRating={untappd.untappdRating}
          untappdNumberOfRatings={untappd.untappdNumberOfRatings}
        />
      </CardContent>
    </Card>
  );
};
