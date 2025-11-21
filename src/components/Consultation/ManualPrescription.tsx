import React, { forwardRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDoctorInfo } from "@/utils/accessutils";

interface Props {
  patient: any;
  medicines: { name: string; quantity: string; duration: string }[];
  medicineName: string;
  medicineQuantity: string;
  medicineDuration: string;
  setMedicineName: (v: string) => void;
  setMedicineQuantity: (v: string) => void;
  setMedicineDuration: (v: string) => void;
  handleAddMedicine: () => void;
  form: any;
}

const ManualPrescription = forwardRef<HTMLDivElement, Props>(
  (
    {
      patient,
      medicines,
      medicineName,
      medicineQuantity,
      medicineDuration,
      setMedicineName,
      setMedicineQuantity,
      setMedicineDuration,
      handleAddMedicine,
      form,
    },
    ref
  ) => {
    const doctor = getDoctorInfo();
    return (
      <div ref={ref} className="p-6 bg-white border rounded-md shadow-sm">
        <div className="w-full p-6 bg-white">
          {/* ---------------- HEADER ---------------- */}
          <div className="flex justify-between items-start pb-4 border-b">
            {/* LEFT — DOCTOR INFO */}
            <div className="w-2/3">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="font-bold text-xl">
                    {doctor.name || "Doctor Name"}
                  </h2>

                  {/* Specialty */}
                  <p>{doctor.specialty || "Specialty"}</p>

                  {/* Address (doctor’s practice address) */}
                  <p>{doctor.address || "Doctor Address"}</p>

                  <p className="font-semibold">
                    BMDC Reg: {doctor.bmdc || "N/A"}
                  </p>

                  {/* Email */}
                  <p>Email: {doctor.email || "N/A"}</p>

                  {/* Phone */}
                  <p>Phone: {doctor.phone || "N/A"}</p>

                  {/* Commented fields for future use */}
                  {/* <p>{doctor.degrees}</p> */}
                  {/* <p>{doctor.designation}</p> */}
                  {/* <p>{doctor.department}</p> */}
                </div>
              </div>
            </div>

            {/* RIGHT — CHAMBER INFO (clinic info not available → commented) */}
            <div className="text-right w-1/3">
              {/* Future fields — keep placeholder */}
              <p className="font-semibold">
                {/* {doctor.clinicName} */} Chamber Information
              </p>

              <p>{/* {doctor.clinicAddress} */} Not Provided</p>

              <p>Mobile: {/* {doctor.clinicPhone} */} Not Provided</p>

              <p>Visit Time: {/* {doctor.visitTime} */} N/A</p>

              <p>{/* doctor.offDay */} Friday Off</p>
            </div>
          </div>

          {/* ---------------- PATIENT INFO ---------------- */}
          <div className="mt-4 text-sm border rounded-md p-4 bg-gray-50">
            <h3 className="font-semibold text-base mb-3 pb-1 border-b">
              Patient Information
            </h3>

            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <p className="flex">
                  <span className="w-32 font-medium">Full Name</span> :
                  <span className="ml-2">{patient?.name}</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Sex</span> :
                  <span className="ml-2">{patient?.sex}</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Blood Group</span> :
                  <span className="ml-2">{patient?.bloodGroup || "N/A"}</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Address</span> :
                  <span className="ml-2">{patient?.address}</span>
                </p>
              </div>

              <div>
                <p className="flex">
                  <span className="w-32 font-medium">Age</span> :
                  <span className="ml-2">{patient?.age} years</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Mobile</span> :
                  <span className="ml-2">{patient?.phone}</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Email</span> :
                  <span className="ml-2">{patient?.email}</span>
                </p>
                <p className="flex mt-1">
                  <span className="w-32 font-medium">Date</span> :
                  <span className="ml-2">
                    {new Date().toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- MAIN BODY ---------------- */}
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div className="col-span-1 space-y-6 text-sm">
              <Section title="C/C">
                <textarea
                  className="w-full border p-2 rounded mt-1"
                  rows={3}
                  placeholder="Chief Complaint"
                  {...form.register("symptoms")}
                />
              </Section>

              <Section title="O/E">
                <textarea
                  className="w-full border p-2 rounded mt-1"
                  rows={3}
                  placeholder="On Examination"
                />
              </Section>

              <Section title="Investigation">
                <textarea
                  className="w-full border p-2 rounded mt-1"
                  rows={3}
                  placeholder="X-Ray, scaling, etc."
                />
              </Section>

              <Section title="Treatment Plan">
                <textarea
                  className="w-full border p-2 rounded mt-1"
                  rows={3}
                  placeholder="Treatment plan details"
                />
              </Section>

              <Section title="Note">
                <textarea
                  className="w-full border p-2 rounded mt-1"
                  rows={3}
                  placeholder="Doctor notes"
                />
              </Section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-2 pl-6 border-l">
              <h1 className="text-4xl font-bold text-blue-700 mb-3">℞</h1>

              {/* MEDICINE LIST */}
              <div className="space-y-4">
                {medicines.length > 0 ? (
                  medicines.map((m, i) => (
                    <div
                      key={i}
                      className="border border-gray-300 rounded-md p-3 shadow-sm bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-base text-blue-700">
                          {i + 1}. {m.name}
                        </p>
                      </div>

                      <div className="text-sm mt-2 grid grid-cols-3 gap-2">
                        <p>
                          <span className="font-medium">Dosage:</span>{" "}
                          {m.quantity}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          {m.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No medicines added.</p>
                )}
              </div>

              {/* ADD MEDICINE */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                <Input
                  placeholder="Medicine name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                />
                <Input
                  placeholder="Dosage (e.g. 1+1+1)"
                  value={medicineQuantity}
                  onChange={(e) => setMedicineQuantity(e.target.value)}
                />
                <Input
                  placeholder="Duration (e.g. 7 days)"
                  value={medicineDuration}
                  onChange={(e) => setMedicineDuration(e.target.value)}
                />

                <Button type="button" onClick={handleAddMedicine}>
                  Add
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">উপদেশঃ</h3>
                <textarea
                  rows={4}
                  className="w-full border p-2 rounded"
                  placeholder="Bangla instructions for patient"
                  {...form.register("advice")}
                />
              </div>
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="text-right mt-10">
            <p className="mt-12">_____________________________</p>
            <p className="text-sm">Doctor’s Signature</p>
          </div>
        </div>
      </div>
    );
  }
);

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="font-semibold border-b pb-1">{title}</h3>
    {children}
  </div>
);

export default ManualPrescription;
