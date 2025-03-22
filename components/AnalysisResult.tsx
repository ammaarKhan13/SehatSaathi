'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined; // Updated BadgeVariant

interface AnalysisResultProps {
  analysis: string;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const extractRating = (text: string): number => {
    const match = text.match(/Rating: (\d+)\/5/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    const altMatch = text.match(/Nutritional Value.*?(\d+)\/5/);
    if (altMatch && altMatch[1]) {
      return parseInt(altMatch[1], 10);
    }
    return 0;
  };

  const rating = extractRating(analysis);

  const getDietaryInfo = (text: string) => {
    const restrictions: { name: string; variant: BadgeVariant }[] = [];
    if (text.includes('Vegan: No')) restrictions.push({ name: 'Not Vegan', variant: 'destructive' });
    if (text.includes('Vegan: Yes')) restrictions.push({ name: 'Vegan', variant: 'secondary' });
    if (text.includes('Halal: Yes')) restrictions.push({ name: 'Halal', variant: 'secondary' });
    if (text.includes('Kosher: Yes')) restrictions.push({ name: 'Kosher', variant: 'secondary' });
    return restrictions;
  };

  const dietaryInfo = getDietaryInfo(analysis);

  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nutritional Rating */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Nutritional Rating
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-6 h-6 ${
                  index < rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-muted text-muted dark:fill-muted-foreground/20 dark:text-muted-foreground/20'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              ({rating}/5)
            </span>
          </div>
        </div>

        {/* Dietary Information */}
        {dietaryInfo.length > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Dietary Information
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryInfo.map((item) => (
                <Badge
                  key={item.name}
                  variant={item.variant}
                  className="px-3 py-1"
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Main Analysis */}
        <div className="prose dark:prose-invert prose-gray max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}