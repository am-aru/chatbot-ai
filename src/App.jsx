import { useState } from 'react'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  const apiKey = import.meta.env.VITE_API_KEY;


  async function generateAnswer(){
    console.log("loading..")
    const response = await axios({
      method: 'post',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      data : {
        "contents": [{
          "parts":[{"text": "Explain how AI works"}]
          }]
         }
    });
    console.log(response);
  }

  return (
    <>
     <h1>chatbot</h1>
       <button onClick={generateAnswer}>Generate Answer</button>
    </>
  )
}

export default App
