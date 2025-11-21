import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileAudio,
  FileImage,
  Calendar,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { ConsultationInfo } from "@/interface/AllInterfaces";

interface ConsultationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: ConsultationInfo | null;
}

const ConsultationDetailsModal: React.FC<ConsultationDetailsModalProps> = ({
  isOpen,
  onClose,
  consultation,
}) => {
  if (!consultation) {
    return null;
  }

  const [medicineNames, setMedicineNames] = useState<string[]>([]);
  const [medicineQuantity, setMedicineQuantity] = useState<string[]>([]);
  const [medicineDuration, setMedicineDuration] = useState<string[]>([]);
  const [medicalTests, setMedicalTests] = useState<string[]>([]);
  const [medicalReports, setMedicalReports] = useState<string[]>([]);
  const [medicalFiles, setMedicalFiles] = useState<string>("");
  const [patientVitals, setPatientVitals] = useState<string[]>([]);
  const [patientCondition, setPatientCondition] = useState<string>("");
  const [prescription, setPrescription] = useState<string>("");
  useEffect(() => {
    setPrescription(consultation?.prescription);
  }, [consultation]);

  const processISOString = (date: string) => {
    const year = date?.substring(0, 4);
    const month = date?.substring(5, 7);
    const day = date?.substring(8, 10);
    const time = date?.substring(11, 16);

    let monthName = "";
    switch (month) {
      case "01":
        monthName = "January";
        break;
      case "02":
        monthName = "February";
        break;
      case "03":
        monthName = "March";
        break;
      case "04":
        monthName = "April";
        break;
      case "05":
        monthName = "May";
        break;
      case "06":
        monthName = "June";
        break;
      case "07":
        monthName = "July";
        break;
      case "08":
        monthName = "August";
        break;
      case "09":
        monthName = "September";
        break;
      case "10":
        monthName = "October";
        break;
      case "11":
        monthName = "November";
        break;
      case "12":
        monthName = "December";
        break;
    }

    const dateFormat = day + " " + monthName + ", " + year + "  " + time;

    return dateFormat;
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = url?.split("/").pop() || "prescription.pdf"; // use filename from URL
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consultation Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Consultation Info */}
            <div className="flex flex-wrap justify-between gap-2 pb-3 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {processISOString(consultation?.dateTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disease</p>
                <p>{consultation?.disease}</p>
              </div>
              <div>
                <Badge
                  className={
                    Number(consultation?.recoveryStatus) === 1
                      ? "bg-green-600"
                      : "bg-amber-500"
                  }
                >
                  {Number(consultation?.recoveryStatus) === 1
                    ? "Recovered"
                    : "Not Recovered"}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start rounded-full">
                <TabsTrigger className="rounded-full" value="details">
                  Details
                </TabsTrigger>
                <TabsTrigger className="rounded-full" value="medications">
                  Medications
                </TabsTrigger>
                <TabsTrigger className="rounded-full" value="records">
                  Prescription
                </TabsTrigger>
                <TabsTrigger className="rounded-full" value="followup">
                  Follow-up
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="pt-4 space-y-4">
                {consultation.patientCondition && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3">
                        Patient Condition & Symptoms
                      </h3>
                      {consultation.patientCondition && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Condition</p>
                          <p>{consultation.patientCondition}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {consultation?.audioURL && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        Consultation Recording
                      </h3>
                      <audio controls className="w-full">
                        <source src={consultation.audioURL} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </CardContent>
                  </Card>
                )}

                {consultation?.reportComments && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3">Doctor's Comments</h3>
                      <p className="whitespace-pre-line">
                        {consultation.reportComments}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {consultation?.patientAdvice && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3">Advice for Patient</h3>
                      <p className="whitespace-pre-line">
                        {consultation.patientAdvice}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Medications Tab */}
              <TabsContent value="medications" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-3">Prescribed Medications</h3>
                    {consultation?.medicine && medicineNames?.length > 0 ? (
                      <div className="space-y-4">
                        {medicineNames?.map((med, index) => (
                          <div
                            key={index}
                            className="border-b pb-3 last:border-b-0 last:pb-0"
                          >
                            <p className="font-medium">{med}</p>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div>
                                <p className="text-sm text-gray-500">Dosage</p>
                                <p>{medicineQuantity[index]}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Duration
                                </p>
                                <p>{medicineDuration[index]}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{"No medications prescribed"}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Medical Records Tab */}
              <TabsContent value="records" className="pt-4 space-y-4">
                {consultation?.prescription &&
                  consultation?.prescription?.length > 0 && (
                    <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          Prescription
                        </h3>
                        <div className="flex gap-3">
                          <a
                            href={consultation.prescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Open
                          </a>
                          <button
                            onClick={() =>
                              handleDownload(consultation.prescription)
                            }
                            className="text-green-600 hover:text-green-800 underline text-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div className="overflow-hidden rounded-b-lg">
                          <iframe
                            src={consultation.prescription}
                            width="100%"
                            height="500px"
                            className="border-t border-gray-200"
                            title="Prescription PDF"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {consultation?.medicalReports && medicalReports?.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <FileImage className="h-4 w-4" />
                        Medical Reports
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {medicalReports?.map((report, index) => (
                          <a
                            key={index}
                            href={report}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="flex-1 truncate">{report}</span>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Follow-up Tab */}
              <TabsContent value="followup" className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {consultation?.followUp && (
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Follow-up Date
                          </h3>
                          <p>{consultation?.followUp}</p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-2">Recovery Status</h3>
                        <Badge
                          className={
                            Number(consultation?.recoveryStatus) === 1
                              ? "bg-green-600"
                              : "bg-amber-500"
                          }
                        >
                          {Number(consultation?.recoveryStatus) === 1
                            ? "Recovered"
                            : "Not Recovered"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {consultation?.doctorNotes && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Doctor's Notes
                      </h3>
                      <p className="whitespace-pre-line">
                        {consultation?.doctorNotes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetailsModal;
