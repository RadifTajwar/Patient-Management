import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import ConsultationCharts from "@/components/analytics/ConsultationCharts";
import PatientCharts from "@/components/analytics/PatientCharts";

const AnalyticsPage = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const years = ["2025", "2026", "2027"];

  return (
    <div className="container mx-auto p-6 space-y-6" 
      style={{
        marginLeft: "50px",
        marginRight: "50px",
        marginTop: "30px",
        marginBottom: "30px",
      }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your practice performance
          </p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnalyticsSummary />
    </div>
  );
};

export default AnalyticsPage;
