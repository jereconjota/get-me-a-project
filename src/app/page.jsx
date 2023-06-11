"use client";
import { useState } from "react";

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(["goku", "vegeta"]);

  const generateIdea = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
      return;
    }
    setKeyword("");
    setLoading(false);
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
          <button
            type="submit"
            className="bg-indigo-700 p-2 rounded-md block my-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Mmmm estoy pensando 🤔"
              : "Dame una idea💡"
            }
          </button>
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
              <li className="bg-indigo-500 px-1 rounded-sm" key={kw} >{kw} <button onClick={removeKeyword}>❌</button></li>
            ))
          }
          </ul>
        </form>
      </div>

      {result && (
        <div className="w-full md:w-1/2">
          <p className="font-bold bg-zinc-900 rounded-lg p-10 m-2">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;