import { NextRequest } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { fetchTranscript } from "@/lib/youtube-transcript";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

function transformData(data: any[]) {
    let text = "";

    data.forEach((item) => {
        text += item.text + " ";
    });

    return {
        data: data,
        text: text.trim(),
    };
}

const TEMPLATE = `
INSTRUCTIONS: 
  For the this {text} complete the following steps.
  Generate the title based on the content provided
  Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.
  
  Write a youtube video description
    - Include heading and sections.  
    - Incorporate keywords and key takeaways

  Generate bulleted list of key points and benefits

  Return possible and best recommended key words
`;

async function generateSummary(content: string, template: string) {
    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_MODEL ?? "davinci-002",
        temperature: process.env.OPENAI_TEMPERATURE
            ? parseFloat(process.env.OPENAI_TEMPERATURE)
            : 0.7,
        maxTokens: process.env.OPENAI_MAX_TOKENS
            ? parseInt(process.env.OPENAI_MAX_TOKENS)
            : 4000,
    });

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    try {
        const summary = await chain.invoke({ text: content });
        return summary;
    } catch (error) {
        if (error instanceof Error)
            return new Response(JSON.stringify({ error: error.message }));
        return new Response(
            JSON.stringify({ error: "Failed to generate summary." })
        );
    }
}

export async function POST(req: NextRequest) {

    const user = await getUserMeLoader();
    const token = await getAuthToken();

    if (!user.ok || !token)
        return new Response(
            JSON.stringify({ data: null, error: "Not authenticated" }),
            { status: 401 }
        );

    if (user.data.credits < 1)
        return new Response(
            JSON.stringify({
                data: null,
                error: "Insufficient credits",
            }),
            { status: 402 }
        );




    const body = await req.json();
    const { videoId } = body;

    let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

    try {
        transcript = await fetchTranscript(videoId);

        const transformedData = transformData(transcript);

        let summary: Awaited<ReturnType<typeof generateSummary>>;

        summary = await generateSummary(transformedData.text, TEMPLATE);
        return new Response(JSON.stringify({
            data: `**Title:** Quickstart Guide to Launching Your Project with Strapi in Just 3 Minutes

**YouTube Video Description:**

**Heading:** Fast Track Your Development with Strapi: A 3-Minute Quickstart Guide

**Introduction:**
Join me today as we explore how to get your project up and running with Strapi in just three minutes! Strapi is an open-source headless CMS that simplifies the process of building, managing, and deploying content. Whether you're a developer, content creator, or project manager, this guide is designed to help you kickstart your project effortlessly.

**Sections:**

- **Setting Up Your Strapi Project:**
  - Learn how to create a new Strapi project using the quickstart command to leverage default configurations, including setting up an SQLite database.

Rest of summary...`, error: null
        }));

    } catch (error) {
        console.error("Error processing request:", error);
        if (error instanceof Error)
            return new Response(JSON.stringify({ error: error }));
        return new Response(JSON.stringify({ error: "Unknown error" }));
    }
}