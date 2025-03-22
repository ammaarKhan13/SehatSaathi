import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const prompt = `Attached is an image of a clinical report. 
Go over the the clinical report and identify biomarkers that show slight or large abnormalities. Then summarize in 100 words. You may increase the word limit if the report has multiple pages. Do not output patient name, date etc. Make sure to include numerical values and key details from the report, including report title.
## Summary: `;

export async function POST(req: Request) {
    try {
        const { base64 } = await req.json();
        const filePart = fileToGenerativePart(base64);

        const generatedContent = await model.generateContent([prompt, filePart]);
        const textResponse = generatedContent.response.candidates![0].content.parts[0].text;

        return NextResponse.json({ 
            text: textResponse 
        }, { 
            status: 200 
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ 
            error: 'Failed to process image' 
        }, { 
            status: 500 
        });
    }
}

function fileToGenerativePart(imageData: string) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageData.substring(
                imageData.indexOf(":") + 1,
                imageData.lastIndexOf(";")
            ),
        },
    };
}

export const runtime = 'edge'; // Add this for better performance on Vercel