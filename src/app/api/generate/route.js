import { NextResponse } from "next/server";
import { OpenAIStream } from "../../../utils/OpenAIStream";
// import { Configuration, OpenAIApi } from "openai";

export const runtime = 'edge'


// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// if (!configuration.apiKey) {
//     throw new Error("No OPENAI_API_KEY environment variable found");
// }

// const openai = new OpenAIApi(configuration);

export async function POST(request) {
    const body = await request.json();

    const prompt = body.keywords.length === 0
        ? "(Eres un desarrollador web experimentado, con varios años siendo desarrollador y siempre curioso de las nuevas tecnologias que se presentan para el desarrollo frontend). ¡Hola! ¿Podrías ayudarme a generar una idea?  Estoy buscando programar un proyecto de ejemplo, ya que me encuentro en proceso de aprendizaje utilizando el framework NextJS con Typescript y desarrolaria la idea que me indiques bajo estas tecnologias. Me gustaría crear algo interesante para practicar conceptos como data-fetching, manejo de estados, api context, etcetera. Prefiero algo no muy extenso y con funciones concretas. Mi intencion es que sea una app frontend sin necesidad de un backend de momento. Por favor, proporciona una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante, asi como algun indicio de como comenzar el desarrollo.  En lo posible evita juegos y cosas complejas. ¡Gracias!"
        : `(Eres un desarrollador web experimentado, con varios años siendo desarrollador y siempre curioso de las nuevas tecnologias que se presentan para el desarrollo frontend). ¡Hola! ¿Podrías ayudarme a generar una idea?  Estoy buscando programar un proyecto de ejemplo, ya que me encuentro en proceso de aprendizaje utilizando el framework NextJS con Typescript y desarrolaria la idea que me indiques bajo estas tecnologias. Me gustaría crear algo interesante para practicar conceptos como data-fetching, manejo de estados, api context, etcetera. Prefiero algo no muy extenso y con funciones concretas. Mi intencion es que sea una app frontend sin necesidad de un backend de momento. Me gustaría que la idea este relacionada con este grupo de palabras clave: ${body.keywords.join(', ')}. Por favor, proporciona una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante, asi como algun indicio de como comenzar el desarrollo.  En lo posible evita juegos y cosas complejas. ¡Gracias!`

    const payload = {
        // model: "text-davinci-003",
        // prompt,
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 300,
        stream: true,
        n: 1,
    };

    try {

        console.log('sending request to openai');
        const stream = await OpenAIStream(payload);
        // const res = await openai.createCompletion(payload);
        console.log('received response from openai');

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache'
            }
        });


    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
