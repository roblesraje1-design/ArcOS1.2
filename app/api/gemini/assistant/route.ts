import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemState } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "AI is currently offline because the GEMINI_API_KEY is not configured.",
        action: null,
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

    const systemInstruction = `
You are ArcOS AI Assistant, an integrated AI for ArcOS (a macOS-style web operating system).
You can answer any question knowledgeable and politely, AND you can control the operating system by specifying an action when the user requests an OS change.

Current OS Status:
- Theme: ${systemState?.theme || "dark"}
- Accent Color: ${systemState?.accentColor || "#3b82f6"}
- Volume: ${systemState?.volume ?? 50}%
- Brightness: ${systemState?.brightness ?? 100}%
- Wi-Fi: ${systemState?.wifi ? "ON" : "OFF"}
- Bluetooth: ${systemState?.bluetooth ? "ON" : "OFF"}
- Night Light: ${systemState?.nightLight ? "ON" : "OFF"}
- Auto-hide Dock: ${systemState?.autoHideDock ? "ON" : "OFF"}
- Available Apps: "settings", "browser", "files", "terminal", "weather", "clock", "neuralcore", "devstudio", "drive", "docs", "slides"

Available OS Actions (if user asks to do something in the OS):
- "OPEN_APP": payload is { "appId": "settings" | "browser" | "files" | "terminal" | "weather" | "clock" | "neuralcore" | "devstudio" | "drive" | "docs" | "slides", "title": string }
- "TOGGLE_DARK_MODE": toggle theme between dark and light
- "SET_THEME": payload is { "theme": "dark" | "light" | "glass" }
- "SET_VOLUME": payload is { "volume": number (0-100) }
- "SET_BRIGHTNESS": payload is { "brightness": number (10-100) }
- "TOGGLE_WIFI": toggle wifi on/off
- "TOGGLE_BLUETOOTH": toggle bluetooth on/off
- "TOGGLE_NIGHT_LIGHT": toggle night light
- "TOGGLE_AUTOHIDE_DOCK": toggle dock auto-hiding
- "SET_WALLPAPER": payload is { "url": string, "name": string }
- "LOCK_SCREEN": locks the screen

Return your answer strictly matching the JSON schema.
- reply: Friendly, conversational, concise markdown response. If an action was taken, mention that you executed it!
- action: Optional action object with "type" and "payload", or null if it's purely an informational/general question.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "The response message to the user.",
            },
            action: {
              type: Type.OBJECT,
              description: "Optional OS action to perform.",
              properties: {
                type: {
                  type: Type.STRING,
                  description: "The action name, e.g., OPEN_APP, TOGGLE_DARK_MODE, SET_VOLUME, SET_BRIGHTNESS, TOGGLE_WIFI, TOGGLE_BLUETOOTH, TOGGLE_NIGHT_LIGHT, TOGGLE_AUTOHIDE_DOCK, SET_WALLPAPER, LOCK_SCREEN",
                },
                payload: {
                  type: Type.OBJECT,
                  description: "Parameters for the action.",
                  properties: {
                    appId: { type: Type.STRING },
                    title: { type: Type.STRING },
                    theme: { type: Type.STRING },
                    volume: { type: Type.NUMBER },
                    brightness: { type: Type.NUMBER },
                    url: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                },
              },
            },
          },
          required: ["reply"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return NextResponse.json({
      reply: parsed.reply || "I've processed your request.",
      action: parsed.action || null,
    });
  } catch (error: any) {
    console.error("Assistant API Error:", error);
    return NextResponse.json(
      {
        reply: "I am having trouble connecting right now, but I can still assist with local OS controls!",
        action: null,
      },
      { status: 200 }
    );
  }
}
