import Head from "next/head"
import Image from "next/image"
import { useState } from "react"
import buildspaceLogo from "../assets/buildspace-logo.png"

const Home = () => {
  const [userInput, setUserInput] = useState("")

  const [apiOutput, setApiOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  async function callGenerate() {
    setIsGenerating(true)

    console.log("Calling OpenAI...")
    const resp = await fetch("api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    })

    const { output } = await resp.json()

    console.log("Calling replied...", output.text)
    setApiOutput(`${output.text}`)

    setIsGenerating(false)
  }

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Create a simple Keto-diet meal</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Enter the total calories, the composition of macros, and preferred ingredients, along
              with excluded ingredients.
            </h2>
          </div>
        </div>

        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="Total calories about 1200..."
            value={userInput}
            onChange={handleUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={isGenerating ? "generate-button loading" : "generate-button"}
              onClick={callGenerate}
            >
              <div className="generate">
                {isGenerating ? <span className="loader" /> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  )

  function handleUserChangedText(event) {
    const input = event.target.value
    setUserInput(input)
  }
}

export default Home
