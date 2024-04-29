// frontend/src/components/EchoTest.js
import React, { useState } from "react";

function EchoTest() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendEcho = async () => {
    const response = await fetch("http://localhost:3000/echo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setResponse(data.echo);
  };

  return (
    <div>
      <input type="text" value={input} onChange={handleInputChange} />
      <button onClick={sendEcho}>Send Echo</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default EchoTest;
// This component is a simple form that sends a POST request to the /echo endpoint of the Express server. The input field is controlled by the input state, and the response from the server is displayed below the form.
