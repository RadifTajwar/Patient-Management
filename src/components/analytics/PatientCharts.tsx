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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getPatientData, getGenderDist } from "../../api/analytics";

interface PatientChartsProps {
  selectedYear: string;
}

interface PatientInfo {
  Month: string;
  PatientCount: number;
}

interface GenderInfo {
  Sex: string;
  PatientCount: number;
}

const PatientCharts: React.FC<PatientChartsProps> = ({ selectedYear }) => {
  const [diseaseFilter, setDiseaseFilter] = useState("None");
  const [treatmentFilter, setTreatmentFilter] = useState("None");
  const [ageFilter, setAgeFilter] = useState("0");
  const [sexFilter, setSexFilter] = useState("None");
  const [patientData, setPatientData] = useState<PatientInfo[]>([]);
  const [genderData, setGenderData] = useState<GenderInfo[]>([]);

  const genderColor = [{ color: "#8b5cf6" }, { color: "#10b981" }];

  const fetchPatientData = async (filters) => {
    try {
      const response = await getPatientData(filters);
      if (response.status === 200 || response.status === 201) {
        response.data;
        setPatientData(response.data);
      }
    } catch (error) {
      console.error("Error fetching patient analytics :", error);
    }
  };

  const fetchGenderData = async () => {
    try {
      const response = await getGenderDist();
      if (response.status === 200 || response.status === 201) {
        response.data;
        setGenderData(response.data);
      }
    } catch (error) {
      console.error("Error fetching gender analytics :", error);
    }
  };

  useEffect(() => {
    const filters = {
      disease: "None",
      treatmentStatus: "None",
      age: 0,
      sex: "None",
      year: selectedYear,
    };

    fetchPatientData(filters);
    fetchGenderData();
  }, []);

  const ageGroupData = [
    { name: "0-18", value: 187, color: "#10b981" },
    { name: "19-35", value: 312, color: "#f59e0b" },
    { name: "36-55", value: 398, color: "#8b5cf6" },
    { name: "56+", value: 350, color: "#ec4899" },
  ];

  const chartConfig = {
    patients: {
      label: "New Patients",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
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

        <Select value={treatmentFilter} onValueChange={setTreatmentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by treatment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Statuses</SelectItem>
            <SelectItem value="active">Active Treatment</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by age group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ages</SelectItem>
            <SelectItem value="0-18">0-18 years</SelectItem>
            <SelectItem value="19-35">19-35 years</SelectItem>
            <SelectItem value="36-55">36-55 years</SelectItem>
            <SelectItem value="56+">56+ years</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sexFilter} onValueChange={setSexFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New Patient Registrations per Month</CardTitle>
            <CardDescription>
              Monthly new patient count for {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={patientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="PatientCount"
                    stroke="var(--color-PatientCount)"
                    fill="var(--color-PatientCount)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Distribution by Gender</CardTitle>
            <CardDescription>Gender breakdown of all patients</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="PatientCount"
                  label={({ Sex, PatientCount }) => `${Sex}: ${PatientCount}`}
                >
                  {genderColor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Distribution by Age Group</CardTitle>
          <CardDescription>Age group breakdown of all patients</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {ageGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientCharts;
