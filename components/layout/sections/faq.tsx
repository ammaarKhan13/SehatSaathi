import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How accurate is the medical report analysis?",
    answer: "Our system uses advanced AI with RAG and Pinecone for context-rich insights from medical databases, providing highly accurate analysis. However, it's designed to assist healthcare professionals, not replace medical consultation.",
    value: "item-1",
  },
  {
    question: "Can I analyze any type of medical report?",
    answer: "Yes, our system can analyze various medical reports including blood tests, imaging reports, and general health assessments. You can upload reports as images or text, and our AI will process them accordingly.",
    value: "item-2",
  },
  {
    question: "How does the nutrition label analyzer work?",
    answer: "The nutrition analyzer uses Gemini API to process both text and image-based nutrition labels. It extracts key nutritional information and provides clear insights about the food's nutritional content and health implications.",
    value: "item-3",
  },
  {
    question: "What kind of medicine information can I get from the system?",
    answer: "Using FDA and Gemini APIs, our medicine analyzer provides comprehensive information about medication usage, dosage, purpose, potential side effects, and contraindications. You can ask questions in user-friendly language.",
    value: "item-4",
  },
  {
    question: "Is my medical data secure and private?",
    answer: "Yes, we take data privacy very seriously. All medical reports and personal information are processed securely and are not stored permanently in our system. We adhere to strict healthcare data protection standards.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-lg text-primary font-medium tracking-wider">
            FAQs
          </h2>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
        >
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem 
              key={value} 
              value={value}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left text-lg hover:no-underline">
                {question}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};