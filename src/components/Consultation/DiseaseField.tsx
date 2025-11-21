import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DiseaseField({ form }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Disease</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Disease" {...form.register("disease")} />
      </CardContent>
    </Card>
  );
}
