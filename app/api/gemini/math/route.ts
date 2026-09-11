import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mode, equation, p1, p2, query } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        solution: "Gemini API key is not configured.",
        steps: ["Please provide GEMINI_API_KEY to enable AI Math solving."],
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = "";
    if (mode === "equation") {
      prompt = `Solve this mathematical equation or system of equations step by step: "${equation}".
Provide the final answer clearly at the beginning, followed by numbered logical steps, explanation of key concepts used, and verification/check.`;
    } else if (mode === "midpoint") {
      prompt = `Given Point A = (${p1.x}, ${p1.y}) and Point B = (${p2.x}, ${p2.y}),
Calculate the midpoint using the midpoint formula M = ((x1 + x2)/2, (y1 + y2)/2).
Provide the exact coordinates (in fraction form if applicable) and decimal approximation, along with each step clearly formatted.`;
    } else if (mode === "distance") {
      prompt = `Given Point A = (${p1.x}, ${p1.y}) and Point B = (${p2.x}, ${p2.y}),
Calculate the Euclidean distance using d = sqrt((x2 - x1)^2 + (y2 - y1)^2).
Provide the exact simplified radical form (e.g. 5√2) and decimal approximation, with step-by-step calculation of delta x, delta y, squaring, and square root reduction.`;
    } else {
      prompt = `You are an expert mathematics AI tutor. Solve and explain this math problem in detail: "${query}".
Break down the problem clearly with formula references and step-by-step work.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master mathematics solver. Provide clean, readable, formatted explanations. Use standard mathematical notation and clear numbered steps.",
      },
    });

    return NextResponse.json({
      result: response.text || "Unable to solve equation.",
    });
  } catch (error: any) {
    console.error("Math API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to solve math problem." },
      { status: 500 }
    );
  }
}
