"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, BarChart } from "lucide-react";
import React from "react";

interface FeaturesProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
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
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "AI Disease Detector",
    description:
      "ML model to analyse the user symptoms and give diseases based on the symptoms.",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="container mx-auto px-6 sm:px-12 lg:px-24 py-24">
      <div className="text-center">
        <h3 className="text-primary font-medium">Features</h3>
        <h1 className="text-4xl font-bold">What Makes MedNourish AI Different</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
          Leverage the power of Generative AI to analyze medical reports, understand food nutrition, and get insightful medicine details. Here's how we make healthcare smarter.
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
