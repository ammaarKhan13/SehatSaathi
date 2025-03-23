import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_PROMPT = `
You are an AI Medical Assistant. Your role includes:
- **Disease Prediction:** Analyze symptoms and suggest probable conditions.
- **Medical Guidance:** Provide practical health advice.
- **First Aid Assistance:** Guide users through emergency situations like burns, choking, and bleeding.
- **Health & Wellness Tips:** Offer insights on diet, exercise, and mental well-being.
- **Clarifying Questions:** If the input lacks detail, ask natural follow-up questions.
- **Dynamic Responses:** Adjust response length based on query complexity.
- **Genuine & Conversational Tone:** Speak in a human-like, empathetic manner.
- **Medical Disclaimer:** Ensure users know this is not a substitute for professional medical advice.
`;

const INSTRUCTIONS = `
1️⃣ If the user provides symptoms → Analyze them and suggest possible conditions. Also try to give first aid remedies.
2️⃣ If the user asks a general medical question → Provide a detailed yet easy-to-understand response.Provide links to sources if necessary.
3️⃣ If the user describes an emergency → Give clear, immediate first aid steps. The response should be based on urgency and gravity of the situation.
4️⃣ If symptoms indicate a serious issue → Urge them to seek medical attention. Try to give first aid advice if necessary.
5️⃣ If the input is vague → Ask relevant follow-up questions before giving advice.
6️⃣ Keep responses **concise for simple queries** and **detailed for complex ones**.
7️⃣ Responses should **feel warm, natural, and reassuring**.
`;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid input: No query provided' }, { status: 400 });
    }

    console.log('Processing user query:', query);

    // Determine response complexity
    const complexity = query.length > 100 ? "detailed" : "concise";

    // Initialize the AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Sending request to Gemini API...');

    // Process user input with dynamic response instruction
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: INSTRUCTIONS },
      { text: `User Query: ${query}\n\nResponse type: ${complexity}` }
    ]);

    const response = await result.response;
    const aiResponse = response.text();

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Medical assistant error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
