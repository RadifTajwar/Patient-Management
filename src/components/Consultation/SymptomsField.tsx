import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SymptomsField({ form }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Symptoms comma separated"
          {...form.register("symptoms")}
        />
      </CardContent>
    </Card>
  );
}
