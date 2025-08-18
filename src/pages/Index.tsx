
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to the Appointment Management System</h1>
        <p className="text-xl text-gray-600">Streamline your appointment scheduling and management</p>
        <div className="mt-8">
          <Link to="/appointments">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              View Appointments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
