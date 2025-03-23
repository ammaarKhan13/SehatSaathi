'use client';

import { useChat } from 'ai/react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CornerDownLeft, Loader2, FileText, ChevronDown } from 'lucide-react';
import Messages from '@/components/messages';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Markdown from '@/components/markdown';

interface ChatComponentProps {
  reportData?: string | null;
}

const ChatComponent = ({ reportData }: ChatComponentProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: "/api/medichatgemini",
  });

  // Safely extract retrievals data
  const getRetrievals = () => {
    if (data && data.length > 0) {
      const lastData = data[data.length - 1] as any;
      return lastData?.retrievals || '';
    }
    return '';
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Status Badge */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat Session</h2>
        <Badge 
          variant={reportData ? "default" : "secondary"}
          className={`px-3 py-1 ${reportData ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          {reportData ? "Report Loaded" : "No Report"}
        </Badge>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto rounded-lg border bg-background p-4">
        {messages.length > 0 ? (
          <Messages messages={messages} isLoading={isLoading} />
        ) : reportData ? (
          <p className="text-sm text-gray-400">
            Your report has been loaded. You can now ask questions about it.
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            No report has been uploaded. You can ask general medical questions.
          </p>
        )}
      </div>

      {/* Relevant Info Section */}
      {data && data.length > 0 && getRetrievals() && (
        <Collapsible className="bg-muted/50 rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/70 transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Relevant Information</span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="pt-2 text-sm">
              {typeof getRetrievals() === 'string' ? (
                <Markdown text={getRetrievals()} />
              ) : (
                <p>No relevant information available</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, {
            data: { reportData: reportData || '' },
          });
        }}
        className="flex flex-col gap-2"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={reportData ? "Ask about your medical report..." : "Ask a general medical question..."}
          className="min-h-[100px] p-4 rounded-lg resize-none"
        />
        <Button 
          type="submit"
          disabled={isLoading || input.trim() === ""}
          className="ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Send Message
              <CornerDownLeft className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
