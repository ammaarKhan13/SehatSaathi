import React, { ChangeEvent, useState, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onReportConfirmation: (data: string) => void;
};

const ReportComponent = ({ onReportConfirmation }: Props) => {
  const { toast } = useToast();

  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReportSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (!file) {
      toast({ variant: "destructive", description: "No file selected!" });
      return;
    }

    const validImages = ["image/jpeg", "image/png", "image/webp"];
    const validDocs = ["application/pdf"];
    if (![...validImages, ...validDocs].includes(file.type)) {
      toast({ variant: "destructive", description: "Unsupported file type!" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Data(reader.result as string);
      console.log("File loaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  async function extractDetails() {
    if (!base64Data) {
      toast({ variant: "destructive", description: "Upload a valid report!" });
      return;
    }

    setIsLoading(true);
    setReportData("");

    try {
      const response = await fetch("/api/extractreportgemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: base64Data }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to extract report.");

      setReportData(data.text);
      toast({ title: "Report extracted successfully!" });
    } catch (error) {
      console.error("Report extraction error:", error);
      toast({ variant: "destructive", description: "Failed to extract report. Try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid w-full items-start gap-6 p-4">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Upload Medical Report</legend>
        
        {isLoading && (
          <div className="absolute inset-0 bg-card/90 flex items-center justify-center rounded-lg">
            Extracting report...
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleReportSelection}
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
          Select File
        </Button>

        <Button onClick={extractDetails} disabled={isLoading || !base64Data}>
          1. Upload & Extract
        </Button>

        <Label>Extracted Report Summary</Label>
        <Textarea
          value={reportData}
          placeholder="Extracted summary will appear here..."
          onChange={(e) => setReportData(e.target.value)}
          className="min-h-72 resize-none border-0 p-3"
        />

        <Button
          variant="destructive"
          className="bg-[#D90013]"
          onClick={() => {
            if (!reportData.trim()) {
              toast({ variant: "destructive", description: "No extracted data to confirm!" });
              return;
            }
            onReportConfirmation(reportData);
          }}
        >
          2. Confirm Report
        </Button>
      </fieldset>
    </div>
  );
};

export default ReportComponent;
