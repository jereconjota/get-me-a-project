import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
    throw new Error("No OPENAI_API_KEY environment variable found");
}

const openai = new OpenAIApi(configuration);

export async function POST(request) {
    const body = await request.json();

    const prompt = body.keywords.length === 0
                    ? "¡Hola! Eres un desarrollador web experimentado, con varios años utilizando tecnologia de vanguardia y siempre curioso de las nuevas tecnologias que se presentan para el desarrollo frontend. ¿Podrías ayudarme a generar una idea?  Estoy buscando programar un proyecto de ejemplo, ya que me encuentro en proceso de aprendizaje de desarrollo web. Me gustaría crear algo interesante para practicar, de preferencia no muy extenso y con funciones concretas. Mi intencion es que sea una app frontend sin necesidad de ,al menos para este ejercicio, que cuente con un backend. Por favor, proporciona una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante, asi como algun indicio de como comenzar el desarrollo. Tambien recuerda que soy principiante, y que para esta oportunidad quiero desarrollar la idea utilizado el framework NextJS. En lo posible evita juegos y cosas complejas. ¡Gracias!"
                    : `¡Hola! Eres un desarrollador web experimentado, con varios años utilizando tecnologia de vanguardia y siempre curioso de las nuevas tecnologias que se presentan para el desarrollo frontend. ¿Podrías ayudarme a generar una idea?  Estoy buscando programar un proyecto de ejemplo, ya que me encuentro en proceso de aprendizaje de desarrollo web. Me gustaría crear algo interesante para practicar, de preferencia no muy extenso y con funciones concretas. Mi intencion es que sea una app frontend sin necesidad de ,al menos para este ejercicio, que cuente con un backend. Por favor, proporciona una descripción breve pero detallada de la idea, incluyendo los aspectos principales de la funcionalidad y cualquier característica adicional que consideres relevante, asi como algun indicio de como comenzar el desarrollo. Me gustaría que la idea este relacionada con este grupo de palabras clave: ${ body.keywords.join(', ')}. Tambien recuerda que soy principiante, y que para esta oportunidad quiero desarrollar la idea utilizado el framework NextJS. En lo posible evita juegos y cosas complejas. ¡Gracias!`;
                    
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 2000,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return NextResponse.json( response.data.choices[0].text );
    } catch (error) {
        return NextResponse.error(error, { status: 500 });
    }
}