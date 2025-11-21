import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, processISOString } from "@/utils/helper";
import Info from "@/components/Consultation/Info";
export default function PatientHeader({ patient }: { patient: any }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Patient Consultation</CardTitle>
      </CardHeader>

      <CardContent>
        {patient ? (
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={patient.imageURL} alt={patient.name} />
              <AvatarFallback className="text-xl">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 flex-1">
              <Info label="Name" value={patient.name} />
              <Info label="Age" value={patient.age && `${patient.age} years`} />
              <Info label="Sex" value={patient.sex} />

              <Info label="Blood Group" value={patient.bloodGroup} />
              <Info
                label="Height"
                value={patient.height && `${patient.height} ft`}
              />
              <Info
                label="Weight"
                value={patient.weight && `${patient.weight} lb`}
              />

              <Info
                label="Date of Birth"
                value={patient.dob && processISOString(patient.dob)}
              />
              <Info label="Location" value={patient.consultlocation} />
              <Info label="Contact" value={patient.phone} />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading patient details...</p>
        )}
      </CardContent>
    </Card>
  );
}
