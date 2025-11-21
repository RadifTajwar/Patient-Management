import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrescriptionImageUpload({
  files,
  onUpload,
  onRemove,
}: {
  files: any[];
  onUpload: (e: any) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Prescription</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Button
            type="button"
            onClick={() => document.getElementById("reportFile")?.click()}
          >
            <FileText className="mr-2 h-4 w-4" /> Add Prescription Image
          </Button>

          <Input
            id="reportFile"
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files!)}
            className="hidden"
            multiple
          />
        </div>

        {files.length > 0 && (
          <div className="mt-2 mb-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>

            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <FileIcon className="h-4 w-4 mr-2" />
                    <span>{file.name}</span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4" /> Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
