import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createPatientAndUpdateAppointment } from "@/api/consultation";
import { getPatients } from "@/api/patient";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Appointment } from "./AppointmentList";

// ---- Types ------------------------------------------------------
type PatientSummary = {
  id: number;
  patient_id?: string | number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  sex?: string;
  age?: number;
  imageURL?: string;
};

type AppointmentFormValues = {
  patientType: "new" | "old";
  selectedExistingPatientId?: number | null;
  name: string;
  sex: string;
  age: number | string;
  phone?: string;
  email?: string;
  address?: string;
  imageURL?: string;
  consultlocation: string;
  consultType: string;
  appointmentStatus: string;
  dateTime: string;
  patientCondition?: string;
  isFollowUp?: boolean;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  disease?: string;
};

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | any;
  onStartConsultation: (id: number) => void;
  patients?: PatientSummary[];
  onSave?: (values: AppointmentFormValues, appointmentId: number) => void;
}

// ---- Component --------------------------------------------------
const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onStartConsultation,
  patients = [],
  onSave,
}) => {
  const [paymentOption, setPaymentOption] = useState<"later" | "now">("later");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash">("cash");
  const [showConfirm, setShowConfirm] = useState(false);
  const [formValues, setFormValues] = useState<AppointmentFormValues | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(
    null
  );

  const [paymentAmount, setPaymentAmount] = useState("");
  const [query, setQuery] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<PatientSummary[]>(
    []
  );
  const [transactionId, setTransactionId] = useState("");

  // 🧩 Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<AppointmentFormValues>({
    defaultValues: {
      patientType: "new",
      selectedExistingPatientId: null,
      name: "",
      sex: "Other",
      age: "",
      phone: "",
      email: "",
      address: "",
      imageURL: "",
      consultlocation: "",
      consultType: "",
      appointmentStatus: "",
      dateTime: "",
      patientCondition: "",
      isFollowUp: false,
    },
  });

  // ✅ Must define before useEffect
  const patientType = watch("patientType");
  const isFollowUp = watch("isFollowUp");

  // 🧩 Convert ISO to datetime-local
  const toLocalDatetimeInput = (iso: string) => {
    try {
      if (iso?.length >= 16 && iso.includes("T") && !iso.endsWith("Z")) {
        return iso.slice(0, 16);
      }
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d?.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return iso?.slice(0, 16);
    }
  };

  // 🧩 Update form when appointment data changes
  useEffect(() => {
    if (!appointment) return;

    const patient = appointment.patient || {};
    const consultation = appointment.consultation || {};
    const location = appointment.location || {};

    reset({
      patientType: "new",
      selectedExistingPatientId: null,
      name: patient.name ?? "",
      sex: patient.sex ?? "Other",
      age: patient.age ?? "",
      phone: patient.phone ?? "",
      email: patient.email ?? "",
      address: patient.address ?? "",
      imageURL: patient.imageURL ?? "",
      consultlocation: location.name ?? "",
      consultType: consultation.type ?? "",
      appointmentStatus: consultation.status ?? "",
      dateTime: consultation.date
        ? toLocalDatetimeInput(consultation.date)
        : "",
      patientCondition: consultation.condition ?? "",
      isFollowUp: false,
    });
  }, [appointment, reset]);

  // 🧠 Fetch patients dynamically (debounced)
  useEffect(() => {
    if (patientType !== "old") return;
    if (!query.trim()) {
      setFilteredPatients(patients?.slice(0, 20));
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoadingPatients(true);
        const response = await getPatients({ search: query });
        if (response?.data) setFilteredPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoadingPatients(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, patientType]);

  const handlePickExisting = (p: PatientSummary) => {
    setSelectedPatient(p);
    setValue("selectedExistingPatientId", p.id);
    setValue("name", p.name ?? "");
    setValue("sex", (p.sex as string) ?? "Other");
    setValue("age", p.age ?? "");
    setValue("phone", p.phone ?? "");
    setValue("email", p.email ?? "");
    setValue("address", p.address ?? "");
    setValue("imageURL", p.imageURL ?? "");
  };
  const handleUnselectPatient = () => {
    setSelectedPatient(null);
    setValue("selectedExistingPatientId", null);
    setQuery("");
  };

  // 🧩 Submit
  const onSubmit = (values: AppointmentFormValues) => {
    setFormValues(values);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!formValues) return;

    try {
      const typeMap = {
        new: "New Patient",
        old: formValues.isFollowUp ? "Follow Up" : "Old Patient",
      };

      const consultType = typeMap[formValues.patientType] || "";

      // ✅ Determine payment status dynamically
      const paymentStatus = paymentOption === "later" ? "pending" : "paid";

      const payload: any = {
        consultationId: appointment.id,
        patientData: {
          name: formValues.name,
          age: formValues.age,
          sex: formValues.sex,
          address: formValues.address,
          phone: formValues.phone,
          email: formValues.email,
          consultlocation: formValues.consultlocation,
          consultType,
          lastAppointmentId: appointment.id,
          appointmentStatus: "confirmed",
          consultationFee: paymentAmount,
          paymentStatus,
          // 🩺 include these missing fields:
          height: formValues.height,
          weight: formValues.weight,
          bloodGroup: formValues.bloodGroup,
          disease: formValues.disease,
        },
      };

      // Include patientId if old
      if (formValues.patientType === "old" && selectedPatient?.id) {
        payload.patientData.patientId = selectedPatient.id;
      }

      // Include follow-up date if applicable
      if (formValues.isFollowUp && formValues.dateTime) {
        payload.patientData.followUp = formValues.dateTime;
      }

      // Include Bkash transaction ID if applicable
      if (
        paymentOption === "now" &&
        paymentMethod === "bkash" &&
        transactionId
      ) {
        payload.patientData.transactionId = transactionId;
      }

      const response = await createPatientAndUpdateAppointment(payload);

      console.log(
        "✅ Patient processed and consultation updated:",
        response.data
      );

      // 🧾 Generate printable receipt
      generateReceipt({
        name: formValues.name,
        amount: paymentAmount,
        method: paymentMethod,
        transactionId,
        status: paymentStatus,
        date: new Date().toLocaleString(),
      });

      if (onSave) onSave(formValues, appointment.id);
      onStartConsultation(appointment.id);
      onClose();
      setFormValues(null);
      setShowConfirm(false);
    } catch (err) {
      console.error("❌ Error handling confirm:", err);
    }
  };

  if (!appointment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <p className="text-center py-8 text-gray-500">
            Loading appointment details...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const timeSlot = appointment.timeSlot || {};

  // ----------------------------------------------------------------
  return (
    <>
      {/* Confirmation Dialog */}
      <AlertDialog
        open={showConfirm}
        onOpenChange={(open) => {
          if (!open) setShowConfirm(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start this consultation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Appointment Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-1 sm:p-4">
          <h1 className="px-1 pt-4 font-semibold text-2xl">
            Appointment Details
          </h1>
          <p className="text-center text-xl font-semibold underline">
            Sl no : <span>{appointment.serialNo ?? "N/A"}</span>
          </p>

          <p className="text-center text-sm text-gray-500 mb-3">
            {appointment.consultation?.status} •{" "}
            {appointment.consultation?.paymentStatus}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 pb-1 px-1 mb-8"
          >
            {/* Patient Info */}
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <DialogTitle className="font-normal text-sm flex flex-wrap gap-2 items-center">
                    <p>Name:</p>
                    <Input
                      {...register("name", { required: true })}
                      placeholder="Full name"
                      className="h-auto py-2 text-sm sm:w-1/3 min-w-[125px]"
                    />
                    <div className="flex items-center gap-2">
                      <p>Age:</p>
                      <Input
                        type="number"
                        min={0}
                        {...register("age")}
                        className="w-20 h-8"
                      />
                      <span>years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>Sex:</p>
                      <Select
                        value={watch("sex")}
                        onValueChange={(v) => setValue("sex", v)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogTitle>

                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <div className="flex items-center gap-2">
                      <p>Location:</p>
                      <Input
                        {...register("consultlocation")}
                        className="w-32 h-8 text-sm"
                        disabled
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label htmlFor="dateTime">Date & Time</Label>
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        {...register("dateTime")}
                        className="h-8 text-sm w-48"
                      />
                    </div>
                  </div>

                  {timeSlot?.startTime && (
                    <p className="text-sm mt-2 text-center bg-black p-2 text-white">
                      Slot: {timeSlot.startTime} - {timeSlot.endTime} •(
                      {timeSlot.duration} mins)
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Contact Info */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-medium">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input {...register("phone")} placeholder="Phone number" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      {...register("address")}
                      placeholder="Street, City…"
                    />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      {...register("height")}
                      placeholder="Height"
                    />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      {...register("weight")}
                      placeholder="Weight"
                    />
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Select
                      value={watch("bloodGroup")}
                      onValueChange={(v) => setValue("bloodGroup", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Disease / Condition</Label>
                    <Input
                      {...register("disease")}
                      placeholder="Disease name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Type */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium ">Patient Type</Label>
                  <RadioGroup
                    className="grid grid-cols-2 gap-4"
                    value={patientType}
                    onValueChange={(v) =>
                      setValue("patientType", v as "new" | "old")
                    }
                  >
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">New patient</Label>
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="old" id="old" />
                      <Label htmlFor="old">Old patient</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Old patient follow-up section */}
                {patientType === "old" && (
                  <div className="space-y-3 border border-gray-300 p-4 rounded-md">
                    {/* 🆕 Follow-up checkbox */}
                    <div className="flex items-center space-x-2 border-b pb-2">
                      <input
                        id="isFollowUp"
                        type="checkbox"
                        {...register("isFollowUp")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isFollowUp">Follow-up</Label>
                    </div>

                    <Label>Existing patient</Label>

                    {/* ✅ If a patient is selected */}
                    {selectedPatient ? (
                      <div className="flex items-center justify-between border rounded-md p-3 bg-accent/20">
                        <div>
                          <p className="font-medium">{selectedPatient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedPatient.patient_id
                              ? `ID: ${selectedPatient.patient_id} • `
                              : ""}
                            {selectedPatient.phone || "No phone"}
                            {selectedPatient.email
                              ? ` • ${selectedPatient.email}`
                              : ""}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleUnselectPatient}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* 🔍 Search input */}
                        <Input
                          placeholder="Search by name"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />

                        {/* 🧾 Dropdown list */}
                        <div className="max-h-48 overflow-auto border rounded-md">
                          {loadingPatients ? (
                            <div className="p-3 text-sm text-muted-foreground">
                              Loading...
                            </div>
                          ) : filteredPatients.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground">
                              No matches
                            </div>
                          ) : (
                            <ul className="divide-y">
                              {filteredPatients.map((p) => (
                                <li
                                  key={p.id}
                                  onClick={() => {
                                    handlePickExisting(p);
                                    setQuery("");
                                    setFilteredPatients([]);
                                  }}
                                  className="p-3 flex items-center justify-between hover:bg-accent cursor-pointer"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {p.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {p.patient_id
                                        ? `ID: ${p.patient_id} • `
                                        : ""}
                                      {p.phone || "No phone"}
                                      {p.email ? ` • ${p.email}` : ""}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="mt-6">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">Payment Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Payment</Label>
                  <RadioGroup
                    className="grid grid-cols-2 gap-4"
                    value={paymentOption}
                    onValueChange={(v) =>
                      setPaymentOption(v as "later" | "now")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="later" />
                      <Label htmlFor="later">Pay Later</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">Pay Now</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentOption === "now" && (
                  <div className="space-y-3">
                    <Label className="font-medium">Payment Method</Label>
                    <RadioGroup
                      className="grid grid-cols-2 gap-4"
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as "cash" | "bkash")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bkash" id="bkash" />
                        <Label htmlFor="bkash">Bkash</Label>
                      </div>
                    </RadioGroup>

                    {/* 🔹 Show Transaction ID input for Bkash */}
                    {paymentMethod === "bkash" && (
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="transactionId">
                          Bkash Transaction ID
                        </Label>
                        <Input
                          id="transactionId"
                          placeholder="Enter transaction ID"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                className="bg-black hover:bg-blue-700"
                disabled={isSubmitting}
              >
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 🧾 Receipt generator with full details
const generateReceipt = (data: {
  name: string;
  amount: string;
  method: string;
  transactionId?: string;
  status: string;
  date: string;
  doctor?: {
    name: string;
    bmdc: string;
    department?: string;
  };
  patient?: {
    name: string;
    age?: string | number;
    sex?: string;
    phone?: string;
    bloodGroup?: string;
    height?: string;
    weight?: string;
    disease?: string;
    address?: string;
  };
}) => {
  const receiptHTML = `
    <html>
      <head>
        <title>Consultation Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; background: #f8f9fa; }
          .receipt { max-width: 700px; margin: 0 auto; background: #fff; border: 1px solid #ccc; padding: 30px; border-radius: 10px; }
          h1, h2 { text-align: center; margin-bottom: 10px; }
          h1 { color: #1a202c; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
          .section-title { margin-top: 25px; font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 4px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: gray; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h1>Payment Receipt</h1>
          <p style="text-align:center;">${data.date}</p>

          <h2 class="section-title">Doctor Details</h2>
          <table>
            <tr><th>Name</th><td>${data.doctor?.name || "N/A"}</td></tr>
            <tr><th>BMDC</th><td>${data.doctor?.bmdc || "N/A"}</td></tr>
            <tr><th>Department</th><td>${
              data.doctor?.department || "General Medicine"
            }</td></tr>
          </table>

          <h2 class="section-title">Patient Details</h2>
          <table>
            <tr><th>Name</th><td>${data.patient?.name || "N/A"}</td></tr>
            <tr><th>Age</th><td>${data.patient?.age || "N/A"}</td></tr>
            <tr><th>Sex</th><td>${data.patient?.sex || "N/A"}</td></tr>
            <tr><th>Phone</th><td>${data.patient?.phone || "N/A"}</td></tr>
            <tr><th>Address</th><td>${data.patient?.address || "N/A"}</td></tr>
            <tr><th>Blood Group</th><td>${
              data.patient?.bloodGroup || "N/A"
            }</td></tr>
            <tr><th>Height</th><td>${data.patient?.height || "N/A"} cm</td></tr>
            <tr><th>Weight</th><td>${data.patient?.weight || "N/A"} kg</td></tr>
            <tr><th>Disease</th><td>${data.patient?.disease || "N/A"}</td></tr>
          </table>

          <h2 class="section-title">Payment Details</h2>
          <table>
            <tr><th>Amount</th><td>${data.amount} BDT</td></tr>
            <tr><th>Method</th><td>${data.method}</td></tr>
            ${
              data.transactionId
                ? `<tr><th>Transaction ID</th><td>${data.transactionId}</td></tr>`
                : ""
            }
            <tr><th>Status</th><td>${data.status}</td></tr>
          </table>

          <div class="footer">
            Thank you for visiting our clinic.<br />
            This receipt is system-generated and valid for record purposes.
          </div>
        </div>
        <script>window.print()</script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  }
};

export default PatientDetailsModal;
