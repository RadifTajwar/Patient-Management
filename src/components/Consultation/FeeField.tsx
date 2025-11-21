import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ConsultationFormValues,
  ConsultationInfo,
} from "@/interface/AllInterfaces";

export default function FeeField({
  form,
  consultations,
}: {
  form: any;
  consultations: ConsultationInfo[];
}) {
  // Get latest consultation (or the one matching ID if needed)
  const latestConsultation = consultations?.[0];

  // Pre-fill fee only once
  if (latestConsultation?.consultationFee && !form.getValues("fee")) {
    form.setValue("fee", latestConsultation.consultationFee);
  }

  const paymentStatus = latestConsultation?.paymentStatus;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Consultation Fee</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Status Label */}
        {paymentStatus === "paid" ? (
          <p className="text-green-600 font-medium">Fee Paid</p>
        ) : (
          <p className="text-red-600 font-medium">Fee Not Paid Yet</p>
        )}

        {/* Fee Input */}
        <Input placeholder="Consultation fee" {...form.register("fee")} />
      </CardContent>
    </Card>
  );
}
