import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Message, StreamData, streamText } from "ai";
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

// const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY ?? "",
// });

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GOOGLE_API_KEY
});

const model = google('models/gemini-1.5-pro', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        console.log(reqBody);

        const messages: Message[] = reqBody.messages;
        const userQuestion = `${messages[messages.length - 1].content}`;

        const reportData: string = reqBody.data.reportData;
        const query = `Represent this for searching relevant passages: patient medical report says: \n${reportData}. \n\n${userQuestion}`;

        // const retrievals = await queryPineconeVectorStore(pinecone, 'index-one', "testspace", query);

        const finalPrompt = `Here is a summary of a patient's clinical report, and a user query. Some generic clinical findings are also provided that may or may not be relevant for the report.
        Go through the clinical report and answer the user query.
        Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and the clinical report.
        Before answering you may enrich your knowledge by going through the provided clinical findings. 
        The clinical findings are generic insights and not part of the patient's medical report. Do not include any clinical finding if it is not relevant for the patient's case.

        \n\n**Patient's Clinical report summary:** \n${reportData}. 
        \n**end of patient's clinical report** 

        \n\n**User Query:**\n${userQuestion}?
        \n**end of user query** 

        \n\nProvide thorough justification for your answer.
        \n\n**Answer:**
        `;

        const data = new StreamData();
        // data.append({
        //     retrievals: retrievals
        // });

        const result = await streamText({
            model: model,
            prompt: finalPrompt,
            onFinish() {
                data.close();
            }
        });

        return result.toDataStreamResponse({ data });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}