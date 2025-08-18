import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
import {
  Mic,
  MicOff,
  FileText,
  FileIcon,
  Check,
  Play,
  Plus,
  X,
  CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import ConsultationDetailsModal from "@/components/ConsultationDetailsModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { allConsultations, updateConsultation } from "../api/consultation";

interface ConsultationFormValues {
  bloodPressure: string;
  bloodSugar: string;
  temperature: string;
  symptoms: string;
  recommendedTests: string[];
  reportComments: string;
  advice: string;
  medicines: { name: string; quantity: string; duration: string }[];
  doctorNotes: string;
  recovered: string;
  disease: string;
  followUpDate?: Date;
}

export interface ConsultationInfo {
  id: number;
  patientId: number;
  consultlocation: string;
  consultType: string;
  dateTime: string;
  patientCondition: string;
  consultFee: number;
  appointmentStatus: string;
  audioURL: string;
  medicalTests: string;
  medicalReports: string;
  reportComments: string;
  patientAdvice: string;
  medicine: string;
  doctorNotes: string;
  recoveryStatus: number;
  disease: string;
  followUp: string;
  medicalFiles: string;
}

const ConsultationPage = () => {
  const location = useLocation();
  const {
    name,
    age,
    sex,
    phone,
    email,
    height,
    weight,
    bloodGroup,
    dob,
    address,
    imageURL,
    id,
    patientId,
    consultlocation,
    consultType,
    dateTime,
    appointmentStatus,
    patientCondition,
  } = location.state || {};

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [tests, setTests] = useState<string[]>([]);
  const [testInput, setTestInput] = useState("");
  const [files, setFiles] = useState<{ name: string; file: File }[]>([]);
  const [fileInput, setFileInput] = useState("");
  const [medicines, setMedicines] = useState<
    { name: string; quantity: string; duration: string }[]
  >([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [medicineDuration, setMedicineDuration] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationInfo | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] =
    useState<boolean>(false);

  const [consultations, setConsultations] = useState<ConsultationInfo[]>([]);

  const [followupDate, setFollowupDate] = useState<Date | undefined>(undefined);

  const fetchConsultations = async (id, patientId) => {
    try {
      const response = await allConsultations(id, patientId);
      console.log(response.data);
      setConsultations(response.data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const updateConsultations = async (data) => {
    try {
      console.log(data);
      const response = await updateConsultation(data);

      toast({
        title: "Consultation Updated Successfully",
        description: `Consultation update success.`,
      });
    } catch (error) {
      toast({
        title: "Consultation Update Failed",
        description: `Consultation update failed.`,
      });
    }
  };

  useEffect(() => {
    fetchConsultations(id, patientId);
  }, []);

  const form = useForm<ConsultationFormValues>({
    defaultValues: {
      bloodPressure: "",
      bloodSugar: "",
      temperature: "",
      symptoms: "",
      recommendedTests: [],
      reportComments: "",
      advice: "",
      medicines: [],
      doctorNotes: "",
      recovered: "",
      disease: "",
    },
  });

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // In a real app, this would save the audio file
      // For demo purposes, we'll set a dummy audio URL
      setRecordedAudio(
        "https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3"
      );

      toast({
        title: "Recording stopped",
        description: `Audio recording saved (${recordingTime} seconds)`,
      });
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedAudio(null);
      setIsPlaying(false);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };



  const handleViewConsultationDetails = (consultationId: number) => {
    const consultationInfo = consultations.find((e) => e.id === consultationId);

    if (consultationInfo) {
      setSelectedConsultation(consultationInfo);
      setIsConsultationModalOpen(true);
    } else {
      toast({
        title: "Consultation Details",
        description: `Consultation ${consultationId} details not found.`,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (fileInput.trim() && file) {
        setFiles([...files, { name: fileInput.trim(), file }]);
        setFileInput("");
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`,
        });

        // Reset the file input to allow uploading another file with the same name
        const fileInputElement = document.getElementById(
          "reportFile"
        ) as HTMLInputElement;
        if (fileInputElement) fileInputElement.value = "";
      } else {
        toast({
          title: "Missing information",
          description: "Please provide a name for the file",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    if (
      medicineName.trim() &&
      medicineQuantity.trim() &&
      medicineDuration.trim()
    ) {
      setMedicines([
        ...medicines,
        {
          name: medicineName.trim(),
          quantity: medicineQuantity.trim(),
          duration: medicineDuration.trim(),
        },
      ]);
      setMedicineName("");
      setMedicineQuantity("");
      setMedicineDuration("");
    } else {
      toast({
        title: "Missing information",
        description: "Please provide both medicine name and quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Reference to the consultation summary for PDF generation
  const consultationSummaryRef = useRef<HTMLDivElement>(null);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new patient":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "follow up":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "special checkup":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleGeneratePDF = (data: ConsultationFormValues) => {
    // Create a temporary container for PDF content
    if (!consultationSummaryRef.current) return;

    const element = consultationSummaryRef.current;
    const options = {
      margin: 10,
      filename: `consultation_${name}_${format(new Date(), "yyyy-MM-dd")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        toast({
          title: "PDF Generated",
          description: "Consultation PDF has been generated and downloaded",
        });
      });
  };

  const onSubmit = async (data: ConsultationFormValues) => {
    const finalData = {
      ...data,
      recommendedTests: tests,
      medicines,
      files: files.map((f) => ({ name: f.name, fileName: f.file.name })),
    };

    const patientData =
      data.bloodPressure +
      "\n" +
      data.bloodSugar +
      "\n" +
      data.temperature +
      "\n" +
      data.symptoms;

    const medicaltests = tests.join("\n");
    const medicalreports = files.map((obj) => obj.name).join("\n");
    const medicalfiles = files.map((obj) => obj.file.name).join("\n");
    const medicinenames = medicines.map((obj) => obj.name).join("\n");
    const medicinequantity = medicines.map((obj) => obj.quantity).join("\n");
    const medicienduration = medicines.map((obj) => obj.duration).join("\n");
    const medicinedata =
      medicinenames + "/n" + medicinequantity + "/n" + medicienduration;

    const updateData = {
      id: id,
      patientId: patientId,
      patientCondition: patientData,
      appointmentStatus: "Completed",
      audioURL: "http://google.com",
      medicalTests: medicaltests,
      medicalReports: medicalreports,
      medicalFiles: medicalfiles,
      reportComments: data.reportComments,
      patientAdvice: data.advice,
      medicine: medicinedata,
      doctorNotes: data.doctorNotes,
      recoveryStatus: data.recovered === "yes" ? 1 : 0,
      disease: data.disease,
      followUp: followupDate.toISOString(),
      consulationDate: dateTime,
    };

    await updateConsultations(updateData);
    // Generate PDF before navigating away
    //handleGeneratePDF(finalData);

    // Navigate back to appointments after a short delay to allow PDF generation
    //setTimeout(() => {navigate("/appointments");}, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const processISOString = (date: string) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const time = date.substring(11, 16);

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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        {/* Patient Information Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Patient Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={imageURL} alt={name} />
                <AvatarFallback className="text-xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 flex-1">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p>{age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sex</p>
                  <p>{sex}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p>{bloodGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p>{height} ft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p>{weight} lb</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{processISOString(dob)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{consultlocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p>{phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation History Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2" style={{ marginBottom: "30px" }}>
            <CardTitle>Consultation History</CardTitle>
          </CardHeader>
          <CardContent>
            {consultations?.length === 0 ? (
              <p className="text-gray-500">
                No Consultation History Available.
              </p>
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
                            <div className="space-y-1">
                              <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
                                {processISOString(record.dateTime)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                {record.disease}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <Badge
                                className={getStatusColor(
                                  record.appointmentStatus
                                )}
                              >
                                {record.appointmentStatus}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <Badge
                                className={getTypeColor(record.consultType)}
                              >
                                {record.consultType}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              handleViewConsultationDetails(record.id)
                            }
                            variant="outline"
                            className="self-end md:self-center shrink-0 bg-black hover:bg-blue-700 text-white hover:text-white"
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            

            {/* Prescription Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Prescription name"
                      value={fileInput}
                      onChange={(e) => setFileInput(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("reportFile")?.click()
                    }
                    className="whitespace-nowrap"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Add Prescription
                  </Button>
                  <Input
                    type="file"
                    id="reportFile"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-2 mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Prescriptions:
                    </h4>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <FileIcon className="h-4 w-4 mr-2" />
                            <span>
                              {file.name} - {file.file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" /> Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Medical Reports Section  */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Medical Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Report name/type"
                      value={fileInput}
                      onChange={(e) => setFileInput(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("reportFile")?.click()
                    }
                    className="whitespace-nowrap"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Add Medical Report
                  </Button>
                  <Input
                    type="file"
                    id="reportFile"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-2 mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Reports:
                    </h4>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <FileIcon className="h-4 w-4 mr-2" />
                            <span>
                              {file.name} - {file.file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" /> Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Disease Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Disease</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Disease name"
                  id="disease"
                  {...form.register("disease")}
                />
              </CardContent>
            </Card>

            {/* Consultation Fee Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Consultation Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Consultation fee"
                  id="consultationFee"
                  {...form.register("disease")}
                />
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Check className="mr-2 h-4 w-4" /> Complete Consultation
              </Button>
            </div>
          </form>
        </Form>

        {/* Hidden consultation summary for PDF generation */}
        <div className="hidden">
          <div ref={consultationSummaryRef} className="p-8 bg-white">
            <h1 className="text-2xl font-bold mb-6">Consultation Summary</h1>

            {/* Patient Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Patient Information
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Age:</strong> {age} years
                </p>
                <p>
                  <strong>Sex:</strong> {sex}
                </p>
                <p>
                  <strong>Blood Group:</strong> {bloodGroup}
                </p>
                <p>
                  <strong>Height:</strong> {height}
                </p>
                <p>
                  <strong>Weight:</strong> {weight}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {dob}
                </p>
                <p>
                  <strong>Contact Number:</strong> {phone}
                </p>
              </div>
            </div>

            {/* Vitals */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Vitals</h2>
              <div className="grid grid-cols-3 gap-2">
                <p>
                  <strong>Blood Pressure:</strong>{" "}
                  {form.getValues("bloodPressure") || "Not recorded"}
                </p>
                <p>
                  <strong>Blood Sugar:</strong>{" "}
                  {form.getValues("bloodSugar") || "Not recorded"}
                </p>
                <p>
                  <strong>Temperature:</strong>{" "}
                  {form.getValues("temperature") || "Not recorded"}
                </p>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Symptoms</h2>
              <p>{form.getValues("symptoms") || "No symptoms recorded"}</p>
            </div>

            {/* Recommended Tests */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recommended Tests</h2>
              {tests.length > 0 ? (
                <ul className="list-disc pl-5">
                  {tests.map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
              ) : (
                <p>No tests recommended</p>
              )}
            </div>

            {/* Reports */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Medical Reports</h2>
              {files.length > 0 ? (
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name} - {file.file.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reports uploaded</p>
              )}
              {form.getValues("reportComments") && (
                <div className="mt-2">
                  <p>
                    <strong>Comments:</strong>{" "}
                    {form.getValues("reportComments")}
                  </p>
                </div>
              )}
            </div>

            {/* Prescribed Medicines */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Prescribed Medicines
              </h2>
              {medicines.length > 0 ? (
                <ul className="list-disc pl-5">
                  {medicines.map((medicine, index) => (
                    <li key={index}>
                      {medicine.name} - {medicine.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No medicines prescribed</p>
              )}
            </div>

            {/* Disease */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Disease</h2>
              <p>{form.getValues("disease") || "Unknown"}</p>
            </div>

            {/* Advice */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Patient Advice</h2>
              <p>{form.getValues("advice") || "No advice provided"}</p>
            </div>

            {/* Recovery Status */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recovery Status</h2>
              <p>
                <strong>Status:</strong>{" "}
                {form.getValues("recovered") === "yes"
                  ? "Recovered"
                  : "Not Recovered"}
              </p>
              {form.getValues("followUpDate") && (
                <p>
                  <strong>Follow-up Date:</strong>{" "}
                  {format(form.getValues("followUpDate") as Date, "PPP")}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t">
              <p>Generated on {format(new Date(), "PPP 'at' p")}</p>
            </div>
          </div>
        </div>
      </div>

      <ConsultationDetailsModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        consultation={selectedConsultation}
      />
    </div>
  );
};

export default ConsultationPage;
