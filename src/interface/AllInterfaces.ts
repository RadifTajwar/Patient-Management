export interface ConsultationFormValues {
  id: string;
  patientId: string;
  patientCondition: string;
  appointmentStatus: string;
  audioURL: string;
  medicalTests: string;
  medicalReports: string;
  medicalFiles: string;
  reportComments: string;
  patientAdvice: string;
  medicine: string;
  doctorNotes: string;
  recoveryStatus: string;
  disease: string;
  followUp: string; // YYYY-MM-DD string
  consulationDate: string; // YYYY-MM-DD string
  symptoms: string; // Now an array
  advice: string;
  fee: string;
  prescription: string; // Cloudinary PDF link
  dateTime:string;
}

export interface ConsultationInfo {
  id: number;
  patientId: number;
  consultlocation: string;
  consultType: string;
  date: string;
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
  prescription: string; 
  symptoms: string;
  advice: string;
  consultationFee: string;
  paymentStatus: string;
}