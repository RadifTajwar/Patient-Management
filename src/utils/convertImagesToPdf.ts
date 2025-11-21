import { jsPDF } from "jspdf";

export const convertImagesToPDF = (
  files: { name: string; file: File }[],
  onComplete: (pdfBlob: Blob) => void
) => {
  const pdf = new jsPDF();

  files.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Detect file type (default JPEG if unknown)
        const fileType = file.file.type.includes("png") ? "PNG" : "JPEG";

        // Add a new page if it's not the first image
        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(img, fileType, 0, 0, 210, 297); // full A4 size

        // Finalize PDF on the last image
        if (index === files.length - 1) {
          const pdfBlob = pdf.output("blob");
          onComplete(pdfBlob);
        }
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file.file);
  });
};
