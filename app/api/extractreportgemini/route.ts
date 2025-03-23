import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const prompt = `Attached is an image of a clinical report. 
Identify biomarkers showing abnormalities and summarize the findings. Ensure numerical values and key details are included, but exclude personal information.`;

export async function POST(req: Request) {
    try {
        const { base64 } = await req.json();
        if (!base64 || typeof base64 !== "string") {
            return NextResponse.json({ error: "Invalid or missing image data" }, { status: 400 });
        }

        console.log("Processing medical report...");

        const filePart = {
            inlineData: {
                data: base64.split(",")[1],
                mimeType: base64.split(";")[0].split(":")[1],
            },
        };

        const generatedContent = await model.generateContent([prompt, filePart]);

        if (!generatedContent.response?.candidates) {
            throw new Error("Failed to get AI response");
        }

        return NextResponse.json({ text: generatedContent.response.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to process report" }, { status: 500 });
    }
}

export const runtime = "edge";