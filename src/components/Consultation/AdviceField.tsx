import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdviceField({ form }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Advice</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Advice" {...form.register("advice")} />
      </CardContent>
    </Card>
  );
}
