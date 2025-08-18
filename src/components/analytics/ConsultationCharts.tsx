import React, { useState, useEffect } from "react";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getConsultationData } from "../../api/analytics";

interface ConsultationChartsProps {
  selectedYear: string;
}

interface ConsultationInfo {
  Month: string;
  ConsultationCount: number;
  TotalFees: string;
}

const ConsultationCharts: React.FC<ConsultationChartsProps> = ({
  selectedYear,
}) => {
  const [locationFilter, setLocationFilter] = useState("None");
  const [typeFilter, setTypeFilter] = useState("None");
  const [diseaseFilter, setDiseaseFilter] = useState("None");
  const [consultationData, setConsultationData] = useState<ConsultationInfo[]>([]);

  const fetchConsultationData = async (filters) => {
    try {
      const response = await getConsultationData(filters);
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        setConsultationData(response.data);
      }
    } catch (error) {
      console.error("Error fetching consultation analytics :", error);
    }
  };

  useEffect(() => {
    const filters = {
      consultlocation: "None",
      consultType: "None",
      disease: "None",
      year: selectedYear,
    };

    fetchConsultationData(filters);
  }, []);


  const chartConfig = {
    consultations: {
      label: "Consultations",
      color: "hsl(var(--chart-1))",
    },
    fees: {
      label: "Fees ($)",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Locations</SelectItem>
            <SelectItem value="clinic-a">Clinic A</SelectItem>
            <SelectItem value="clinic-b">Clinic B</SelectItem>
            <SelectItem value="home-visit">Home Visit</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Types</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
          </SelectContent>
        </Select>

        <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by disease" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Diseases</SelectItem>
            <SelectItem value="diabetes">Diabetes</SelectItem>
            <SelectItem value="hypertension">Hypertension</SelectItem>
            <SelectItem value="heart-disease">Heart Disease</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultations per Month</CardTitle>
            <CardDescription>
              Monthly consultation count for {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="ConsultationCount"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Fees per Month</CardTitle>
            <CardDescription>
              Monthly revenue from consultations for {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="TotalFees" fill="var(--color-fees)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationCharts;
