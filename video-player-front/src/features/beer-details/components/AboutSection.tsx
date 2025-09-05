import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";

export default function AboutSection({ description }: { description: string }) {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-lg">Про Пиво</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
