'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings, FileText } from "lucide-react";
import { useState } from "react";
import ReportComponent from "@/components/ReportComponent";
import { useToast } from "@/hooks/use-toast"
import ChatComponent from "@/components/chatcomponent";

const Home = () => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState("");

  const onReportConfirmation = (data: string) => {
    setReportData(data);
    toast({
      title: "Success",
      description: "Report updated successfully",
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[350px] flex-col border-r bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Medical Reports
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <ReportComponent onReportConfirmation={onReportConfirmation} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="w-5 h-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 max-h-[80vh] overflow-auto">
                <ReportComponent onReportConfirmation={onReportConfirmation} />
              </div>
            </DrawerContent>
          </Drawer>
        </header>
        
        <main className="flex-1 p-4">
          <ChatComponent reportData={reportData} />
        </main>
      </div>
    </div>
  );
};

export default Home;