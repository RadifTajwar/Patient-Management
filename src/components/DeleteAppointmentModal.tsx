import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteAppointmentModalProps {
  isOpen: boolean;
  appointmentId: number | null;
  patientName: string;
  onClose: () => void;
  onConfirmDelete: (id: number) => void;
}

const DeleteAppointmentModal: React.FC<DeleteAppointmentModalProps> = ({
  isOpen,
  appointmentId,
  patientName,
  onClose,
  onConfirmDelete,
}) => {
  const handleConfirm = () => {
    if (appointmentId) {
      onConfirmDelete(appointmentId);
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the appointment for {patientName}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAppointmentModal;
