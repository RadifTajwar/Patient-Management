import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* API */
import {
  getAllConsultationWithPatient,
  updateConsultation,
} from "../api/consultation";

/* Utils */
import { convertImagesToPDF } from "@/utils/convertImagesToPdf";
import compressImages from "@/utils/imageCompression";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getBMDC } from "@/utils/accessutils";

/* Interfaces */
import {
  ConsultationFormValues,
  ConsultationInfo,
} from "@/interface/AllInterfaces";

/* Helpers */
import { processISOString } from "@/utils/helper";

/* Components */
import PatientHeader from "@/components/Consultation/PatientHeader";
import ConsultationHistory from "@/components/Consultation/ConsultationHistory";
import PrescriptionImageUpload from "@/components/Consultation/PrescriptionImageUpload";
import ManualPrescription from "@/components/Consultation/ManualPrescription";
import SymptomsField from "@/components/Consultation/SymptomsField";
import DiseaseField from "@/components/Consultation/DiseaseField";
import AdviceField from "@/components/Consultation/AdviceField";
import FeeField from "@/components/Consultation/FeeField";
import SubmitButton from "@/components/Consultation/SubmitButton";
import ConsultationDetailsModal from "@/components/ConsultationDetailsModal";

/* NEW COMPONENT */
import ReportUpload from "@/components/Consultation/ReportUpload";

const ConsultationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------------------------- ROUTE PARAMS ---------------------------- */
  const pathParts = location.pathname.split("/");
  const patientId = pathParts[2];
  const consultationId = pathParts[3];

  /* ----------------------------- LOCAL STATE ---------------------------- */
  const prescriptionRef = useRef<HTMLDivElement | null>(null);

  const [files, setFiles] = useState<{ name: string; file: File }[]>([]);
  const [reportFiles, setReportFiles] = useState<
    { name: string; file: File }[]
  >([]);

  const [patient, setPatient] = useState<any>(null);
  const [consultations, setConsultations] = useState<ConsultationInfo[]>([]);

  /* Manual prescription data */
  const [medicines, setMedicines] = useState<
    { name: string; quantity: string; duration: string }[]
  >([]);

  const [medicineName, setMedicineName] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [medicineDuration, setMedicineDuration] = useState("");

  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationInfo | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] =
    useState<boolean>(false);

  const [showManualPrescription, setShowManualPrescription] = useState(false);

  /* ---------------------------- FETCH PATIENT + HISTORY ---------------------------- */
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await getAllConsultationWithPatient(
          consultationId,
          patientId
        );
        const data = response.data;

        setConsultations(data.consultations || []);
        setPatient(data.patient || null);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }
    };

    if (consultationId && patientId) fetchConsultations();
  }, [consultationId, patientId]);

  /* ----------------------------- HOOK FORM ----------------------------- */
  const form = useForm<ConsultationFormValues>({
    defaultValues: {
      id: consultationId,
      patientId: "",
      patientCondition: "",
      audioURL: "",
      medicalTests: "",
      medicalReports: "",
      medicalFiles: "",
      reportComments: "",
      patientAdvice: "",
      medicine: "",
      doctorNotes: "",
      recoveryStatus: "",
      disease: "",
      followUp: "",
      consulationDate: "",
      symptoms: "",
      advice: "",
      fee: "",
      prescription: "",
    },
  });

  /* -------------------------- FILE UPLOAD HANDLERS -------------------------- */
  const handleFileUpload = (fileList: FileList) => {
    const arr = Array.from(fileList);
    const fileObjects = arr.map((f) => ({ name: f.name, file: f }));

    setFiles((prev) => [...prev, ...fileObjects]);

    if (fileObjects.length > 0) {
      setShowManualPrescription(false);
      toast({
        title: "Prescription image added",
        description: "Manual prescription disabled automatically.",
      });
    }
  };

  /* NEW — Report upload handlers */
  const handleReportUpload = (fileList: FileList) => {
    const arr = Array.from(fileList);
    const fileObjects = arr.map((f) => ({ name: f.name, file: f }));
    setReportFiles((prev) => [...prev, ...fileObjects]);
  };

  const handleRemoveReport = (index: number) => {
    setReportFiles(reportFiles.filter((_, i) => i !== index));
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);

    if (updated.length === 0) {
      toast({
        title: "You can now use manual prescription",
      });
    }
  };

  /* ------------------------------ ADD MEDICINE ------------------------------ */
  const handleAddMedicine = () => {
    if (medicineName && medicineQuantity && medicineDuration) {
      setMedicines([
        ...medicines,
        {
          name: medicineName,
          quantity: medicineQuantity,
          duration: medicineDuration,
        },
      ]);

      setMedicineName("");
      setMedicineQuantity("");
      setMedicineDuration("");
    } else {
      toast({
        title: "Missing information",
        description: "Fill all medicine fields",
        variant: "destructive",
      });
    }
  };

  /* ----------------------- VIEW CONSULTATION DETAILS ----------------------- */
  const handleViewConsultationDetails = (id: number) => {
    const info = consultations.find((c) => c.id === id);
    setSelectedConsultation(info || null);
    setIsConsultationModalOpen(true);
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = async (data: ConsultationFormValues) => {
    const bmdc = await getBMDC();
    let prescriptionLink = data.prescription;
    let reportLink = "";
    let uploadSuccessful = false;

    try {
      /* -------------------------------------------------- */
      /* 🔹 CASE 1: PRESCRIPTION IMAGE UPLOAD (IMAGES → PDF) */
      /* -------------------------------------------------- */
      if (files.length > 0) {
        const originalPdfBlob = await new Promise<Blob>((resolve) => {
          convertImagesToPDF(files, (blob: Blob) => resolve(blob));
        });

        const compressedImages = await compressImages(files);

        const compressedPdfBlob = await new Promise<Blob>((resolve) => {
          convertImagesToPDF(compressedImages as any, (blob: Blob) =>
            resolve(blob)
          );
        });

        const arrayBuffer = await compressedPdfBlob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const finalBytes = await pdfDoc.save({ compress: true });

        const finalBlob = new Blob([finalBytes], {
          type: "application/pdf",
        });

        const uploadedUrl = await uploadToCloudinary(
          finalBlob,
          `${bmdc}/${data.id}/prescription`
        );

        if (uploadedUrl) {
          prescriptionLink = uploadedUrl;
          uploadSuccessful = true;
        }
      } else if (showManualPrescription && prescriptionRef.current) {

      /* -------------------------------------------------- */
      /* 🔹 CASE 2: MANUAL PRESCRIPTION (HTML → CANVAS → PDF) */
      /* -------------------------------------------------- */
        const canvas = await html2canvas(prescriptionRef.current, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#fff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.6);
        const pdf = new jsPDF("p", "mm", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, w, h, undefined, "FAST");

        const pdfBlob = pdf.output("blob");

        const uploadedUrl = await uploadToCloudinary(
          pdfBlob,
          `${bmdc}/${data.id}/prescription`
        );

        if (uploadedUrl) {
          prescriptionLink = uploadedUrl;
          uploadSuccessful = true;
        }
      }

      /* -------------------------------------------------- */
      /* ❌ IF NO UPLOAD HAPPENED */
      /* -------------------------------------------------- */
      if (!uploadSuccessful) {
        toast({
          title: "Upload failed",
          description: "Prescription was not uploaded",
          variant: "destructive",
        });
        return;
      }

      /* -------------------------------------------------- */
      /* 🔹 CASE 3: REPORT FILE UPLOAD */
      /* -------------------------------------------------- */
      if (reportFiles.length > 0) {
        const compressedReports = await compressImages(reportFiles);

        const reportPdfBlob = await new Promise<Blob>((resolve) => {
          convertImagesToPDF(compressedReports as any, (blob: Blob) =>
            resolve(blob)
          );
        });

        const arr = await reportPdfBlob.arrayBuffer();
        const reportPDF = await PDFDocument.load(arr);
        const reportBytes = await reportPDF.save({ compress: true });

        const finalReportBlob = new Blob([reportBytes], {
          type: "application/pdf",
        });

        const uploadedReportUrl = await uploadToCloudinary(
          finalReportBlob,
          `${bmdc}/${data.id}/report`
        );

        if (uploadedReportUrl) {
          reportLink = uploadedReportUrl;
        }
      }

      /* -------------------------------------------------- */
      /* 🔹 BUILD FINAL PAYLOAD */
      /* -------------------------------------------------- */
      const symptomsArray = data.symptoms
        ?.split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const payload = {
        ...data,
        symptoms: symptomsArray,
        prescription: prescriptionLink,
        report: reportLink,
        appointmentStatus: "completed", // ⭐ MARK CONSULTATION AS COMPLETED
      };

      /* -------------------------------------------------- */
      /* 🔹 SEND UPDATE REQUEST */
      /* -------------------------------------------------- */
      await updateConsultation(payload);

      toast({
        title: "Consultation Updated",
        description: "The consultation has been completed successfully.",
      });

      /* -------------------------------------------------- */
      /* 🔹 CLEAR STATES */
      /* -------------------------------------------------- */
      setFiles([]);
      setReportFiles([]);
      setShowManualPrescription(false);
      setMedicines([]);

      /* -------------------------------------------------- */
      /* 🔹 REDIRECT TO PATIENTS PAGE */
      /* -------------------------------------------------- */
      navigate("/patients");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating consultation",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  /* ------------------------------ RENDER PAGE ------------------------------ */
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Patient Header */}
      <PatientHeader patient={patient} />

      <ConsultationHistory
        consultations={consultations.filter(
          (c) => String(c.id) !== String(consultationId)
        )}
        handleViewConsultationDetails={handleViewConsultationDetails}
      />

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-6">
          {/* PRESCRIPTION UPLOAD */}
          {!showManualPrescription && (
            <PrescriptionImageUpload
              files={files}
              onUpload={handleFileUpload}
              onRemove={handleRemoveFile}
            />
          )}

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* MANUAL PRESCRIPTION */}
          <div className="flex justify-center">
            <Button
              className="bg-black text-white"
              type="button"
              onClick={() => {
                if (files.length > 0) {
                  toast({
                    title: "Cannot open manual mode",
                    description: "Remove uploaded images first",
                    variant: "destructive",
                  });
                  return;
                }
                setShowManualPrescription(!showManualPrescription);
              }}
            >
              {showManualPrescription
                ? "Cancel Manual Prescription"
                : "Add Manual Prescription"}
            </Button>
          </div>

          {showManualPrescription && (
            <ManualPrescription
              ref={prescriptionRef}
              patient={patient}
              medicines={medicines}
              medicineName={medicineName}
              medicineQuantity={medicineQuantity}
              medicineDuration={medicineDuration}
              setMedicineName={setMedicineName}
              setMedicineQuantity={setMedicineQuantity}
              setMedicineDuration={setMedicineDuration}
              handleAddMedicine={handleAddMedicine}
              form={form}
            />
          )}

          {/* ⭐ NEW: REPORT SECTION ⭐ */}
          <ReportUpload
            files={reportFiles}
            onUpload={handleReportUpload}
            onRemove={handleRemoveReport}
          />

          {/* FORM FIELDS */}
          <SymptomsField form={form} />
          <DiseaseField form={form} />
          <AdviceField form={form} />
          <FeeField form={form} consultations={consultations} />

          {/* SUBMIT BUTTON */}
          <SubmitButton />
        </form>
      </Form>

      {/* MODAL */}
      <ConsultationDetailsModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        consultation={selectedConsultation}
      />
    </div>
  );
};

export default ConsultationPage;
