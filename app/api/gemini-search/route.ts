import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Provide information about the medicine "${query}" in the following format:
    Name: [Medicine Name]
    Generic Name: [Generic Name if available, otherwise "Unknown"]
    Description: [Brief description of the medicine]
    Indications: [What the medicine is used for]
    Warnings: [Important warnings or side effects]
    Dosage: [General dosage information]
    
    If you don't have information about this specific medicine, provide general information about the drug class or similar medicines.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the generated text into an object
    const lines = text.split('\n')
    const medicineInfo: { [key: string]: string } = {}
    lines.forEach(line => {
      const [key, value] = line.split(': ')
      if (key && value) {
        medicineInfo[key.toLowerCase()] = value.trim()
      }
    })

    return NextResponse.json(medicineInfo)
  } catch (error) {
    console.error('Error fetching data from Gemini:', error)
    return NextResponse.json({ error: 'Failed to fetch medicine data from Gemini' }, { status: 500 })
  }
}

