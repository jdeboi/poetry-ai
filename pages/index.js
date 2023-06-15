import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [poetryInput, setPoetryInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poemPrompt: poetryInput }),
      });

      
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }


      let formattedText = data.result.replace(/\n/g, "<br>");
      formattedText = formattedText.split("<br>");
      setResult(formattedText);
      setIsLoading(false);
      setPoetryInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Poetry Generator</title>
        {/* <link rel="icon" href="/dog.png" /> */}
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3>a cl<span className="aiLetters">ai</span>rvoyant poetry reading:</h3>
        {isLoading ? <div>loading...</div> :
          <div className="poemForm">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="prompt"
                placeholder="Enter a prompt"
                value={poetryInput}
                onChange={(e) => setPoetryInput(e.target.value)}
              />
              <input type="submit" value="Generate poem" />
            </form>
            <div className={styles.result}>{result.map((str, i) => {
              return (<div className="poemLine" key={i}>{str}</div>)
            })}</div>
          </div>
        }

      </main>
    </div>
  );
}
