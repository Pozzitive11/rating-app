import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";

export const AboutSection = ({
  description,
}: {
  description: string | null;
}) => {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-lg">Про Пиво</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description || "Опис відсутній"}</p>
      </CardContent>
    </Card>
  );
};
