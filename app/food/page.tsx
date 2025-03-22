'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, Upload, Camera } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CameraCapture from '@/components/CameraCapture';
import ExampleProducts from '@/components/ExampleProducts';
import AnalysisResult from '@/components/AnalysisResult';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-12 max-w-7xl space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-lg text-primary font-medium tracking-wider">
            PRODUCT ANALYSIS
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Product Ingredient Analyzer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simply upload a product image or choose from our examples to get detailed insights 
            about ingredients, nutritional value, and dietary information.
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-secondary/20 bg-card">
          <CardContent className="p-8">
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="grid w-full grid-cols-3 gap-4 bg-muted/50 p-2 mb-8">
                <TabsTrigger 
                  value="examples" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span className="font-semibold">Example Products</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="upload"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="font-semibold">Upload Image</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="camera"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span className="font-semibold">Take Photo</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="examples">
                  <ExampleProducts onSelect={setSelectedImage} />
                </TabsContent>

                <TabsContent value="upload">
                  <ImageUploader onImageSelect={setSelectedImage} />
                </TabsContent>

                <TabsContent value="camera">
                  <CameraCapture onCapture={setSelectedImage} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Selected Image Section */}
        {selectedImage && (
          <Card className="border-secondary/20 bg-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={selectedImage}
                      alt="Selected product"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {/* Product title and description */}
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium text-foreground">
                      🍫 Chocolate Bar
                    </h3>
                    <p className="text-sm text-foreground/90">
                      Parle Hide & Seek Chocolate Cookies
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Selected Product
                  </h2>
                  <p className="text-muted-foreground">
                    Click analyze to get detailed information about this product's ingredients,
                    nutritional value, and dietary considerations.
                  </p>
                  <Button
                    onClick={() => handleAnalyze(selectedImage)}
                    disabled={isAnalyzing}
                    className="w-full md:w-auto"
                    size="lg"
                    variant="default"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="text-primary-foreground">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        <span className="text-primary-foreground">Analyze Product</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnalysisResult analysis={analysisResult} />
          </div>
        )}
      </main>
    </div>
  );
}