import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey)
    throw new Error("No OPENAI_API_KEY environment variable found");

const openai = new OpenAIApi(configuration);

export async function POST(request) {
    const body = await request.json();

    //   better error handling
    if (!body.prompt || body.prompt.length === 0) {
        return NextResponse.error(new Error("You must provide a prompt"), {
            status: 400,
        });
    }

    const prompt = body.keywords 
                    ? "¡Hola! Estoy buscando una idea para programar un proyecto de ejemplo utilizando Next.js y TypeScript. Me gustaría crear algo interesante y útil. ¿Podrías ayudarme a generar una idea? Por favor, proporciona una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante. ¡Gracias!"
                    : `Estoy buscando una idea para programar un proyecto de ejemplo utilizando Next.js y TypeScript. Me gustaría crear algo relacionado con ${keywords}. Por favor, genera una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante. ¡Gracias!`;
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Tell me a joke to develoepers, focused on ${body.prompt}`,
            temperature: 0.8,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return NextResponse.json(response.data.choices[0].text);
    } catch (error) {
        return NextResponse.error(error, { status: 500 });
    }
}