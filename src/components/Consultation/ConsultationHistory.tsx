import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, processISOString } from "@/utils/helper";

export default function ConsultationHistory({
  consultations,
  onView,
}: {
  consultations: any[];
  onView: (id: number) => void;
}) {
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "new patient":
        return "bg-yellow-100 text-yellow-800";
      case "follow up":
        return "bg-blue-100 text-blue-800";
      case "special checkup":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-sm mt-6">
      <CardHeader className="pb-2 mb-6">
        <CardTitle>Consultation History</CardTitle>
      </CardHeader>

      <CardContent>
        {consultations?.length === 0 ? (
          <p className="text-gray-500">No Consultation History Available.</p>
        ) : (
          <ScrollArea
            className={
              consultations.length > 3 ? "h-80 pr-4" : "max-h-full pr-4"
            }
          >
            <div className="space-y-4">
              {consultations.map((record) => (
                <Card key={record.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <Badge className="bg-gray-100 text-gray-800">
                          {processISOString(record.dateTime)}
                        </Badge>

                        <Badge>{record.disease}</Badge>

                        <Badge
                          className={getStatusColor(record.appointmentStatus)}
                        >
                          {record.appointmentStatus}
                        </Badge>

                        <Badge className={getTypeColor(record.consultType)}>
                          {record.consultType}
                        </Badge>
                      </div>

                      <Button
                        onClick={() => onView(record.id)}
                        className="self-end md:self-center bg-black hover:bg-blue-700 text-white"
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
