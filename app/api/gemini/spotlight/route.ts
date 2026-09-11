import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ results: null });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: `Search for "${query}" on Google`,
        webResults: [
          {
            title: `${query} - Google Search`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            domain: "google.com",
            snippet: `Search Google for ${query} and discover web results, articles, and media.`,
          },
        ],
        imageResults: [
          {
            title: `${query} Image`,
            url: `https://picsum.photos/seed/${encodeURIComponent(query)}/600/400`,
            source: "Web",
          },
        ],
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
You are ArcOS Spotlight Neural Search.
When a user searches for something, provide:
1. summary: A concise, highly informative 1-2 sentence answer or overview.
2. webResults: 3-4 realistic and accurate web search results with title, realistic URL, domain, and snippet.
3. imageKeywords: 3 descriptive image search terms related to the query.
Return strictly valid JSON adhering to the schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Search query: "${query}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            webResults: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                },
                required: ["title", "url", "domain", "snippet"],
              },
            },
            imageKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "webResults"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");

    // Generate high quality image search visual previews using Unsplash seeds
    const imageKeywords = parsed.imageKeywords || [query];
    const imageResults = imageKeywords.slice(0, 4).map((kw: string, i: number) => ({
      title: kw,
      url: `https://images.unsplash.com/photo-${[
        "1507525428034-b723cf961d3e",
        "1451187580459-43490279c0fa",
        "1518770660439-4636190af475",
        "1498050108023-c5249f4df085"
      ][i % 4]}?q=80&w=600&auto=format&fit=crop`,
      source: "Google Images",
      searchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(kw)}`,
    }));

    return NextResponse.json({
      summary: parsed.summary || `Top search results for "${query}"`,
      webResults: parsed.webResults || [],
      imageResults,
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      googleImagesUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
    });
  } catch (error: any) {
    console.error("Spotlight API Error:", error);
    return NextResponse.json({
      summary: `Google Search for "${req}"`,
      webResults: [
        {
          title: `Search Google for query`,
          url: `https://www.google.com/search?q=${encodeURIComponent("search")}`,
          domain: "google.com",
          snippet: "Open web results in Google Search.",
        },
      ],
      imageResults: [],
    });
  }
}
