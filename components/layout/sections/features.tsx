"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, BarChart, Ambulance, HeartPulse, HeartHandshake } from "lucide-react";
import React from "react";

interface FeaturesProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: <Ambulance className="w-8 h-8 text-primary" />,
    title: "Low-Resource Compatibility",
    description:
      "Works on basic devices and low-bandwidth networks, making it accessible in rural areas.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Medical Report Analyzer",
    description:
      "Scans medical reports via image or text queries, uses RAG with Pinecone for context-rich insights from medical databases, and provides chatbot-based contextual responses.",
  },
  {
    icon: <Pill className="w-8 h-8 text-primary" />,
    title: "Medicine Analyzer",
    description:
      "Uses FDA and Gemini APIs to analyze medicines, answering user queries on medicine usage, dosage, and purpose, among others.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Food Nutrition Analyzer",
    description:
      "Processes text or image-based nutrition labels and extracts insights using the Gemini API to offer detailed nutrition information and clarity.",
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-primary" />,
    title: "MedBuddy",
    description:
      "MedBuddy is an AI-powered medical chatbot that provides instant, reliable health advice, and symptom analysis",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-primary" />,
    title: "Community Health Mode",
    description:
      "Enables health workers to use the platform for collective diagnostics in underserved areas.",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="container mx-auto px-6 sm:px-12 lg:px-24 py-24">
      <div className="text-center">
        <h3 className="text-primary font-medium">Features</h3>
        <h1 className="text-4xl font-bold">What Makes Sehat Saathi Different</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
        Sehat Saathi is an AI-powered medical chatbot designed for low-resource settings, offering multilingual support, instant medical advice, and report analysis to bridge healthcare gaps for rural communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {featureList.map(({ icon, title, description }) => {
          return (
            <Card key={title} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
