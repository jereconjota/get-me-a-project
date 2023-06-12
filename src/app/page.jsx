"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from "eventsource-parser";
import Spinner from "@/components/Spinner";

function HomePage() {
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState(["goku", "vegeta"]);
    const [readableResult, setReadableResult] = useState("");

    const generateIdea = async () => {
        setLoading(true);
        setReadableResult("");

        const peyload = JSON.stringify({ keywords });
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: peyload
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            // const data = response.body;
            // if (!data) {
            //     return;
            // }
            // const reader = data.getReader();
            // const decoder = new TextDecoder();
            // let done = false;

            // while (!done) {
            //     const { value, done: doneReading } = await reader.read();
            //     done = doneReading;
            //     const chunkValue = decoder.decode(value);
            //     console.log(chunkValue);
            //     setReadableResult((prev) => prev + chunkValue);
            // }



            // This data is a ReadableStream
            const data = response.body;
            if (!data) {
                return;
            }

            const onParse = (event) => {
                if (event.type === "event") {
                    const data = event.data;
                    try {
                        const text = JSON.parse(data).text ?? ""
                        setReadableResult((prev) => prev + text);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

            // https://web.dev/streams/#the-getreader-and-read-methods
            const reader = data.getReader();
            const decoder = new TextDecoder();
            const parser = createParser(onParse);
            let done = false;
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                parser.feed(chunkValue);
            }
            setLoading(false);

        } catch (error) {
            toast.error("Algo salio mal 😢 intenta de nuevo");
            console.log('❌👉', error);
            setLoading(false);
            setKeyword("");
            return;
        }
    };

    const addKeyword = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setKeywords([...keywords, keyword]);
            setKeyword("");
        }
    };

    const removeKeyword = (e) => {
        e.preventDefault();
        const btn = e.target;
        const text = btn.parentElement.innerText;
        const kw = text.slice(0, text.length - 1).trim();

        console.log(kw);
        setKeywords(keywords.filter((k) => k !== kw));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        generateIdea(keyword);
    };

    return (
        <div className="flex flex-wrap justify-start items-start text-white p-5 ">
            <div className="w-full md:w-1/2">
                <form onSubmit={onSubmit} className="bg-zinc-900 p-10 rounded-lg m-2">
                    <h1 className="text-xl font-bold text-slate-200 mb-5">
                        Te doy una idea de proyecto para que practiques

                    </h1>
                    <div className="flex justify-start items-center gap-8">
                        <button
                            type="submit"
                            className="bg-indigo-700 p-2 rounded-md block my-2 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading
                                ? "Escribiendo... 💡"
                                : "Dale decime 🤓"
                            }
                        </button>
                        {
                            loading && <Spinner />
                        }
                    </div>
                    <p className="text-md font-bold text-slate-200 mt-10 mb-2">
                        Podes agregar palabras clave para orientar la respuesta
                    </p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Palabras clave"
                        onChange={(e) => setKeyword(e.target.value)}
                        className="p-2 rounded-md block bg-neutral-700 text-white w-3/4 text-md"
                        value={keyword}
                        autoFocus
                        onKeyDown={addKeyword}
                        disabled={loading}
                    />
                    <ul className="text-md flex gap-5 mt-5">            {
                        keywords.map((kw) => (
                            <li className="bg-indigo-500 p-1 rounded-md" key={kw} >{kw} <button onClick={removeKeyword}>❌</button></li>
                        ))
                    }
                    </ul>
                </form>
            </div>

            {readableResult && (
                <div className="w-full md:w-1/2">
                    <p className="font-bold bg-zinc-900 rounded-lg p-10 m-2">
                        {readableResult}
                    </p>
                </div>
            )}
        </div>
    );
}

export default HomePage;