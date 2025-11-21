import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign } from "lucide-react";
import { getCounts } from "../../api/analytics";

const AnalyticsSummary = () => {
  const [totalPatients, setTotalPatients] = useState();
  const [totalAppointments, setTotalAppointments] = useState();
  const [totalConsultationFee, setTotalConsultationFee] = useState();

  const fetchCount = async () => {
    try {
      const response = await getCounts();
      if (response.status === 200 || response.status === 201) {
        response.data;
        setTotalPatients(response.data.totalPatients);
        setTotalAppointments(response.data.totalAppointments);
        setTotalConsultationFee(response.data.totalConsultationFee);
      }
    } catch (error) {
      console.error("Error fetching analytics counts:", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">Registered patients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Consultations
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAppointments}</div>
          <p className="text-xs text-muted-foreground">
            Completed consultations
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Consultation Fees
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">৳ {totalConsultationFee}</div>
          <p className="text-xs text-muted-foreground">Revenue generated</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
