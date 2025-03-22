// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_PROMPT = `
You are an expert Food Product Analyst specialized in ingredient analysis and nutrition science. 
Your role is to analyze product ingredients, provide health insights, and identify potential concerns by combining ingredient analysis with scientific research. 
`;

const INSTRUCTIONS = `
* Read ingredient list from product image 
* Remember the user may not be educated about the product, break it down in simple words
* Identify artificial additives and preservatives
* Check against major dietary restrictions (vegan, halal, kosher)
* Rate nutritional value on scale of 1-5
* Highlight key health implications or concerns
* Suggest healthier alternatives if needed
* Provide brief evidence-based recommendations
`;

async function getImageAsBase64(imagePath: string): Promise<string> {
  try {
    // If it's already a base64 data URL, extract the base64 part
    if (imagePath.startsWith('data:image')) {
      const base64Data = imagePath.split(',')[1];
      if (!base64Data) throw new Error('Invalid data URL format');
      return base64Data;
    }

    // If it's a local path, read the file and convert to base64
    const cleanPath = imagePath.replace(/^\//, '');
    const publicPath = path.join(process.cwd(), 'public', cleanPath);
    console.log('Reading image from:', publicPath);
    
    const imageBuffer = await fs.promises.readFile(publicPath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('Processing image request:', 
      image.substring(0, 50) + '...'
    );

    // Convert image to base64 if needed
    const base64Image = await getImageAsBase64(image);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Sending request to Gemini API...');
    
    // Analyze the image
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: INSTRUCTIONS },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = {
      error: 'Analysis failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}